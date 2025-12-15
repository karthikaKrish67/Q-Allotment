import { Link } from 'react-router-dom';
// import { Home, Users, Home as HomeIcon, CreditCard, AlertCircle } from 'lucide-react'; // Icons later

const Sidebar = () => {
    return (
        <div className="bg-gray-800 text-white w-64 flex flex-col">
            <div className="h-16 flex items-center justify-center font-bold text-xl border-b border-gray-700">
                Residency System
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav>
                    <Link to="/" className="block py-2.5 px-4 hover:bg-gray-700">Dashboard</Link>
                    <Link to="/unemployees" className="block py-2.5 px-4 hover:bg-gray-700">UnEmployees</Link>
                    <Link to="/quarters" className="block py-2.5 px-4 hover:bg-gray-700">Quarters</Link>
                    <Link to="/billing" className="block py-2.5 px-4 hover:bg-gray-700">Billing</Link>
                    <Link to="/complaints" className="block py-2.5 px-4 hover:bg-gray-700">Complaints</Link>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
