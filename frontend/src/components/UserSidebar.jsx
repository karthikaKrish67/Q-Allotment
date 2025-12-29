import { Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Home,
    FileText,
    User,
    LogOut,
    Building2,
    List,
    Layers,
    Binary,
    ChevronDown,
    ChevronRight,
    Search,
    Bell
} from 'lucide-react';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';

const UserSidebar = ({ activeSection, setActiveSection, isCollapsed, toggleCollapse }) => {
    const { logout } = useContext(AuthContext);
    const [isDirectoryOpen, setIsDirectoryOpen] = useState(true);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        {
            id: 'directory',
            label: 'Quarter Directory',
            icon: Building2,
            hasSubmenu: true,
            submenu: [
                { id: 'dir-blocks', label: 'Blocks', icon: Layers },
                { id: 'dir-quarters', label: 'Quarters', icon: Home },
                { id: 'dir-types', label: 'Types', icon: List },
            ]
        },
        { id: 'allotment', label: 'My Allotment', icon: Home },
        { id: 'report', label: 'Confirmation Report', icon: FileText },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    return (
        <div className={`bg-[#0f172a] text-white flex flex-col h-screen shadow-2xl transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} overflow-hidden border-r border-gray-800 z-30 relative`}>
            {/* Logo Area */}
            <div className="h-20 flex items-center px-6 gap-3 border-b border-gray-800 bg-[#0f172a]">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-blue-500/20 shrink-0">
                    <Building2 size={24} className="text-white" />
                </div>
                {!isCollapsed && (
                    <div className="flex flex-col animate-in fade-in duration-300">
                        <span className="font-bold text-lg tracking-tight leading-none">ResidencyHub</span>
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-1">User Portal</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
                <nav className="px-3 space-y-1">
                    {menuItems.map((item) => {
                        if (item.hasSubmenu) {
                            return (
                                <div key={item.id} className="space-y-1">
                                    <button
                                        onClick={() => !isCollapsed && setIsDirectoryOpen(!isDirectoryOpen)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${(activeSection.startsWith('dir-'))
                                            ? 'bg-blue-600/10 text-blue-400 font-medium'
                                            : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon size={20} className={`${activeSection.startsWith('dir-') ? 'text-blue-400' : 'group-hover:text-gray-200'}`} />
                                            {!isCollapsed && <span>{item.label}</span>}
                                        </div>
                                        {!isCollapsed && (
                                            isDirectoryOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                                        )}
                                    </button>

                                    {/* Submenu */}
                                    {!isCollapsed && isDirectoryOpen && (
                                        <div className="pl-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                                            {item.submenu.map((subItem) => (
                                                <button
                                                    key={subItem.id}
                                                    onClick={() => setActiveSection(subItem.id)}
                                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${activeSection === subItem.id
                                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                                        : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'
                                                        }`}
                                                >
                                                    <subItem.icon size={16} />
                                                    <span>{subItem.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        const isActive = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 font-medium'
                                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                                    }`}
                            >
                                <item.icon size={20} className={`${isActive ? 'text-white' : 'group-hover:text-gray-200'}`} />
                                {!isCollapsed && <span>{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Logout Footer */}
            <div className="p-4 border-t border-gray-800 bg-[#0f172a]">
                <button
                    onClick={logout}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors group ${isCollapsed ? 'justify-center' : ''}`}
                    title="Logout"
                >
                    <LogOut size={20} className="group-hover:text-red-400" />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default UserSidebar;
