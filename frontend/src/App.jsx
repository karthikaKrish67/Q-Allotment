import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { AuthProvider } from './context/AuthContext';

import Dashboard from './pages/Dashboard';
import NonEmployees from './pages/NonEmployees';
import Quarters from './pages/Quarters';

import Billing from './pages/Billing';
import Complaints from './pages/Complaints';

const Layout = ({ children }) => (
  <div className="flex h-screen bg-gray-100">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {children}
      </main>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/nonemployees" element={<Layout><NonEmployees /></Layout>} />
          <Route path="/quarters" element={<Layout><Quarters /></Layout>} />
          <Route path="/billing" element={<Layout><Billing /></Layout>} />
          <Route path="/complaints" element={<Layout><Complaints /></Layout>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
