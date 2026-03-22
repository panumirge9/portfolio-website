const { Resend } = require('resend');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); 

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolioDB';

mongoose.connect(dbURI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((error) => console.error('❌ MongoDB Connection Error:', error));


const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now } 
});

const ClientMessage = mongoose.model('ClientMessage', messageSchema);

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
    
        const newLead = new ClientMessage({ name, email, message });
        
    
        await newLead.save();
        console.log(`📩 New Lead Saved: ${name} (${email})`);

    
        const { Resend } = require('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        await resend.emails.send({
            from: 'onboarding@resend.dev', 
            to: process.env.EMAIL_USER,    
            subject: `🚀 New Portfolio Lead: ${name}`,
            text: `You have a new message from your portfolio website!\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`
        });
        console.log("📧 Email notification sent successfully via Resend!");

        res.status(200).json({ success: true, message: "Lead received and saved." });

    } catch (error) {
        console.error("Error saving lead:", error);
        res.status(500).json({ success: false, message: "Failed to save lead." });
    }
});

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.listen(PORT, () => {
    console.log(`🚀 Portfolio live at http://localhost:${PORT}`);
});