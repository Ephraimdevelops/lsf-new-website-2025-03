import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Youtube, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SaraFloatingWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
            <AnimatePresence>
                {(isOpen || isHovered) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-72 mb-2 origin-bottom-right"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary shrink-0">
                                <img src="/sara-avatar-v2.png" alt="Saada" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">Karibu! I'm Saada. 👋</h4>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                    I can help you understand Tanzanian laws and finding paralegals near you.
                                </p>
                                <Link
                                    to="/sara"
                                    className="mt-3 inline-flex items-center justify-center w-full px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Chat with Saada
                                </Link>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setIsOpen(!isOpen)}
                className="relative group"
            >
                <span className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></span>
                <div className="relative w-14 h-14 bg-white rounded-full flex items-center justify-center border-2 border-primary/10 shadow-lg overflow-hidden">
                    <img src="/sara-avatar-v2.png" alt="Saada" className="w-full h-full object-cover" />
                </div>
                <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </motion.button>
        </div>
    );
};

export default SaraFloatingWidget;
