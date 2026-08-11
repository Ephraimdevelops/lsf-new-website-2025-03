# Mobile SARA Assistant Phase

## What changed

Added a real mobile SARA screen connected to the existing authenticated SARA backend.

Implemented:

- `mobile/app/sara.tsx`
- Stack route registration for `/sara`
- Home dashboard `Ask SARA` action now opens SARA
- Auth gate for private chat history
- Quick prompts in Swahili and English
- User message persistence via `sara_chat.sendMessage`
- Assistant response via `sara_actions.ask`
- Chat history via `sara_chat.getMessages`
- Clear history control via `sara_chat.clearHistory`
- Structured paralegal recommendation cards from backend `::PARALEGAL_CARD:{...}::` tokens
- Call action for recommended paralegals when a phone number is present
- Request-help CTA that routes from a SARA recommendation into guided intake
- Safety copy clarifying that SARA is not emergency service or lawyer replacement

## Backend used

- `sara_chat.getMessages`
- `sara_chat.sendMessage`
- `sara_chat.clearHistory`
- `sara_actions.ask`

The backend already includes emergency keyword bypass, budget guard, maintenance kill switch, and RAG confidence handling.

## Remaining

- Mobile feedback controls for SARA answers.
- Better source/citation display from retrieved knowledge chunks.
- Offline fallback guidance when SARA is unavailable.
