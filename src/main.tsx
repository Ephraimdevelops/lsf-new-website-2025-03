import { createRoot } from 'react-dom/client'
import '@fontsource/ubuntu/300.css'
import '@fontsource/ubuntu/400.css'
import '@fontsource/ubuntu/500.css'
import '@fontsource/ubuntu/700.css'
import App from './App.tsx'
import './index.css'

import { ConvexClientProvider } from './components/ConvexClientProvider';

createRoot(document.getElementById("root")!).render(
    <ConvexClientProvider>
        <App />
    </ConvexClientProvider>
);
