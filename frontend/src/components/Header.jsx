import { Radio, ShieldAlert, BarChart3, MessageSquare, Target, Pickaxe, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ activeTab, setActiveTab }) => {
    const { user, logout } = useAuth();

    const navItems = [
        { id: 'radar', label: 'Radar', icon: Target },
        { id: 'mining', label: 'Mining', icon: Pickaxe }, // New Mining Tab
        { id: 'uplink', label: 'Uplink', icon: Radio },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ];

    return (
        // Changed: 'fixed' -> 'relative' or just removed, z-50 kept for overlapping potential background elements
        <header className="relative z-50 h-16 bg-sentinel-bg/90 backdrop-blur-md border-b border-sentinel-border flex-none flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-sentinel-cyan/20 animate-pulse rounded-full flex items-center justify-center border border-sentinel-cyan">
                    <ShieldAlert className="w-5 h-5 text-sentinel-cyan" />
                </div>
                <h1 className="text-xl font-sans font-bold tracking-[0.2em] text-white">
                    SENTINEL<span className="text-sentinel-cyan">RADAR</span>_ARCHITECTURE
                </h1>
            </div>

            <nav className="flex items-center space-x-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`
                px-4 py-2 flex items-center space-x-2 text-sm uppercase tracking-wider font-bold transition-all relative
                ${isActive ? 'text-sentinel-bg bg-sentinel-cyan' : 'text-sentinel-dim hover:text-sentinel-cyan bg-transparent'}
              `}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                            {isActive && (
                                <div className="absolute top-0 right-0 w-2 h-2 bg-white animate-ping" />
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className="flex items-center space-x-4 text-xs text-sentinel-dim font-mono">
                {user ? (
                    <>
                        <div className="flex items-center space-x-2 px-3 py-1 bg-sentinel-cyan/10 border border-sentinel-cyan/30 rounded">
                            <User className="w-3 h-3 text-sentinel-cyan" />
                            <span className="text-sentinel-cyan uppercase">{user.full_name || user.email.split('@')[0]}</span>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center space-x-1 text-red-400 hover:text-red-300 transition-colors"
                            title="Terminate Session"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <span className="animate-pulse text-sentinel-green">● SYSTEM: ONLINE</span>
                )}
            </div>
        </header>
    );
};

export default Header;
