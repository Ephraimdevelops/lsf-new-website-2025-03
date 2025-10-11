# Sara AI - n8n Integration Setup Guide

## Overview
This guide explains how to set up Sara AI with n8n for intelligent legal assistance on the LSF website.

## 1. Sara AI Features

### Core Capabilities
- **24/7 Legal Assistant**: Available around the clock
- **Tanzanian Law Expert**: Trained on local laws and regulations
- **ChatGPT-like Interface**: Modern, intuitive chat experience
- **Webhook Integration**: Seamless n8n integration for AI processing
- **Secure & Private**: All conversations are encrypted and secure

### Legal Areas Covered
- Land Rights and Property Law
- Family Law and Marriage Issues
- Employment and Labor Rights
- Business Law and Contracts
- Gender-based Violence Support
- Climate Justice and Environmental Rights
- Human Rights and Civil Liberties

## 2. n8n Webhook Setup

### Step 1: Create n8n Workflow
1. Create a new workflow in n8n
2. Add a **Webhook** node as the trigger
3. Set the webhook URL (this will be your endpoint)
4. Configure the webhook to accept POST requests

### Step 2: Webhook Configuration
```json
{
  "method": "POST",
  "path": "sara-legal-assistant",
  "authentication": "none",
  "responseMode": "responseNode"
}
```

### Step 3: Expected Input Format
The webhook will receive:
```json
{
  "message": "User's legal question",
  "timestamp": "2024-01-15T10:30:00Z",
  "userId": "anonymous",
  "sessionId": "unique-session-id",
  "userAgent": "browser-info",
  "source": "sara-ai-web-interface"
}
```

### Step 4: AI Processing Nodes
Add these nodes to your n8n workflow:

1. **AI Node** (OpenAI/ChatGPT/Local AI)
   - Configure with legal knowledge base
   - Set system prompt for Tanzanian legal context
   - Include safety guidelines and limitations

2. **Knowledge Base Node**
   - Connect to legal database
   - Include Tanzanian law references
   - Add LSF resources and guides

3. **Response Processing Node**
   - Format response appropriately
   - Add disclaimers
   - Include relevant resources

### Step 5: Response Format
Return this format to the webhook:
```json
{
  "response": "Sara's legal advice response",
  "confidence": 0.95,
  "sources": ["Tanzania Law Act 2023", "LSF Legal Guide"],
  "disclaimer": "This is general legal information, not specific legal advice",
  "followUp": "Would you like more information about this topic?"
}
```

## 3. Website Integration

### Frontend (SaraAI.tsx)
- Modern ChatGPT-like interface
- Real-time messaging
- Typing indicators
- Message history
- Mobile responsive design

### Backend Integration
- Webhook endpoint: `/api/sara-webhook`
- CORS enabled for cross-origin requests
- Error handling and fallback responses
- Session management

## 4. n8n Workflow Example

### Basic Workflow Structure:
```
Webhook Trigger
    ↓
Parse User Message
    ↓
Check Legal Category
    ↓
Query Knowledge Base
    ↓
Generate AI Response
    ↓
Add Disclaimers
    ↓
Format Response
    ↓
Return to Website
```

### Advanced Workflow Features:
- **Context Memory**: Remember conversation history
- **Legal Category Detection**: Route to specific legal experts
- **Escalation**: Connect to human lawyers when needed
- **Analytics**: Track common legal questions
- **Multi-language**: Support Swahili and English

## 5. Security Considerations

### Data Protection
- All messages encrypted in transit
- No permanent storage of sensitive legal information
- GDPR compliance for user data
- Session-based tracking only

### Legal Disclaimers
- Clear indication that responses are general information
- Recommendation to consult qualified lawyers for specific advice
- Emergency contact information for urgent legal matters

## 6. Testing & Deployment

### Testing Checklist
- [ ] Webhook receives messages correctly
- [ ] AI responses are relevant and accurate
- [ ] Error handling works properly
- [ ] Mobile interface is responsive
- [ ] Legal disclaimers are displayed
- [ ] Session management functions correctly

### Deployment Steps
1. Deploy n8n workflow
2. Update webhook URL in website configuration
3. Test end-to-end functionality
4. Monitor performance and user feedback
5. Iterate and improve based on usage

## 7. Monitoring & Analytics

### Key Metrics to Track
- Number of conversations per day
- Average response time
- User satisfaction ratings
- Most common legal questions
- Escalation rate to human lawyers

### n8n Monitoring
- Workflow execution success rate
- Response time metrics
- Error logs and debugging
- AI model performance

## 8. Future Enhancements

### Planned Features
- Voice input/output capabilities
- Document upload and analysis
- Multi-language support (Swahili)
- Integration with Haki Yangu app
- Advanced legal document generation
- Appointment booking with real lawyers

### Technical Improvements
- Faster response times
- Better context understanding
- Enhanced legal knowledge base
- Improved user interface
- Mobile app integration

## 9. Support & Maintenance

### Regular Maintenance
- Update legal knowledge base monthly
- Monitor AI response quality
- Review and improve workflows
- Update security measures
- Backup conversation logs (anonymized)

### Contact Information
- Technical Support: tech@lsftz.org
- Legal Questions: legal@lsftz.org
- General Support: support@lsftz.org

---

**Note**: This integration provides general legal information and should not be considered as specific legal advice. Users should always consult with qualified lawyers for their specific legal matters.
