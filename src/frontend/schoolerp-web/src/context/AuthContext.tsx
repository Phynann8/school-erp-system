import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, AuthResponse } from '../types';


interface AuthContextType {
    user: UserProfile | null;
    token: string | null;
    currentCampusId: number | null;
    login: (response: AuthResponse) => void;
    logout: () => void;
    switchCampus: (campusId: number) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [currentCampusId, setCurrentCampusId] = useState<number | null>(
        localStorage.getItem('campusId') ? Number(localStorage.getItem('campusId')) : null
    );

    useEffect(() => {
        // Hydrate user from storage layout (simplified) or fetch /me
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    const login = (response: AuthResponse) => {
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));
        setToken(response.accessToken);
        setUser(response.user);

        // Default to first campus if available and not set
        if (response.user.campusAccess.length > 0) {
            const defaultId = response.user.campusAccess[0].campusId;
            switchCampus(defaultId);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('campusId');
        setToken(null);
        setUser(null);
        setCurrentCampusId(null);
    };

    const switchCampus = (campusId: number) => {
        localStorage.setItem('campusId', campusId.toString());
        setCurrentCampusId(campusId);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            currentCampusId,
            login,
            logout,
            switchCampus,
            isAuthenticated: !!token
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
