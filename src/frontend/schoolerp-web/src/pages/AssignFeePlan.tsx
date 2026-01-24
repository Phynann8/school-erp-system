import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import type { StudentFeePlanDto, FeeTemplateDto } from '../types';
import { useAuth } from '../context/AuthContext';

const AssignFeePlan: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { currentCampusId } = useAuth();


    const [student, setStudent] = useState<any>(null); // Simplified checking
    const [templates, setTemplates] = useState<FeeTemplateDto[]>([]);
    const [currentPlans, setCurrentPlans] = useState<StudentFeePlanDto[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<number | ''>('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (id && currentCampusId) {
            fetchData();
        }
    }, [id, currentCampusId]);

    const fetchData = async () => {
        try {
            // Fetch Student Info (using GetById endpoint)
            const studentRes = await api.get(`/students/${id}`);
            setStudent(studentRes.data);

            // Fetch Available Templates
            const templatesRes = await api.get('/fees/templates', { params: { campusId: currentCampusId } });
            setTemplates(templatesRes.data);

            // Fetch Current Plans
            const plansRes = await api.get(`/fees/plans/${id}`);
            setCurrentPlans(plansRes.data);

        } catch (error) {
            console.error('Failed to fetch data', error);
        }
    };

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/fees/plans/assign', {
                studentId: Number(id),
                feeTemplateId: Number(selectedTemplateId),
                startDate: startDate
            });
            alert('Fee Plan Assigned Successfully');
            fetchData(); // Refresh list
        } catch (error) {
            console.error('Failed to assign plan', error);
            alert('Failed to assign plan');
        }
    };

    if (!student) return <p>Loading...</p>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2>Fee Plans for: {student.englishName} ({student.studentCode})</h2>

            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3>Assign New Plan</h3>
                <form onSubmit={handleAssign} style={{ display: 'flex', gap: '1rem', alignItems: 'end', marginTop: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <label>Select Fee Template</label>
                        <select
                            value={selectedTemplateId}
                            onChange={(e) => setSelectedTemplateId(Number(e.target.value))}
                            required
                            style={{ width: '100%', padding: '0.5rem' }}
                        >
                            <option value="">-- Select Template --</option>
                            {templates.map(t => (
                                <option key={t.feeTemplateId} value={t.feeTemplateId}>
                                    {t.name} ({t.frequency})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                            style={{ padding: '0.5rem' }}
                        />
                    </div>
                    <button type="submit" style={{ padding: '0.6rem 1rem', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Assign
                    </button>
                </form>
            </div>

            <h3>Current Plans</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', marginTop: '1rem' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                        <th style={{ padding: '1rem' }}>Template</th>
                        <th style={{ padding: '1rem' }}>Start Date</th>
                        <th style={{ padding: '1rem' }}>Status</th>
                        <th style={{ padding: '1rem' }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {currentPlans.map(plan => (
                        <tr key={plan.studentFeePlanId} style={{ borderTop: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '1rem' }}>{plan.feeTemplateName}</td>
                            <td style={{ padding: '1rem' }}>{new Date(plan.startDate).toLocaleDateString()}</td>
                            <td style={{ padding: '1rem' }}>{plan.status}</td>
                            <td style={{ padding: '1rem' }}>${plan.totalAmount.toFixed(2)}</td>
                        </tr>
                    ))}
                    {currentPlans.length === 0 && <tr><td colSpan={4} style={{ padding: '1rem', textAlign: 'center' }}>No active plans.</td></tr>}
                </tbody>
            </table>
        </div>
    );
};

export default AssignFeePlan;
