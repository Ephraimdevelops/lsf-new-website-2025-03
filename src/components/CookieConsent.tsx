import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Check } from 'lucide-react';

/**
 * GDPR-Compliant Cookie Consent Banner
 * 
 * Features:
 * - Non-intrusive bottom-right toast style
 * - Saves consent to localStorage
 * - Only shows once until accepted
 * - Bilingual support (English/Swahili)
 */

const COOKIE_CONSENT_KEY = 'lsf_cookie_consent';

interface CookieConsentProps {
    language?: 'en' | 'sw';
}

const CookieConsent = ({ language = 'en' }: CookieConsentProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) {
            // Show banner after a short delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
            accepted: true,
            timestamp: Date.now(),
            version: '1.0'
        }));
        setIsVisible(false);
    };

    const handleDecline = () => {
        // Still save that user made a choice (declined)
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
            accepted: false,
            timestamp: Date.now(),
            version: '1.0'
        }));
        setIsVisible(false);
    };

    const content = {
        en: {
            title: 'Cookie Notice',
            message: 'We use cookies to improve your experience and analyze site usage.',
            accept: 'Accept',
            decline: 'Decline',
            learnMore: 'Learn more',
        },
        sw: {
            title: 'Taarifa ya Kuki',
            message: 'Tunatumia kuki kuboresha uzoefu wako na kuchambua matumizi ya tovuti.',
            accept: 'Kubali',
            decline: 'Kataa',
            learnMore: 'Soma zaidi',
        },
    };

    const t = content[language];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="fixed bottom-6 right-6 z-[9999] max-w-sm"
                >
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Cookie className="w-4 h-4 text-primary" />
                                </div>
                                <span className="font-semibold text-gray-900">{t.title}</span>
                            </div>
                            <button
                                onClick={handleDecline}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-5 py-4">
                            <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                {t.message}
                            </p>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleAccept}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors"
                                >
                                    <Check className="w-4 h-4" />
                                    {t.accept}
                                </button>
                                <button
                                    onClick={handleDecline}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    {t.decline}
                                </button>
                            </div>

                            {/* Learn More Link */}
                            <div className="mt-3 text-center">
                                <a
                                    href="/privacy"
                                    className="text-xs text-gray-400 hover:text-primary underline transition-colors"
                                >
                                    {t.learnMore}
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;
