import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { CreateStudentDto } from '../types';
import { useAuth } from '../context/AuthContext';

const CreateStudent: React.FC = () => {
    const { currentCampusId } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CreateStudentDto>({
        khmerName: '',
        englishName: '',
        gender: 'Male',
        campusId: currentCampusId || 0,
        guardians: [{ fullName: '', relationship: 'Father', phone: '', isPrimary: true }]
    });

    // Update campusId when currentCampusId changes (async hydration from localStorage)
    useEffect(() => {
        if (currentCampusId && formData.campusId === 0) {
            setFormData(prev => ({ ...prev, campusId: currentCampusId }));
        }
    }, [currentCampusId, formData.campusId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGuardianChange = (index: number, field: string, value: any) => {
        const newGuardians = [...formData.guardians];
        (newGuardians[index] as any)[field] = value;
        setFormData({ ...formData, guardians: newGuardians });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate campusId before submission
        const effectiveCampusId = currentCampusId || formData.campusId;
        if (!effectiveCampusId || effectiveCampusId === 0) {
            alert('Error: No campus selected. Please log out and log back in.');
            return;
        }

        try {
            await api.post('/students', {
                ...formData,
                campusId: effectiveCampusId
            });
            navigate('/students');
        } catch (error: any) {
            console.error('Failed to create student', error);
            // Display detailed validation errors from backend
            if (error.response?.data) {
                console.error('Backend validation errors:', JSON.stringify(error.response.data, null, 2));
                const errorMsg = typeof error.response.data === 'string'
                    ? error.response.data
                    : JSON.stringify(error.response.data.errors || error.response.data, null, 2);
                alert(`Validation failed:\n${errorMsg}`);
            } else {
                alert('Failed to create student. Check console.');
            }
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2>New Student Registration</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', marginTop: '1.5rem' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label>Khmer Name <span style={{ color: 'red' }}>*</span></label>
                        <input name="khmerName" value={formData.khmerName} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    <div>
                        <label>English Name</label>
                        <input name="englishName" value={formData.englishName} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label>Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label>Date of Birth</label>
                        <input type="date" name="dob" onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                </div>

                <hr style={{ border: '0', borderTop: '1px solid #eee' }} />
                <h3>Guardian Information</h3>

                {formData.guardians.map((g, index) => (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Full Name</label>
                            <input
                                value={g.fullName}
                                onChange={(e) => handleGuardianChange(index, 'fullName', e.target.value)}
                                required
                                style={{ width: '100%', padding: '0.5rem' }}
                            />
                        </div>
                        <div>
                            <label>Relationship</label>
                            <select
                                value={g.relationship}
                                onChange={(e) => handleGuardianChange(index, 'relationship', e.target.value)}
                                style={{ width: '100%', padding: '0.5rem' }}
                            >
                                <option value="Father">Father</option>
                                <option value="Mother">Mother</option>
                                <option value="Guardian">Guardian</option>
                            </select>
                        </div>
                        <div>
                            <label>Phone</label>
                            <input
                                value={g.phone}
                                onChange={(e) => handleGuardianChange(index, 'phone', e.target.value)}
                                style={{ width: '100%', padding: '0.5rem' }}
                            />
                        </div>
                    </div>
                ))}

                <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', justifySelf: 'start' }}>
                    Register Student
                </button>
            </form>
        </div>
    );
};

export default CreateStudent;
