import React from 'react';

interface BentoGridProps {
    children: React.ReactNode;
    className?: string;
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
    return (
        <div className={`grid ${className}`}>
            {children}
        </div>
    );
}

export function BentoGridItem({
    children,
    className = '',
    colSpan = 1,
    rowSpan = 1
}: {
    children: React.ReactNode;
    className?: string;
    colSpan?: number;
    rowSpan?: number;
}) {
    // Map span numbers to classes if needed, or inline styles/classes
    // Using simple logic for now assuming standard utility classes
    const spanClasses = [
        colSpan > 1 ? `col-span-${colSpan}` : '',
        rowSpan > 1 ? `row-span-${rowSpan}` : ''
    ].filter(Boolean).join(' ');

    return (
        <div className={`card ${spanClasses} ${className}`} style={{
            // Fallback for custom spans if classes not present
            gridColumn: colSpan > 1 ? `span ${colSpan}` : undefined,
            gridRow: rowSpan > 1 ? `span ${rowSpan}` : undefined
        }}>
            {children}
        </div>
    );
}
