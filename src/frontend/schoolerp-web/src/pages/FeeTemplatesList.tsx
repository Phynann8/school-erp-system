import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { FeeTemplateDto } from '../types';
import { useAuth } from '../context/AuthContext';
import { Plus, Check } from 'lucide-react';

const FeeTemplatesList: React.FC = () => {
    const { currentCampusId } = useAuth();
    const [templates, setTemplates] = useState<FeeTemplateDto[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentCampusId) {
            fetchTemplates();
        }
    }, [currentCampusId]);

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const { data } = await api.get<FeeTemplateDto[]>('/fees/templates', {
                params: { campusId: currentCampusId }
            });
            setTemplates(data);
        } catch (error) {
            console.error('Failed to fetch templates', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Fee Templates</h2>
                <Link to="/fees/templates/new" style={{ backgroundColor: '#007BFF', color: 'white', padding: '0.5rem 1rem', textDecoration: 'none', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={16} /> Create Template
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {loading ? <p>Loading...</p> : templates.map(t => (
                    <div key={t.feeTemplateId} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{t.name}</h3>
                            {t.isActive ? <span style={{ color: 'green', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={14} /> Active</span> : <span style={{ color: 'red' }}>Inactive</span>}
                        </div>
                        <p style={{ color: '#64748b', marginBottom: '1rem' }}>Frequency: {t.frequency}</p>

                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#475569' }}>Fee Items:</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {t.items.map(item => (
                                    <li key={item.feeTemplateItemId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                        <span>{item.feeName} {item.isOptional && <small>(Optional)</small>}</span>
                                        <span style={{ fontWeight: 500 }}>${item.amount.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                            <div style={{ marginTop: '1rem', borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                <span>Total:</span>
                                <span>${t.items.reduce((sum, i) => sum + i.amount, 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeeTemplatesList;
