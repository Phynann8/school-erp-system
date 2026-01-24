import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface VoidRequest {
    voidRequestId: number;
    paymentId: number;
    receiptNumber: string;
    amount: number;
    paymentDate: string;
    studentName: string;
    reason: string;
    requestedBy: string;
    requestedAt: string;
}

const VoidRequestsPage: React.FC = () => {
    const { currentCampusId } = useAuth();
    const [requests, setRequests] = useState<VoidRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState<number | null>(null);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await api.get('/finance/void-requests', {
                params: { campusId: currentCampusId }
            });
            setRequests(response.data);
        } catch (error) {
            console.error('Failed to fetch void requests:', error);
            alert('Failed to load void requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentCampusId) {
            fetchRequests();
        }
    }, [currentCampusId]);

    const handleApprove = async (voidRequestId: number) => {
        if (!confirm('Are you sure you want to APPROVE this void request? The payment will be reversed.')) {
            return;
        }

        setActionLoading(voidRequestId);
        try {
            await api.post(`/finance/void-requests/${voidRequestId}/approve`);
            alert('Void approved successfully. Payment has been reversed.');
            fetchRequests();
        } catch (error: any) {
            console.error('Failed to approve:', error);
            alert(error.response?.data?.message || 'Failed to approve void request');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (voidRequestId: number) => {
        if (!rejectReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }

        setActionLoading(voidRequestId);
        try {
            await api.post(`/finance/void-requests/${voidRequestId}/reject`, {
                reason: rejectReason
            });
            alert('Void request rejected.');
            setShowRejectModal(null);
            setRejectReason('');
            fetchRequests();
        } catch (error: any) {
            console.error('Failed to reject:', error);
            alert(error.response?.data?.message || 'Failed to reject void request');
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString();
    };

    const formatCurrency = (amount: number) => {
        return `$${amount.toFixed(2)}`;
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Void Requests</h2>
                <button
                    onClick={fetchRequests}
                    disabled={loading}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    {loading ? 'Loading...' : '🔄 Refresh'}
                </button>
            </div>

            {/* Pending Requests Alert */}
            {requests.length > 0 && (
                <div style={{
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffc107',
                    padding: '1rem',
                    borderRadius: '4px',
                    marginBottom: '1rem'
                }}>
                    ⚠️ You have <strong>{requests.length}</strong> pending void request(s) awaiting approval.
                </div>
            )}

            {/* Requests Table */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                            <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Receipt</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Student</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Amount</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Reason</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Requested By</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
                            <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td>
                            </tr>
                        ) : requests.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                                    ✅ No pending void requests.
                                </td>
                            </tr>
                        ) : (
                            requests.map(req => (
                                <tr key={req.voidRequestId} style={{ borderBottom: '1px solid #dee2e6' }}>
                                    <td style={{ padding: '0.75rem' }}>
                                        <div style={{ fontWeight: '500' }}>{req.receiptNumber}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#666' }}>
                                            Paid: {formatDate(req.paymentDate)}
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>{req.studentName}</td>
                                    <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold', color: '#c62828' }}>
                                        {formatCurrency(req.amount)}
                                    </td>
                                    <td style={{ padding: '0.75rem', maxWidth: '200px' }}>
                                        <div style={{
                                            backgroundColor: '#f8f9fa',
                                            padding: '0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.875rem'
                                        }}>
                                            {req.reason}
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>{req.requestedBy}</td>
                                    <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                                        {formatDate(req.requestedAt)}
                                    </td>
                                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                            <button
                                                onClick={() => handleApprove(req.voidRequestId)}
                                                disabled={actionLoading === req.voidRequestId}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    backgroundColor: '#28a745',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                ✓ Approve
                                            </button>
                                            <button
                                                onClick={() => setShowRejectModal(req.voidRequestId)}
                                                disabled={actionLoading === req.voidRequestId}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    backgroundColor: '#dc3545',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                ✗ Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Reject Modal */}
            {showRejectModal !== null && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '8px',
                        width: '400px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    }}>
                        <h3 style={{ marginTop: 0 }}>Reject Void Request</h3>
                        <p style={{ color: '#666' }}>Please provide a reason for rejecting this void request:</p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Enter reason for rejection..."
                            style={{
                                width: '100%',
                                minHeight: '100px',
                                padding: '0.5rem',
                                marginBottom: '1rem',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => {
                                    setShowRejectModal(null);
                                    setRejectReason('');
                                }}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleReject(showRejectModal)}
                                disabled={actionLoading === showRejectModal}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoidRequestsPage;
