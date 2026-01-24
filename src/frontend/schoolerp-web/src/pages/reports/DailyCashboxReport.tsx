import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface CashboxReport {
    reportDate: string;
    campusId: number | null;
    totalTransactions: number;
    totalCash: number;
    totalBankTransfer: number;
    totalKHQR: number;
    totalCheque: number;
    grandTotal: number;
    transactions: {
        paymentId: number;
        receiptNumber: string;
        paymentDate: string;
        amount: number;
        paymentMethod: string;
        referenceNumber?: string;
        invoiceNumber: string;
        studentCode: string;
        studentName: string;
        isVoided?: boolean;
    }[];
}

const DailyCashboxReport: React.FC = () => {
    const { currentCampusId } = useAuth();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [report, setReport] = useState<CashboxReport | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const response = await api.get('/reports/daily-cashbox', {
                params: { date, campusId: currentCampusId }
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

    const handleRequestVoid = async (paymentId: number) => {
        const reason = prompt("Please enter a reason for voiding this payment:");
        if (!reason) return;

        try {
            await api.post(`/finance/payments/${paymentId}/void-request`, { reason });
            alert("Void request submitted successfully. Awaiting manager approval.");
            fetchReport(); // Refresh
        } catch (error: any) {
            console.error("Failed to request void:", error);
            alert(error.response?.data?.message || "Failed to submit void request");
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Daily Cashbox Report</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={{ padding: '0.5rem' }}
                    />
                    <button
                        onClick={fetchReport}
                        disabled={loading}
                        style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        {loading ? 'Loading...' : 'Generate'}
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
                    {/* Summary Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ backgroundColor: '#e8f5e9', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.875rem', color: '#666' }}>Cash</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2e7d32' }}>${report.totalCash.toFixed(2)}</div>
                        </div>
                        <div style={{ backgroundColor: '#e3f2fd', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.875rem', color: '#666' }}>Bank Transfer</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1565c0' }}>${report.totalBankTransfer.toFixed(2)}</div>
                        </div>
                        <div style={{ backgroundColor: '#fff3e0', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.875rem', color: '#666' }}>KHQR</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e65100' }}>${report.totalKHQR.toFixed(2)}</div>
                        </div>
                        <div style={{ backgroundColor: '#f3e5f5', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.875rem', color: '#666' }}>Cheque</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7b1fa2' }}>${report.totalCheque.toFixed(2)}</div>
                        </div>
                        <div style={{ backgroundColor: '#ffebee', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.875rem', color: '#666' }}>Total</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#c62828' }}>${report.grandTotal.toFixed(2)}</div>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa' }}>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Receipt #</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Time</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Student</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Invoice</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Method</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Amount</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                                            No transactions found for this date.
                                        </td>
                                    </tr>
                                ) : (
                                    report.transactions.map(tx => (
                                        <tr key={tx.paymentId} style={{ borderBottom: '1px solid #dee2e6' }}>
                                            <td style={{ padding: '0.75rem' }}>{tx.receiptNumber}</td>
                                            <td style={{ padding: '0.75rem' }}>{new Date(tx.paymentDate).toLocaleTimeString()}</td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <div>{tx.studentName}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#666' }}>{tx.studentCode}</div>
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>{tx.invoiceNumber}</td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem',
                                                    backgroundColor: tx.paymentMethod === 'Cash' ? '#e8f5e9' : '#e3f2fd',
                                                    color: tx.paymentMethod === 'Cash' ? '#2e7d32' : '#1565c0'
                                                }}>
                                                    {tx.paymentMethod}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold' }}>
                                                ${tx.amount.toFixed(2)}
                                            </td>
                                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                {tx.isVoided ? (
                                                    <span style={{ color: '#dc3545', fontWeight: 'bold', fontSize: '0.75rem' }}>VOIDED</span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleRequestVoid(tx.paymentId)}
                                                        style={{
                                                            padding: '0.25rem 0.5rem',
                                                            backgroundColor: '#dc3545',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >
                                                        Refund/Void
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            {report.transactions.length > 0 && (
                                <tfoot>
                                    <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                                        <td colSpan={5} style={{ padding: '0.75rem', textAlign: 'right' }}>Total ({report.totalTransactions} transactions):</td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>${report.grandTotal.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default DailyCashboxReport;
