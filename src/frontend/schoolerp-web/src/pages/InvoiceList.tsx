import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import type { InvoiceDto } from '../types';
import { useAuth } from '../context/AuthContext';
import { FileText, DollarSign } from 'lucide-react';

const InvoiceList: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Student ID
    const { currentCampusId } = useAuth();
    const [invoices, setInvoices] = useState<InvoiceDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [studentName, setStudentName] = useState('');

    useEffect(() => {
        if (id && currentCampusId) {
            fetchInvoices();
        }
    }, [id, currentCampusId]);

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const { data } = await api.get<InvoiceDto[]>(`/finance/invoices/student/${id}`);
            setInvoices(data);
            if (data.length > 0) setStudentName(data[0].studentName);
        } catch (error) {
            console.error('Failed to fetch invoices', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateInvoice = async () => {
        if (!id) {
            alert("Please select a student first.");
            return;
        }

        // Simplified auto-invoice for MVP
        try {
            await api.post('/finance/invoices', {
                studentId: Number(id),
                dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
                items: [
                    { description: 'Tuition Fee - Term 1', amount: 500 },
                    { description: 'Material Fee', amount: 50 }
                ]
            });
            alert('Invoice Created');
            fetchInvoices();
        } catch (error) {
            console.error('Failed to create invoice', error);
            alert('Failed to create invoice. Please check console for details.');
        }
    };

    const handlePayment = async (invoiceId: number, balance: number) => {
        const amountStr = prompt(`Enter payment amount (Max: $${balance})`, balance.toString());
        if (!amountStr) return;

        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0 || amount > balance) {
            alert('Invalid amount');
            return;
        }

        try {
            await api.post('/finance/payments', {
                invoiceId,
                amount,
                paymentMethod: 'Cash'
            });
            alert('Payment Recorded');
            fetchInvoices();
        } catch (error) {
            console.error('Failed to record payment', error);
            alert('Failed to record payment');
        }
    };

    // Handle case where accessed via /invoices directly
    if (!id) {
        return (
            <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
                <h2>Invoices</h2>
                <div style={{ padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <FileText size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                    <p style={{ color: '#475569', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                        Please select a student to view or manage their invoices.
                    </p>
                    <a href="/students" style={{
                        display: 'inline-block',
                        backgroundColor: '#007BFF',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        Go to Students List
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Invoices for {studentName || 'Student'}</h2>
                <button
                    onClick={handleCreateInvoice}
                    style={{ backgroundColor: '#007BFF', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <FileText size={16} /> Generate Invoice
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {loading ? <p>Loading...</p> : invoices.map(inv => (
                    <div key={inv.invoiceId} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: `4px solid ${inv.status === 'Paid' ? '#166534' : inv.status === 'Partial' ? '#eab308' : '#dc2626'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ margin: 0 }}>{inv.invoiceNumber}</h3>
                                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                    Isued: {new Date(inv.issueDate).toLocaleDateString()} &middot; Due: {new Date(inv.dueDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>${inv.totalAmount.toFixed(2)}</div>
                                <span style={{
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '999px',
                                    fontSize: '0.8rem',
                                    backgroundColor: inv.status === 'Paid' ? '#dcfce7' : inv.status === 'Partial' ? '#fef9c3' : '#fee2e2',
                                    color: inv.status === 'Paid' ? '#166534' : inv.status === 'Partial' ? '#854d0e' : '#991b1b'
                                }}>
                                    {inv.status}
                                </span>
                            </div>
                        </div>

                        <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {inv.items.map(item => (
                                    <li key={item.invoiceItemId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                        <span>{item.description}</span>
                                        <span>${item.amount.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                            <div style={{ fontSize: '0.9rem' }}>
                                <strong>Paid:</strong> ${inv.paidAmount.toFixed(2)} &middot; <strong>Balance:</strong> ${inv.balance.toFixed(2)}
                            </div>
                            {inv.balance > 0 && (
                                <button
                                    onClick={() => handlePayment(inv.invoiceId, inv.balance)}
                                    style={{ backgroundColor: '#16a34a', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <DollarSign size={16} /> Pay Now
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {!loading && invoices.length === 0 && <p style={{ textAlign: 'center', color: '#64748b' }}>No invoices found for this student.</p>}
            </div>
        </div>
    );
};

export default InvoiceList;
