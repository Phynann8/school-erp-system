import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import StudentsList from './pages/StudentsList';
import CreateStudent from './pages/CreateStudent';
import FeeTemplatesList from './pages/FeeTemplatesList';
import CreateFeeTemplate from './pages/CreateFeeTemplate';
import AssignFeePlan from './pages/AssignFeePlan';
import InvoiceList from './pages/InvoiceList';
import CollectPayment from './pages/CollectPayment';
import DailyCashboxReport from './pages/reports/DailyCashboxReport';
import OutstandingDebtReport from './pages/reports/OutstandingDebtReport';
import VoidRequestsPage from './pages/VoidRequestsPage';

// Simple Reports Index
const ReportsIndex: React.FC = () => (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
        <h2>Reports</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
            <Link to="/reports/daily-cashbox" style={{
                backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textDecoration: 'none', color: 'inherit'
            }}>
                <h3>📊 Daily Cashbox</h3>
                <p style={{ color: '#666', marginTop: '0.5rem' }}>View payments collected by date</p>
            </Link>
            <Link to="/reports/outstanding-debt" style={{
                backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textDecoration: 'none', color: 'inherit'
            }}>
                <h3>💰 Outstanding Debt</h3>
                <p style={{ color: '#666', marginTop: '0.5rem' }}>Students with unpaid balances</p>
            </Link>
        </div>
    </div>
);


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        <Route index element={<Navigate to="/dashboard" />} />
                        import Dashboard from './pages/Dashboard';

                        // ... (other imports)

                        // Inside App component
                        <Route path="dashboard" element={<Dashboard />} />

                        {/* Students Module */}
                        <Route path="students" element={<StudentsList />} />
                        <Route path="students/new" element={<CreateStudent />} />
                        <Route path="students/:id/fees" element={<AssignFeePlan />} />
                        <Route path="students/:id/invoices" element={<InvoiceList />} />

                        {/* Fees Module */}
                        <Route path="fees/templates" element={<FeeTemplatesList />} />
                        <Route path="fees/templates/new" element={<CreateFeeTemplate />} />
                        <Route path="fees" element={<Navigate to="/fees/templates" />} />

                        {/* Finance Module */}
                        <Route path="invoices" element={<InvoiceList />} />
                        <Route path="payments" element={<Navigate to="/payments/collect" />} />
                        <Route path="payments/collect" element={<CollectPayment />} />
                        <Route path="finance/void-requests" element={<VoidRequestsPage />} />

                        {/* Reports Module */}
                        <Route path="reports" element={<ReportsIndex />} />
                        <Route path="reports/daily-cashbox" element={<DailyCashboxReport />} />
                        <Route path="reports/outstanding-debt" element={<OutstandingDebtReport />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
