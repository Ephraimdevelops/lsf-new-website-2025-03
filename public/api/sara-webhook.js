// Sara AI Webhook for n8n Integration
// This file handles the communication between the Sara AI chat interface and n8n

const SARA_WEBHOOK_URL = 'YOUR_N8N_WEBHOOK_URL_HERE'; // Replace with your actual n8n webhook URL

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, timestamp, userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Prepare data for n8n
    const n8nPayload = {
      message: message,
      timestamp: timestamp,
      userId: userId || 'anonymous',
      sessionId: req.headers['x-session-id'] || Date.now().toString(),
      userAgent: req.headers['user-agent'],
      source: 'sara-ai-web-interface'
    };

    // Send to n8n webhook
    const n8nResponse = await fetch(SARA_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(n8nPayload)
    });

    if (!n8nResponse.ok) {
      throw new Error(`n8n webhook responded with status: ${n8nResponse.status}`);
    }

    const n8nData = await n8nResponse.json();

    // Return response to client
    res.status(200).json({
      success: true,
      response: n8nData.response || n8nData.message || "I'm here to help with your legal questions. Could you please provide more details?",
      timestamp: new Date().toISOString(),
      sessionId: n8nPayload.sessionId
    });

  } catch (error) {
    console.error('Sara AI Webhook Error:', error);
    
    // Fallback response when n8n is unavailable
    res.status(200).json({
      success: false,
      response: "I'm currently experiencing technical difficulties. Please try again in a moment or contact our support team at support@lsftz.org for immediate assistance.",
      timestamp: new Date().toISOString(),
      error: 'Service temporarily unavailable'
    });
  }
}

// For Vercel/Netlify deployment
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}
