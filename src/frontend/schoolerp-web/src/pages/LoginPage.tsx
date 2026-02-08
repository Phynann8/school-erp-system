import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, User, AlertCircle, ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { AuthResponse } from '../types';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { data } = await api.post<AuthResponse>('/auth/login', { username, password });
            login(data);
            navigate('/students');
        } catch (err) {
            setError('Invalid login credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden font-sans">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] opacity-30 animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] opacity-30"></div>
            </div>

            <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 m-4 border border-white/50 backdrop-blur-sm">

                {/* Left Side - Brand & Info */}
                <div className="hidden lg:flex w-1/2 bg-primary relative flex-col justify-between p-12 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/80 to-primary/80 z-0"></div>
                    <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center z-0"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                                <GraduationCap size={28} className="text-white" />
                            </div>
                            <h1 className="text-3xl font-serif font-bold tracking-wide">EduPro</h1>
                        </div>

                        <div className="space-y-6 mt-12">
                            <h2 className="text-4xl font-serif font-bold leading-tight">
                                Management <br />Made Simple.
                            </h2>
                            <p className="text-blue-100 text-lg max-w-sm">
                                Streamline your school's administration, finance, and academic tracking in one unified platform.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 mt-auto">
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                                <ShieldCheck size={18} className="text-blue-200" />
                                <span className="text-sm font-medium">Secure</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                                <BookOpen size={18} className="text-blue-200" />
                                <span className="text-sm font-medium">Reliable</span>
                            </div>
                        </div>
                        <p className="text-xs text-blue-200 mt-6">Version 2.0 | &copy; {new Date().getFullYear()} EduPro ERP</p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 bg-white flex flex-col justify-center">
                    <div className="mb-10 text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <GraduationCap size={32} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-dark mb-2">Welcome Back</h2>
                        <p className="text-slate-500">Sign into your dashboard</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-start gap-3 text-sm animate-fade-in">
                            <AlertCircle size={20} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 block">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 text-dark placeholder:text-slate-400 font-medium"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-slate-700 block">Password</label>
                                <a href="#" className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors">Forgot password?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 text-dark placeholder:text-slate-400 font-medium font-sans"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-400">
                            By signing in, you agree to our <a href="#" className="text-slate-600 hover:text-primary transition-colors">Terms of Service</a> and <a href="#" className="text-slate-600 hover:text-primary transition-colors">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
