import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Home,
    CreditCard,
    MessageSquare,
    LogOut
} from 'lucide-react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useContext(AuthContext);

    const menuItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/nonemployees', label: 'Non-Employees', icon: Users },
        { path: '/quarters', label: 'Quarters', icon: Home },
        { path: '/billing', label: 'Billing', icon: CreditCard },
        { path: '/complaints', label: 'Complaints', icon: MessageSquare },
    ];

    return (
        <div className="sidebar-gradient text-white w-64 flex flex-col h-screen premium-shadow overflow-hidden">
            <div className="h-20 flex items-center px-6 gap-3 border-b border-gray-700/50">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <Home size={24} className="text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight">SmartQ Admin</span>
            </div>

            <div className="flex-1 overflow-y-auto py-6">
                <nav className="px-3 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-blue-600/20 text-blue-400 font-medium border-l-4 border-blue-500'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                    }`}
                            >
                                <Icon size={20} className={`${isActive ? 'text-blue-400' : 'group-hover:text-gray-200'}`} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-gray-700/50">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors group"
                >
                    <LogOut size={20} className="group-hover:text-red-400" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
