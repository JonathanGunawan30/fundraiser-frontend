import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<User | null>(() => {
        const id = localStorage.getItem('user_id');
        if (!id) return null;
        return {
            id,
            name: localStorage.getItem('user_name') || '',
            email: localStorage.getItem('user_email') || '',
            avatar: localStorage.getItem('user_avatar') || '',
            role: localStorage.getItem('user_role') || 'user',
        };
    });

    const login = (newToken: string, userData: User) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user_id', userData.id);
        localStorage.setItem('user_name', userData.name);
        localStorage.setItem('user_email', userData.email);
        localStorage.setItem('user_avatar', userData.avatar);
        localStorage.setItem('user_role', userData.role);
        
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.clear();
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            isLoggedIn: !!token, 
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
