import React, { useState } from 'react';
import { Globe } from 'lucide-react';

export const FaviconIcon: React.FC<{ url?: string; className?: string }> = ({ url, className = 'w-4 h-4' }) => {
    const [error, setError] = useState(false);

    const getDomain = (rawUrl?: string): string | null => {
        if (!rawUrl || rawUrl.includes('{{')) return null;
        try {
            const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
            return parsed.hostname;
        } catch {
            return null;
        }
    };

    const domain = getDomain(url);

    if (!domain || error) {
        return <Globe className={className} />;
    }

    return (
        <img
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
            alt={domain}
            className={`${className} rounded-sm object-contain grayscale contrast-0  brightness-300`}
            onError={() => setError(true)}
        />
    );
};