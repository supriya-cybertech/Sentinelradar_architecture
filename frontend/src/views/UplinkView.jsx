import React, { useState, useEffect, useRef } from 'react';
import { Send, Terminal } from 'lucide-react';

const UplinkView = () => {
    const [logs, setLogs] = useState([
        { id: 1, type: 'info', message: 'SENTINEL UPLINK ESTABLISHED. You are communicating with the planetary defense AI node.', timestamp: new Date().toLocaleTimeString() },
        { id: 2, type: 'system', message: 'Ready for risk assessments or NEO queries.', timestamp: new Date().toLocaleTimeString() }
    ]);
    const [input, setInput] = useState('');
    const logEndRef = useRef(null);
    const ws = useRef(null);

    useEffect(() => {
        // Connect to WebSocket
        ws.current = new WebSocket('ws://localhost:8000/ws/comms');

        ws.current.onopen = () => {
            setLogs(prev => [...prev, { id: Date.now(), type: 'system', message: '>> SECURE SOCKET CONNECTION ESTABLISHED.', timestamp: new Date().toLocaleTimeString() }]);
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setLogs(prev => [...prev, {
                id: Date.now(),
                type: data.type || 'info',
                message: data.message,
                timestamp: new Date().toLocaleTimeString()
            }]);
        };

        ws.current.onclose = () => {
            setLogs(prev => [...prev, { id: Date.now(), type: 'error', message: '>> CONNECTION LOST. ATTEMPTING RECONNECT...', timestamp: new Date().toLocaleTimeString() }]);
        };

        return () => {
            if (ws.current) ws.current.close();
        };
    }, []);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const handleSend = () => {
        if (!input.trim()) return;

        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(input);
            // Optimistic update
            const userMsg = { id: Date.now(), type: 'user', message: input, timestamp: new Date().toLocaleTimeString() };
            setLogs(prev => [...prev, userMsg]);
        } else {
            setLogs(prev => [...prev, { id: Date.now(), type: 'error', message: '>> ERROR: UPLINK OFFLINE', timestamp: new Date().toLocaleTimeString() }]);
        }
        setInput('');
    };

    return (
        <div className="flex flex-col h-full w-full max-w-5xl mx-auto p-4">
            <div className="bg-sentinel-panel border border-sentinel-border flex-1 flex flex-col overflow-hidden relative shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                {/* Header Bar of Terminal */}
                <div className="bg-sentinel-bg/50 p-2 border-b border-sentinel-border flex items-center justify-between text-xs text-sentinel-dim uppercase">
                    <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-sentinel-cyan animate-pulse" />
                        <span>SENTINEL_NODE_ALPHA</span>
                    </div>
                    <span>ENCRYPTION: AES-256-GCM // WS: ONLINE</span>
                </div>

                {/* Logs Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm scrollbar-thin scrollbar-thumb-sentinel-cyan/20">
                    {logs.map((log) => (
                        <div key={log.id} className={`flex ${log.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 border ${log.type === 'user'
                                ? 'bg-sentinel-cyan/10 border-sentinel-cyan text-sentinel-cyan'
                                : (log.type === 'error' ? 'bg-sentinel-red/10 border-sentinel-red text-sentinel-red' : 'bg-black/40 border-sentinel-dim/30 text-sentinel-text')
                                }`}>
                                {log.type !== 'user' && <span className="text-[10px] text-sentinel-warning block mb-1">[{log.timestamp}] SYSTEM</span>}
                                <p>{log.message}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={logEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-sentinel-bg/80 border-t border-sentinel-border flex items-center space-x-4">
                    <Terminal className="w-5 h-5 text-sentinel-dim" />
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="ENTER QUERY (e.g., 'STATUS', 'SCAN')"
                        className="flex-1 bg-transparent border-none outline-none text-sentinel-cyan placeholder-sentinel-dim/50 uppercase tracking-widest font-mono text-sm"
                    />
                    <button
                        onClick={handleSend}
                        className="px-4 py-2 bg-sentinel-cyan text-sentinel-bg font-bold text-xs uppercase hover:bg-white transition-colors"
                    >
                        TRANSMIT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UplinkView;
