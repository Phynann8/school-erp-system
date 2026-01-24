import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface DebtorDto {
    studentId: number;
    studentCode: string;
    studentName: string;
    className: string;
    campusId: number;
    totalInvoices: number;
    totalOwed: number;
    oldestDueDate: string;
}

interface DebtReport {
    campusId: number | null;
    totalDebtors: number;
    totalOutstandingAmount: number;
    debtors: DebtorDto[];
}

const OutstandingDebtReport: React.FC = () => {
    const { currentCampusId } = useAuth();
    const [report, setReport] = useState<DebtReport | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const response = await api.get('/reports/outstanding-debt', {
                params: { campusId: currentCampusId }
            });
            setReport(response.data);
        } catch (error) {
            console.error('Failed to fetch report:', error);
            alert('Failed to load report');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentCampusId) {
            fetchReport();
        }
    }, [currentCampusId]);

    const handlePrint = () => {
        window.print();
    };

    const getDaysOverdue = (dueDate: string) => {
        const due = new Date(dueDate);
        const today = new Date();
        const diffTime = today.getTime() - due.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Outstanding Debt Report</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={fetchReport}
                        disabled={loading}
                        style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                    <button
                        onClick={handlePrint}
                        style={{ padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        🖨️ Print
                    </button>
                </div>
            </div>

            {report && (
                <>
                    {/* Summary */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ backgroundColor: '#ffebee', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.875rem', color: '#666' }}>Total Debtors</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#c62828' }}>{report.totalDebtors}</div>
                        </div>
                        <div style={{ backgroundColor: '#fff3e0', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.875rem', color: '#666' }}>Total Outstanding</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e65100' }}>${report.totalOutstandingAmount.toFixed(2)}</div>
                        </div>
                    </div>

                    {/* Debtors Table */}
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa' }}>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Student</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Class</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Invoices</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Days Overdue</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Amount Owed</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.debtors.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                                            🎉 No outstanding debts! All invoices are paid.
                                        </td>
                                    </tr>
                                ) : (
                                    report.debtors.map(debtor => {
                                        const daysOverdue = getDaysOverdue(debtor.oldestDueDate);
                                        return (
                                            <tr key={debtor.studentId} style={{ borderBottom: '1px solid #dee2e6' }}>
                                                <td style={{ padding: '0.75rem' }}>
                                                    <div style={{ fontWeight: '500' }}>{debtor.studentName}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#666' }}>{debtor.studentCode}</div>
                                                </td>
                                                <td style={{ padding: '0.75rem' }}>{debtor.className}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center' }}>{debtor.totalInvoices}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                    <span style={{
                                                        padding: '0.25rem 0.5rem',
                                                        borderRadius: '4px',
                                                        fontSize: '0.75rem',
                                                        backgroundColor: daysOverdue > 30 ? '#ffebee' : daysOverdue > 7 ? '#fff3e0' : '#e8f5e9',
                                                        color: daysOverdue > 30 ? '#c62828' : daysOverdue > 7 ? '#e65100' : '#2e7d32'
                                                    }}>
                                                        {daysOverdue > 0 ? `${daysOverdue} days` : 'Current'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold', color: '#c62828' }}>
                                                    ${debtor.totalOwed.toFixed(2)}
                                                </td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                    <Link
                                                        to={`/students/${debtor.studentId}/invoices`}
                                                        style={{
                                                            padding: '0.25rem 0.75rem',
                                                            backgroundColor: '#007bff',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            textDecoration: 'none',
                                                            fontSize: '0.875rem'
                                                        }}
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default OutstandingDebtReport;
