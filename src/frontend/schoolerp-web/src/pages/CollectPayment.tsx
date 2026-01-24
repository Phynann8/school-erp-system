import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import type { InvoiceDto, CreatePaymentDto } from '../types';

const CollectPayment: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preselectedInvoiceId = searchParams.get('invoiceId');

    const [studentSearch, setStudentSearch] = useState('');
    const [invoices, setInvoices] = useState<InvoiceDto[]>([]);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [paymentData, setPaymentData] = useState<CreatePaymentDto>({
        invoiceId: preselectedInvoiceId ? Number(preselectedInvoiceId) : 0,
        amount: 0,
        paymentMethod: 'Cash',
        referenceNumber: ''
    });

    // Search for invoices by student ID or name
    const handleSearch = async () => {
        if (!studentSearch.trim()) return;
        setLoading(true);
        try {
            const response = await api.get('/finance/invoices', {
                params: { q: studentSearch, status: 'Unpaid,PartiallyPaid' }
            });
            setInvoices(response.data.data || []);
        } catch (error) {
            console.error('Search failed:', error);
            alert('Failed to search invoices');
        } finally {
            setLoading(false);
        }
    };

    // Select an invoice for payment
    const selectInvoice = (invoice: InvoiceDto) => {
        setSelectedInvoice(invoice);
        setPaymentData({
            invoiceId: invoice.invoiceId,
            amount: invoice.balance, // Default to full balance
            paymentMethod: 'Cash',
            referenceNumber: ''
        });
    };

    // Submit payment
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInvoice) {
            alert('Please select an invoice first');
            return;
        }
        if (paymentData.amount <= 0) {
            alert('Payment amount must be greater than zero');
            return;
        }
        if (paymentData.amount > selectedInvoice.balance) {
            alert(`Amount cannot exceed balance of $${selectedInvoice.balance.toFixed(2)}`);
            return;
        }

        try {
            const response = await api.post('/finance/payments', paymentData);
            alert(`Payment successful!\nReceipt: ${response.data.receiptNumber}`);
            navigate('/invoices');
        } catch (error: any) {
            console.error('Payment failed:', error);
            const errorMsg = error.response?.data?.message || 'Payment failed. Check console.';
            alert(errorMsg);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
            <h2>Collect Payment</h2>

            {/* Search Section */}
            <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '1.5rem'
            }}>
                <h3>Find Invoice</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Search by Student ID, Name, or Invoice Number..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        style={{ flex: 1, padding: '0.5rem' }}
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        style={{ padding: '0.5rem 1rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>

                {/* Invoice List */}
                {invoices.length > 0 && (
                    <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Invoice #</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Student</th>
                                <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Total</th>
                                <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Balance</th>
                                <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map(inv => (
                                <tr key={inv.invoiceId} style={{ borderBottom: '1px solid #dee2e6' }}>
                                    <td style={{ padding: '0.75rem' }}>{inv.invoiceNumber}</td>
                                    <td style={{ padding: '0.75rem' }}>{inv.studentName}</td>
                                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>${inv.totalAmount.toFixed(2)}</td>
                                    <td style={{ padding: '0.75rem', textAlign: 'right', color: inv.balance > 0 ? 'red' : 'green' }}>
                                        ${inv.balance.toFixed(2)}
                                    </td>
                                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                        <button
                                            onClick={() => selectInvoice(inv)}
                                            style={{ padding: '0.25rem 0.75rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Select
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Payment Form */}
            {selectedInvoice && (
                <div style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <h3>Payment Details</h3>
                    <div style={{ backgroundColor: '#e8f4fd', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
                        <p><strong>Invoice:</strong> {selectedInvoice.invoiceNumber}</p>
                        <p><strong>Student:</strong> {selectedInvoice.studentName}</p>
                        <p><strong>Total Amount:</strong> ${selectedInvoice.totalAmount.toFixed(2)}</p>
                        <p><strong>Already Paid:</strong> ${selectedInvoice.paidAmount.toFixed(2)}</p>
                        <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'red' }}>
                            <strong>Balance Due:</strong> ${selectedInvoice.balance.toFixed(2)}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label>Payment Amount *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    max={selectedInvoice.balance}
                                    value={paymentData.amount}
                                    onChange={(e) => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) || 0 })}
                                    required
                                    style={{ width: '100%', padding: '0.5rem' }}
                                />
                            </div>
                            <div>
                                <label>Payment Method *</label>
                                <select
                                    value={paymentData.paymentMethod}
                                    onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '0.5rem' }}
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="BankTransfer">Bank Transfer</option>
                                    <option value="KHQR">KHQR</option>
                                    <option value="Cheque">Cheque</option>
                                </select>
                            </div>
                        </div>

                        {paymentData.paymentMethod !== 'Cash' && (
                            <div>
                                <label>Reference Number</label>
                                <input
                                    type="text"
                                    placeholder="Transaction ID / Cheque Number"
                                    value={paymentData.referenceNumber || ''}
                                    onChange={(e) => setPaymentData({ ...paymentData, referenceNumber: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem' }}
                                />
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button
                                type="submit"
                                style={{
                                    padding: '0.75rem 2rem',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                ✓ Record Payment
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedInvoice(null)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CollectPayment;
