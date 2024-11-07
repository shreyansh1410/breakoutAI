import React, { useState, useEffect } from "react";
import axios from "axios";

const EmailDispatcher = () => {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get("/api/emails");
        setEmails(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmails();
  }, []);

  const handleSendEmails = async () => {
    try {
      await axios.post("/api/emails/send");
      alert("Emails sent successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* Email table */}
      <button onClick={handleSendEmails}>Send Emails</button>
    </div>
  );
};

export default EmailDispatcher;
