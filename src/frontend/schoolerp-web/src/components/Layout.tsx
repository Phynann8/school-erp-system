import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Users, BookOpen, CreditCard, LayoutDashboard, FileText, BarChart, AlertCircle } from 'lucide-react';

const Layout: React.FC = () => {
    const { user, currentCampusId, logout, switchCampus } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: 'Inter, sans-serif' }}>
            {/* Sidebar */}
            <div style={{ width: '250px', backgroundColor: '#1e293b', color: 'white', padding: '1rem' }}>
                <h3 style={{ marginBottom: '2rem' }}>SchoolERP</h3>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Link to="/dashboard" style={{ color: '#e2e8f0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link to="/students" style={{ color: '#e2e8f0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Users size={20} /> Students
                    </Link>
                    <Link to="/fees" style={{ color: '#e2e8f0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <BookOpen size={20} /> Fees
                    </Link>
                    <Link to="/invoices" style={{ color: '#e2e8f0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={20} /> Invoices
                    </Link>
                    <Link to="/payments" style={{ color: '#e2e8f0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CreditCard size={20} /> Collect Payment
                    </Link>
                    <Link to="/finance/void-requests" style={{ color: '#e2e8f0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <AlertCircle size={20} /> Void Requests
                    </Link>
                    <Link to="/reports" style={{ color: '#e2e8f0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <BarChart size={20} /> Reports
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Topbar */}
                <header style={{ height: '60px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span>Campus:</span>
                        <select
                            value={currentCampusId || ''}
                            onChange={(e) => switchCampus(Number(e.target.value))}
                            style={{ padding: '0.25rem' }}
                        >
                            {user?.campusAccess.map(ca => (
                                <option key={ca.campusId} value={ca.campusId}>{ca.campusCode}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span>{user?.fullName}</span>
                        <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', backgroundColor: '#f8fafc' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
