import * as Sentry from "@sentry/react";
import { createRoot } from 'react-dom/client'
import '@fontsource/ubuntu/300.css'
import '@fontsource/ubuntu/400.css'
import '@fontsource/ubuntu/500.css'
import '@fontsource/ubuntu/700.css'
import App from './App.tsx'
import './index.css'

import { ConvexClientProvider } from './components/ConvexClientProvider';

// ==========================================
// SENTRY ERROR TRACKING
// Production monitoring and error capture
// ==========================================
Sentry.init({
    dsn: "https://5461af2de5197f786784000f6a75be83@o4510734765064192.ingest.de.sentry.io/4510741906718800",
    integrations: [
        Sentry.browserTracingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of transactions

    // Only enable in production
    enabled: process.env.NODE_ENV === 'production',

    // Set environment
    environment: process.env.NODE_ENV,
});

createRoot(document.getElementById("root")!).render(
    <ConvexClientProvider>
        <App />
    </ConvexClientProvider>
);
