import React, { useState } from 'react';
import GridBackground from './GridBackground';
import Header from './Header';
import UplinkView from '../views/UplinkView';
import AnalyticsView from '../views/AnalyticsView';
import RadarView from '../views/RadarView';
import ResourceView from '../views/ResourceView';

const AppLayout = () => {
    // Default to 'radar' as requested by user
    const [activeTab, setActiveTab] = useState('radar');

    return (
        <div className="relative flex flex-col w-screen h-screen overflow-hidden text-sentinel-text font-mono">
            <GridBackground />
            <div className="scanline" />

            {/* Header is now a flex item, not fixed, preventing overlap issues */}
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main takes remaining space */}
            <main className="flex-1 relative z-10 w-full overflow-hidden">
                {activeTab === 'radar' && <RadarView />}
                {activeTab === 'mining' && <ResourceView />}
                {activeTab === 'uplink' && <UplinkView />}
                {activeTab === 'analytics' && <AnalyticsView />}

            </main>
        </div>
    );
};

export default AppLayout;
