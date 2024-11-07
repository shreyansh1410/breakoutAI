const express = require("express");
const router = express.Router();
const Email = require("../models/emailModel");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const { RateLimiterMemory } = require("rate-limiter-flexible");

const rateLimiter = new RateLimiterMemory({
  points: 50, // 50 requests
  duration: 60, // Per 60 seconds
});

// Create a new email
router.post("/", async (req, res) => {
  try {
    const { company, location, email, products } = req.body;
    const newEmail = new Email({ company, location, email, products });
    await newEmail.save();
    res.status(201).json(newEmail);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Schedule emails
router.post("/schedule", async (req, res) => {
  try {
    const { cronExpression, emailIds } = req.body;
    const task = cron.schedule(cronExpression, async () => {
      const emails = await Email.find({
        _id: { $in: emailIds },
        status: "pending",
      });
      await sendEmails(emails);
    });
    task.start();
    res.status(200).json({ message: "Emails scheduled successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Send emails
router.post("/send", async (req, res) => {
  try {
    await rateLimiter.consume(req.ip);
    const emails = await Email.find({ status: "pending" });
    await sendEmails(emails);
    res.status(200).json(emails);
  } catch (rejRes) {
    res.status(429).json({ message: "Too many requests" });
  }
});

// Track email delivery
router.post("/track", async (req, res) => {
  try {
    const { emailId, event, email, timestamp } = req.body;
    const emailDoc = await Email.findById(emailId);
    if (!emailDoc) {
      return res.status(404).json({ message: "Email not found" });
    }

    switch (event) {
      case "delivered":
        emailDoc.deliveryStatus = "delivered";
        break;
      case "opened":
        emailDoc.deliveryStatus = "opened";
        break;
      case "bounced":
        emailDoc.deliveryStatus = "bounced";
        break;
      // Handle other events
    }

    await emailDoc.save();
    res.status(200).json({ message: "Email delivery status updated" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

async function sendEmails(emails) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  for (const email of emails) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email.email,
      subject: "Custom Email",
      text: `Hello ${email.company} in ${email.location}. We'd like to discuss our ${email.products} products with you.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      email.status = "sent";
      email.deliveryStatus = "delivered";
      email.sentAt = new Date();
      await email.save();
    } catch (err) {
      email.status = "failed";
      await email.save();
      console.error(`Error sending email to ${email.email}: ${err.message}`);
    }
  }
}

module.exports = router;
