import React from 'react';
import { Users, GraduationCap, CreditCard, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
    // Mock Data for Dashboard
    const stats = [
        { label: 'Total Students', value: '2,450', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12% this month' },
        { label: 'Total Teachers', value: '185', icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Stable' },
        { label: 'Fees Collected', value: '$45,200', icon: CreditCard, color: 'text-violet-600', bg: 'bg-violet-50', trend: '+8% vs last term' },
        { label: 'Pending Fees', value: '$12,500', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50', trend: 'Needs Attention' },
    ];

    const recentActivities = [
        { id: 1, user: 'Admin User', action: 'Added new student', target: 'Sophea Chan', time: '2 hours ago' },
        { id: 2, user: 'Finance Team', action: 'Collected payment', target: 'INV-2024-001 ($500)', time: '3 hours ago' },
        { id: 3, user: 'Admin User', action: 'Updated fee template', target: 'Term 1 2024', time: '5 hours ago' },
        { id: 4, user: 'System', action: 'Generated monthly report', target: 'Finance Report', time: '1 day ago' },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-dark mb-6">Dashboard Overview</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-dark">{stat.value}</h3>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <TrendingUp size={14} className="text-success" />
                                <span className="text-success font-medium">{stat.trend}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-dark">Recent Activity</h3>
                        <button className="text-primary text-sm font-medium hover:underline">View All</button>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                        {activity.user.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-dark">
                                            {activity.user} <span className="font-normal text-slate-500">{activity.action}</span>
                                        </p>
                                        <p className="text-xs text-primary font-medium">{activity.target}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calendar / Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                        <Calendar size={20} className="text-primary" />
                        Today's Schedule
                    </h3>
                    <div className="space-y-4">
                        <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                            <p className="text-xs text-blue-600 font-bold mb-1">09:00 AM - 10:00 AM</p>
                            <p className="text-sm font-medium text-dark">Staff Meeting</p>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-lg border-l-4 border-emerald-500">
                            <p className="text-xs text-emerald-600 font-bold mb-1">11:30 AM - 12:30 PM</p>
                            <p className="text-sm font-medium text-dark">Parent Consultation</p>
                        </div>
                        <div className="p-3 bg-violet-50 rounded-lg border-l-4 border-violet-500">
                            <p className="text-xs text-violet-600 font-bold mb-1">02:00 PM - 04:00 PM</p>
                            <p className="text-sm font-medium text-dark">Finance Audit Review</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
