import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalEmails: 0,
    sentEmails: 0,
    pendingEmails: 0,
    failedEmails: 0,
  });

  useEffect(() => {
    const socket = io('/');
    socket.on('analytics-update', (data) => {
      setAnalytics(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Email Analytics</h2>
      <div>
        <p>Total Emails: {analytics.totalEmails}</p>
        <p>Sent Emails: {analytics.sentEmails}</p>
        <p>Pending Emails: {analytics.pendingEmails}</p>
        <p>Failed Emails: {analytics.failedEmails}</p>
      </div>
    </div>
  );
};

export default Dashboard;