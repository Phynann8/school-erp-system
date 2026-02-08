import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import type { InvoiceDto } from '../types';
import { useAuth } from '../context/AuthContext';
import { FileText, DollarSign, Plus, Download } from 'lucide-react';

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
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <FileText size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-dark mb-2">No Student Selected</h2>
                    <p className="text-slate-500 mb-6">
                        Please select a student from the Students list to manage their invoices.
                    </p>
                    <a href="/students" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-all">
                        Go to Students List
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-dark">Invoices</h2>
                    <p className="text-slate-500 text-sm">Managing invoices for {studentName || 'Student'}</p>
                </div>
                <button
                    onClick={handleCreateInvoice}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    <Plus size={18} />
                    <span className="text-sm font-medium">Generate Invoice</span>
                </button>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="bg-white p-8 rounded-xl text-center text-slate-500">Loading invoices...</div>
                ) : invoices.map(inv => (
                    <div key={inv.invoiceId} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold text-dark">#{inv.invoiceNumber}</h3>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${inv.status === 'Paid' ? 'bg-success/10 text-success border-success/20' :
                                            inv.status === 'Partial' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                'bg-danger/10 text-danger border-danger/20'
                                        }`}>
                                        {inv.status}
                                    </span>
                                </div>
                                <div className="text-sm text-slate-500 flex gap-4">
                                    <span>Issued: {new Date(inv.issueDate).toLocaleDateString()}</span>
                                    <span>Due: {new Date(inv.dueDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-dark">${inv.totalAmount.toFixed(2)}</div>
                                <div className="text-sm text-slate-400">Total Amount</div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="bg-slate-50/50 p-6">
                            <ul className="space-y-2">
                                {inv.items.map(item => (
                                    <li key={item.invoiceItemId} className="flex justify-between text-sm text-slate-600">
                                        <span>{item.description}</span>
                                        <span className="font-medium">${item.amount.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Footer / Actions */}
                        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                            <div className="text-sm">
                                <span className="text-slate-500 mr-4">Paid: <strong className="text-success">${inv.paidAmount.toFixed(2)}</strong></span>
                                <span className="text-slate-500">Balance: <strong className="text-danger">${inv.balance.toFixed(2)}</strong></span>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-slate-400 hover:text-dark hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200">
                                    <Download size={18} />
                                </button>
                                {inv.balance > 0 && (
                                    <button
                                        onClick={() => handlePayment(inv.invoiceId, inv.balance)}
                                        className="flex items-center gap-2 px-4 py-2 bg-success hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <DollarSign size={16} />
                                        Pay
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {!loading && invoices.length === 0 && (
                    <div className="bg-white p-12 rounded-xl text-center border-2 border-dashed border-slate-200">
                        <p className="text-slate-400">No invoices found for this student.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvoiceList;
