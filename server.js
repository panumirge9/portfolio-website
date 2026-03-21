const nodemailer = require('nodemailer');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); // 1. Import Mongoose

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and serve frontend files
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 2. Connect to MongoDB (Local or Cloud)
// Use the environment variable if it exists, otherwise fallback to local
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolioDB';

mongoose.connect(dbURI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((error) => console.error('❌ MongoDB Connection Error:', error));

// 3. Create a Schema and Model for Client Messages
const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now } // Automatically saves the exact date/time
});

const ClientMessage = mongoose.model('ClientMessage', messageSchema);

// 4. API Route to handle the contact form submission
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Create a new database entry using the model
        const newLead = new ClientMessage({ name, email, message });
        
        // Save it to MongoDB
        await newLead.save();
        console.log(`📩 New Lead Saved: ${name} (${email})`);

       // --- EMAIL NOTIFICATION SETUP ---
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // This means we will upgrade to secure TLS later
            requireTLS: true, // Forces modern TLS encryption
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS  
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Sending the email to yourself
            subject: `🚀 New Portfolio Lead: ${name}`,
            text: `You have a new message from your portfolio website!\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`
        };

        await transporter.sendMail(mailOptions);
        console.log("📧 Email notification sent successfully!");
        // --------------------------------

        res.status(200).json({ success: true, message: "Lead received and saved." });

    } catch (error) {
        console.error("Error saving lead:", error);
        res.status(500).json({ success: false, message: "Failed to save lead." });
    }
});

// Catch-all route to serve the portfolio frontend
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Portfolio live at http://localhost:${PORT}`);
});