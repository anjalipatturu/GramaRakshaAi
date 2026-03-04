const express = require('express');
const router = express.Router();
const ChatLog = require('../models/ChatLog');
const User = require('../models/User');
const chatbotService = require('../services/ai/chatbotService');
const { v4: uuidv4 } = require('uuid');

// Process chat message
router.post('/message', async (req, res) => {
  try {
    const { message, language, userId, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    let context = {};
    if (userId) {
      const user = await User.findById(userId).populate('villageId');
      if (user) {
        context.user = user;
        context.village = user.villageId;
      }
    }

    const triageResponse = await chatbotService.processMessage(
      message, 
      language, 
      userId, 
      context
    );

    const chatSessionId = sessionId || uuidv4();
    
    let chatLog = await ChatLog.findOne({ sessionId: chatSessionId });
    
    if (!chatLog) {
      chatLog = new ChatLog({
        userId: userId || null,
        sessionId: chatSessionId,
        messages: []
      });
    }

    chatLog.messages.push({
      role: 'user',
      content: message,
      language: triageResponse.language,
      timestamp: new Date()
    });

    // Store the full triage response
    chatLog.messages.push({
      role: 'bot',
      content: JSON.stringify(triageResponse),
      language: triageResponse.language,
      timestamp: new Date()
    });

    if (triageResponse.emergency) {
      chatLog.emergencyDetected = true;
      chatLog.emergencyDetails = `Risk Level: ${triageResponse.risk_level}, Score: ${triageResponse.risk_score}`;
    }

    await chatLog.save();

    res.json({
      ...triageResponse,
      sessionId: chatSessionId,
      messageId: chatLog.messages[chatLog.messages.length - 1]._id
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      message: 'Error processing chat message',
      error: error.message 
    });
  }
});

// Get chat history
router.get('/history/:sessionId', async (req, res) => {
  try {
    const chatLog = await ChatLog.findOne({ sessionId: req.params.sessionId });
    
    if (!chatLog) {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    res.json(chatLog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat history', error: error.message });
  }
});

// Get user's chat sessions
router.get('/user/:userId', async (req, res) => {
  try {
    const chatLogs = await ChatLog.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(chatLogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user chats', error: error.message });
  }
});

module.exports = router;
