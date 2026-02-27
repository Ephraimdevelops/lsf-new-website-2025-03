import { useEffect, useState } from 'react';

// Generates a simple UUID v4
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const useVisitorId = () => {
    const [visitorId, setVisitorId] = useState<string>('');

    useEffect(() => {
        // Run only on client side
        if (typeof window !== 'undefined') {
            let storedId = localStorage.getItem('lsf_visitor_id');

            if (!storedId) {
                storedId = generateUUID();
                localStorage.setItem('lsf_visitor_id', storedId);
            }

            setVisitorId(storedId);
        }
    }, []);

    return visitorId;
};
