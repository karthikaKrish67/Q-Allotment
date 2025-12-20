import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { User, Bell, Search } from 'lucide-react';

const Navbar = () => {
    const { user } = useContext(AuthContext);

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10 transition-all">
            <div className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-2xl w-96">
                <Search size={18} className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Search records..."
                    className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-gray-400"
                />
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                    <div className="text-right flex flex-col">
                        <span className="text-sm font-bold text-gray-900 leading-none capitalize">{user?.username || 'Admin'}</span>
                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mt-1">{user?.role || 'Staff'}</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white premium-shadow">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
