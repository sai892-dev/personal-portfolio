const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'messages.json');

// Helper: read messages from JSON file
function readMessages() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Helper: write messages to JSON file
function writeMessages(messages) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
}

// POST /api/contact — Submit contact form
router.post('/', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const messages = readMessages();

    const newMessage = {
      id: 'msg-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 5),
      name,
      email,
      subject: subject || 'No Subject',
      message,
      createdAt: new Date().toISOString(),
      read: false
    };

    messages.push(newMessage);
    writeMessages(messages);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! I\'ll get back to you soon.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
  }
});

// GET /api/contact — List all messages (admin)
router.get('/', (req, res) => {
  try {
    const messages = readMessages();
    res.json({ success: true, data: messages, total: messages.length });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

module.exports = router;
