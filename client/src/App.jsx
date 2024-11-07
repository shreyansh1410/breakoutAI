import React from "react";
import EmailForm from "./components/EmailForm";
import EmailDispatcher from "./components/EmailDispatcher";

const App = () => {
  return (
    <div>
      <h1>Email Sender</h1>
      <EmailForm />
      <EmailDispatcher />
    </div>
  );
};

export default App;
