import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { CreateFeeTemplateDto } from '../types';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2 } from 'lucide-react';

const CreateFeeTemplate: React.FC = () => {
    const { currentCampusId } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CreateFeeTemplateDto>({
        campusId: currentCampusId || 0,
        name: '',
        frequency: 'Term',
        items: [{ feeName: 'Tuition Fee', amount: 0, isOptional: false }]
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...formData.items];
        (newItems[index] as any)[field] = value;
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { feeName: '', amount: 0, isOptional: false }]
        });
    };

    const removeItem = (index: number) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/fees/templates', {
                ...formData,
                campusId: currentCampusId
            });
            navigate('/fees/templates');
        } catch (error) {
            console.error('Failed to create fee template', error);
            alert('Failed to create fee template.');
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2>Create Fee Template</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', display: 'grid', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                    <div>
                        <label>Template Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Grade 1 Term 1"
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <div>
                        <label>Frequency</label>
                        <select name="frequency" value={formData.frequency} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }}>
                            <option value="Monthly">Monthly</option>
                            <option value="Term">Term</option>
                            <option value="Annually">Annually</option>
                            <option value="One-Time">One-Time</option>
                        </select>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Fee Items</h3>
                        <button type="button" onClick={addItem} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem', backgroundColor: '#f0f9ff', color: '#007BFF', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            <Plus size={16} /> Add Item
                        </button>
                    </div>

                    {formData.items.map((item, index) => (
                        <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                            <input
                                placeholder="Fee Name"
                                value={item.feeName}
                                onChange={(e) => handleItemChange(index, 'feeName', e.target.value)}
                                required
                                style={{ padding: '0.5rem' }}
                            />
                            <input
                                type="number"
                                placeholder="Amount"
                                value={item.amount}
                                onChange={(e) => handleItemChange(index, 'amount', parseFloat(e.target.value))}
                                required
                                min="0"
                                step="0.01"
                                style={{ padding: '0.5rem' }}
                            />
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                <input
                                    type="checkbox"
                                    checked={item.isOptional}
                                    onChange={(e) => handleItemChange(index, 'isOptional', e.target.checked)}
                                /> Optional
                            </label>
                            {formData.items.length > 1 && (
                                <button type="button" onClick={() => removeItem(index)} style={{ padding: '0.5rem', color: '#991b1b', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}

                    <div style={{ marginTop: '1rem', textAlign: 'right', fontWeight: 'bold' }}>
                        Total: ${formData.items.reduce((sum, item) => sum + (item.amount || 0), 0).toFixed(2)}
                    </div>
                </div>

                <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', justifySelf: 'start' }}>
                    Save Template
                </button>
            </form>
        </div>
    );
};

export default CreateFeeTemplate;
