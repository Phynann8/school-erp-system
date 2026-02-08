import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Save, Smartphone, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);

    // Mock Form State
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [email] = useState(user?.email || 'user@school.edu');
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        updates: true
    });
    const [theme, setTheme] = useState('light');

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            alert('Settings saved successfully!');
        }, 1000);
    };

    const tabs = [
        { id: 'profile', label: 'Profile Settings', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'appearance', label: 'Appearance', icon: Palette },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-serif font-bold text-dark mb-2">Settings</h1>
                <p className="text-slate-500">Manage your account preferences and application settings.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-primary/5 text-primary border-l-4 border-primary'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-dark border-l-4 border-transparent'
                                    }`}
                                >
                                    <Icon size={18} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8 animate-fade-in">
                        {/* Profile Settings */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
                                        {user?.fullName?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-dark">{user?.fullName}</h3>
                                        <p className="text-slate-500 text-sm">{user?.roles?.[0] || 'User'}</p>
                                        <button className="text-sm text-primary font-semibold mt-1 hover:underline">Change Avatar</button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Full Name</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            disabled
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                                        <input
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Department</label>
                                        <input
                                            type="text"
                                            disabled
                                            value="Administration"
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-dark mb-4">Notification Preferences</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-primary rounded-lg">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-dark">Email Notifications</p>
                                                <p className="text-sm text-slate-500">Receive updates regarding your account via email.</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={notifications.email}
                                                onChange={() => setNotifications({ ...notifications, email: !notifications.email })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                                <Smartphone size={20} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-dark">Push Notifications</p>
                                                <p className="text-sm text-slate-500">Receive alerts on your mobile device.</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={notifications.push}
                                                onChange={() => setNotifications({ ...notifications, push: !notifications.push })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-dark mb-4">Security Settings</h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-semibold text-dark">Change Password</h4>
                                        </div>
                                        <div className="grid gap-4 max-w-md">
                                            <input
                                                type="password"
                                                placeholder="Current Password"
                                                className="w-full px-4 py-2 rounded-lg border border-slate-300 text-sm"
                                            />
                                            <input
                                                type="password"
                                                placeholder="New Password"
                                                className="w-full px-4 py-2 rounded-lg border border-slate-300 text-sm"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Confirm New Password"
                                                className="w-full px-4 py-2 rounded-lg border border-slate-300 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Appearance (Theme) */}
                        {activeTab === 'appearance' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-dark mb-4">Interface Customization</h3>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                    <button
                                        onClick={() => setTheme('light')}
                                        className={`p-4 border-2 rounded-xl flex flex-col items-center gap-3 transition-all ${
                                            theme === 'light'
                                                ? 'border-primary bg-primary/5'
                                                : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="w-12 h-12 bg-white border shadow-sm rounded-lg flex items-center justify-center text-orange-400">
                                            <Sun size={24} />
                                        </div>
                                        <span className="font-semibold text-sm">Light Mode</span>
                                    </button>
                                    
                                    <button
                                        onClick={() => setTheme('dark')}
                                        className={`p-4 border-2 rounded-xl flex flex-col items-center gap-3 transition-all ${
                                            theme === 'dark'
                                                ? 'border-primary bg-primary/5'
                                                : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="w-12 h-12 bg-slate-800 border-none shadow-sm rounded-lg flex items-center justify-center text-yellow-400">
                                            <Moon size={24} />
                                        </div>
                                        <span className="font-semibold text-sm">Dark Mode</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
                            <button className="px-6 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="px-6 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark shadow-lg shadow-primary/25 transition-all flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
