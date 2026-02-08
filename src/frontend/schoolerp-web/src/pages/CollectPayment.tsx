import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, CreditCard, Receipt, CheckCircle, FileText } from 'lucide-react';
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
            navigate('/invoices'); // Or refresh current view
        } catch (error: any) {
            console.error('Payment failed:', error);
            const errorMsg = error.response?.data?.message || 'Payment failed. Check console.';
            alert(errorMsg);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-dark">Fees Collection</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Search & Selection */}
                <div className="space-y-6">
                    {/* Search Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Search size={20} className="text-primary" />
                            Find Student / Invoice
                        </h3>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by ID, Name, Invoice #..."
                                    value={studentSearch}
                                    onChange={(e) => setStudentSearch(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="px-6 py-2.5 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors disabled:opacity-70"
                            >
                                {loading ? '...' : 'Search'}
                            </button>
                        </div>
                    </div>

                    {/* Results List */}
                    {invoices.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 bg-slate-50">
                                <h4 className="font-semibold text-sm text-slate-500 uppercase">Pending Invoices</h4>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {invoices.map(inv => (
                                    <div
                                        key={inv.invoiceId}
                                        onClick={() => selectInvoice(inv)}
                                        className={`p-4 cursor-pointer transition-all hover:bg-slate-50 flex justify-between items-center ${selectedInvoice?.invoiceId === inv.invoiceId ? 'bg-blue-50 border-l-4 border-primary' : ''}`}
                                    >
                                        <div>
                                            <div className="font-bold text-dark">{inv.studentName}</div>
                                            <div className="text-sm text-slate-500 flex items-center gap-2">
                                                <FileText size={14} />
                                                #{inv.invoiceNumber}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-slate-400">Balance</div>
                                            <div className="font-bold text-danger">${inv.balance.toFixed(2)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Payment Form */}
                <div className="space-y-6">
                    {selectedInvoice ? (
                        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden sticky top-6">
                            <div className="bg-primary/5 p-6 border-b border-primary/10">
                                <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                                    <Receipt size={20} />
                                    Payment Details
                                </h3>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Invoice Summary */}
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Invoice Amount</span>
                                        <span className="font-medium">${selectedInvoice.totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Already Paid</span>
                                        <span className="font-medium text-success">-${selectedInvoice.paidAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-slate-200 my-2 pt-2 flex justify-between items-center">
                                        <span className="font-bold text-slate-700">Balance Due</span>
                                        <span className="font-bold text-xl text-danger">${selectedInvoice.balance.toFixed(2)}</span>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Amount to Pay</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                max={selectedInvoice.balance}
                                                value={paymentData.amount}
                                                onChange={(e) => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) || 0 })}
                                                className="w-full pl-8 pr-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-bold text-lg"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['Cash', 'BankTransfer', 'KHQR', 'Cheque'].map(method => (
                                                <button
                                                    key={method}
                                                    type="button"
                                                    onClick={() => setPaymentData({ ...paymentData, paymentMethod: method })}
                                                    className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${paymentData.paymentMethod === method
                                                        ? 'bg-primary text-white border-primary shadow-md'
                                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {method === 'BankTransfer' ? 'Bank Transfer' : method}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {paymentData.paymentMethod !== 'Cash' && (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Reference Number</label>
                                            <input
                                                type="text"
                                                placeholder="Transaction ID / Cheque No."
                                                value={paymentData.referenceNumber || ''}
                                                onChange={(e) => setPaymentData({ ...paymentData, referenceNumber: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            />
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="w-full bg-success hover:bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                                    >
                                        <CheckCircle size={20} />
                                        Record Payment
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-slate-400">
                            <CreditCard size={48} className="mb-4 opacity-50" />
                            <p className="text-lg font-medium">No invoice selected</p>
                            <p className="text-sm">Search and select an invoice to proceed with payment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollectPayment;
