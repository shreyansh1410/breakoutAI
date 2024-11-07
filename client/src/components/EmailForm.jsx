import React, { useState } from "react";
import axios from "axios";

const EmailForm = () => {
  const [formData, setFormData] = useState({
    company: "",
    location: "",
    email: "",
    products: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/emails", formData);
      setFormData({ company: "", location: "", email: "", products: "" });
      alert("Email added to queue");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Add Email</button>
    </form>
  );
};

export default EmailForm;
