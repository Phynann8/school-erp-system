import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { StudentListDto } from '../types';
import { useAuth } from '../context/AuthContext';
import { Plus, Search } from 'lucide-react';

const StudentsList: React.FC = () => {
    const { currentCampusId } = useAuth();
    const [students, setStudents] = useState<StudentListDto[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentCampusId) {
            fetchStudents();
        }
    }, [currentCampusId]); // Reload when campus changes

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/students', {
                params: {
                    campusId: currentCampusId,
                    q: searchTerm
                }
            });
            setStudents(data.data);
        } catch (error) {
            console.error('Failed to fetch students', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchStudents();
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Students</h2>
                <Link to="/students/new" style={{ backgroundColor: '#007BFF', color: 'white', padding: '0.5rem 1rem', textDecoration: 'none', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={16} /> Add Student
                </Link>
            </div>

            <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        placeholder="Search by name or code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '0.5rem', width: '300px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    <button type="submit" style={{ padding: '0.5rem', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        <Search size={16} />
                    </button>
                </form>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '4px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                        <th style={{ padding: '1rem' }}>Code</th>
                        <th style={{ padding: '1rem' }}>Name (English)</th>
                        <th style={{ padding: '1rem' }}>Name (Khmer)</th>
                        <th style={{ padding: '1rem' }}>Class</th>
                        <th style={{ padding: '1rem' }}>Status</th>
                        <th style={{ padding: '1rem' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan={6} style={{ padding: '1rem', textAlign: 'center' }}>Loading...</td></tr>
                    ) : students.map(student => (
                        <tr key={student.studentId} style={{ borderTop: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '1rem' }}>{student.studentCode}</td>
                            <td style={{ padding: '1rem' }}>{student.englishName}</td>
                            <td style={{ padding: '1rem' }}>{student.khmerName}</td>
                            <td style={{ padding: '1rem' }}>{student.className}</td>
                            <td style={{ padding: '1rem' }}>
                                <span style={{
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '999px',
                                    fontSize: '0.875rem',
                                    backgroundColor: student.status === 'Active' ? '#dcfce7' : '#fee2e2',
                                    color: student.status === 'Active' ? '#166534' : '#991b1b'
                                }}>
                                    {student.status}
                                </span>
                            </td>
                            <td style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
                                <Link to={`/students/${student.studentId}/fees`} style={{ fontSize: '0.875rem', color: '#007BFF', textDecoration: 'none' }}>
                                    Fees
                                </Link>
                                <Link to={`/students/${student.studentId}/invoices`} style={{ fontSize: '0.875rem', color: '#16a34a', textDecoration: 'none' }}>
                                    Invoices
                                </Link>
                            </td>
                        </tr>
                    ))}
                    {!loading && students.length === 0 && (
                        <tr><td colSpan={6} style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>No students found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StudentsList;
