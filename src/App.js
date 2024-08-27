import React, { useState } from 'react';
import './App.css';
import EmailService from './EmailService';
import MockEmailProvider1 from './provider/MockEmailProvider1';
import MockEmailProvider2 from './provider/MockEmailProvider2';
import './App.css';

function App() {
    const emailService = new EmailService([new MockEmailProvider1(), new MockEmailProvider2()]);

    const [email] = useState({ id: 'email1', to: 'user@example.com', body: 'Hello!' });
    const [status, setStatus] = useState([]);

    const sendEmail = async () => {
        await emailService.sendEmail(email);
        setStatus(emailService.getStatus());
    };

    const getStatusClass = (status) => {
        if (status.includes('successfully')) return 'success';
        if (status.includes('failed')) return 'error';
        if (status.includes('Rate limit exceeded')) return 'warning';
        return '';
    };

    return (
        <div className="container">
            <h1>Email Sending Service</h1>
            <button onClick={sendEmail}>Send Email</button>
            <h2>Status:</h2>
            <ul className="status-list">
                {status.map((s, index) => (
                    <li key={index} className={getStatusClass(s.status)}>
                        {s.timestamp.toString()}: {s.status}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
