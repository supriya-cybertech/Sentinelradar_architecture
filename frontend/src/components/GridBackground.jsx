import React from 'react';

const GridBackground = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-sentinel-bg">
            {/* Base Grid */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `
            linear-gradient(to right, #00f0ff 1px, transparent 1px),
            linear-gradient(to bottom, #00f0ff 1px, transparent 1px)
          `,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                }}
            />

            {/* Moving Horizon Grid (Retro Style) */}
            <div className="absolute inset-0 bg-gradient-to-t from-sentinel-cyan/5 to-transparent opacity-30" />

            {/* Random Particles/Stars can be added here */}
        </div>
    );
};

export default GridBackground;
