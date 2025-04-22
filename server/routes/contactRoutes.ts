// server/routes/contactRoutes.ts
import express from 'express';
import Contact from '../models/Contact';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Validate environment variables on startup
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('Missing email credentials in environment variables');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/', async (req, res) => {
  try {
    const { name, email, subject = '', message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and message are required' 
      });
    }

    const newContact = new Contact({
      name,
      email,
      subject,
      message,
    });
    
    await newContact.save();
    
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `New Contact: ${subject || 'No subject'}`,
        text: `
          Name: ${name}
          Email: ${email}
          Subject: ${subject || 'None'}
          Message: ${message}
        `,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || 'None'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      };
      
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Email failed to send:', emailError);
      // Don't fail the request just because email failed
    }
    
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Server error' 
    });
  }
});

export default router;