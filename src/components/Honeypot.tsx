import { useState } from 'react';

interface HoneypotProps {
    /** The field name used for the honeypot (default: "roleTitle") */
    fieldName?: string;
    /** Callback when honeypot value changes (pass to your form handler) */
    onValueChange?: (value: string) => void;
}

/**
 * Honeypot Component - Anti-Bot Protection
 * 
 * This renders a hidden input field that bots will fill out but humans won't see.
 * If the field has any value when submitted, the submission should be silently rejected.
 * 
 * Usage:
 * ```tsx
 * const [honeypotValue, setHoneypotValue] = useState('');
 * 
 * <Honeypot onValueChange={setHoneypotValue} />
 * 
 * // In your submit handler:
 * if (honeypotValue) {
 *   console.log('Bot detected');
 *   return; // Silently reject
 * }
 * ```
 */
export function Honeypot({ fieldName = "roleTitle", onValueChange }: HoneypotProps) {
    const [value, setValue] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        onValueChange?.(newValue);
    };

    return (
        <div
            aria-hidden="true"
            style={{
                position: 'absolute',
                left: '-9999px',
                top: '-9999px',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
                opacity: 0,
                pointerEvents: 'none',
            }}
        >
            <label htmlFor={fieldName}>
                Please leave this field empty
            </label>
            <input
                type="text"
                id={fieldName}
                name={fieldName}
                value={value}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
                aria-label="Please leave this field empty"
            />
        </div>
    );
}

/**
 * Hook for honeypot state management
 * 
 * Usage:
 * ```tsx
 * const { honeypotValue, honeypotProps, isBotDetected } = useHoneypot();
 * 
 * // In form:
 * <Honeypot {...honeypotProps} />
 * 
 * // In submit:
 * if (isBotDetected()) return;
 * ```
 */
export function useHoneypot(fieldName: string = "roleTitle") {
    const [honeypotValue, setHoneypotValue] = useState('');

    return {
        honeypotValue,
        honeypotProps: {
            fieldName,
            onValueChange: setHoneypotValue,
        },
        /** Returns true if bot behavior detected (honeypot filled) */
        isBotDetected: () => honeypotValue.trim() !== '',
        /** Reset honeypot (for form reset) */
        reset: () => setHoneypotValue(''),
    };
}

export default Honeypot;
