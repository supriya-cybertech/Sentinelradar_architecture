import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail } from 'lucide-react';
import GridBackground from '../components/GridBackground';

const LoginView = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to login');
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-sentinel-bg text-sentinel-text font-mono">
            <GridBackground />
            <div className="scanline" />

            <div className="relative z-10 w-full max-w-md p-8 bg-sentinel-panel border border-sentinel-border shadow-[0_0_50px_rgba(0,240,255,0.1)]">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-sentinel-cyan/20 rounded-full flex items-center justify-center border border-sentinel-cyan mb-4 animate-pulse">
                        <ShieldCheck className="w-8 h-8 text-sentinel-cyan" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-[0.2em] text-white">
                        SENTINEL<span className="text-sentinel-cyan">ACCESS</span>
                    </h1>
                    <p className="text-xs text-sentinel-dim mt-2 tracking-widest uppercase">Identity Verification Required</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-900/20 border border-red-500/50 text-red-500 text-xs uppercase text-center font-bold">
                        ⚠ ACCESS DENIED: {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs text-sentinel-dim uppercase font-bold ml-1">Personnel ID</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-sentinel-dim" />
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-sentinel-border text-sentinel-cyan pl-10 pr-4 py-2 focus:outline-none focus:border-sentinel-cyan focus:ring-1 focus:ring-sentinel-cyan/50 placeholder-sentinel-dim/30 transition-all"
                                placeholder="Personnel ID (e.g. sup)"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-sentinel-dim uppercase font-bold ml-1">Security Clearance (Password)</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-sentinel-dim" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-sentinel-border text-sentinel-cyan pl-10 pr-4 py-2 focus:outline-none focus:border-sentinel-cyan focus:ring-1 focus:ring-sentinel-cyan/50 placeholder-sentinel-dim/30 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-sentinel-cyan/10 border border-sentinel-cyan text-sentinel-cyan hover:bg-sentinel-cyan hover:text-black transition-all uppercase font-bold tracking-widest text-sm relative overflow-hidden group"
                    >
                        {loading ? 'AUTHENTICATING...' : 'INITIATE SESSION'}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-sentinel-dim">
                    NO CLEARANCE? <Link to="/register" className="text-sentinel-cyan hover:underline">REQUEST ACCESS</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
