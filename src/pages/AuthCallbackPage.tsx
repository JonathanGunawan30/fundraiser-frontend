import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App, Spin } from 'antd';
import { useAuth } from '../lib/AuthContext';

const AuthCallbackPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { notification } = App.useApp();
    const { login } = useAuth();
    const processedRef = useRef(false);

    useEffect(() => {
        if (processedRef.current) return;

        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const id = params.get('id');
        const name = params.get('name');
        const email = params.get('email');
        const avatar = params.get('avatar');
        const role = params.get('role');
        const error = params.get('error');

        if (error) {
            processedRef.current = true;
            notification.error({
                message: 'Login Failed',
                description: error,
                placement: 'topRight',
            });
            navigate('/auth/login');
            return;
        }

        if (token && id) {
            processedRef.current = true;
            
            login(token, {
                id,
                name: name || '',
                email: email || '',
                avatar: avatar || '',
                role: role || 'user'
            });

            notification.success({
                message: 'Login Successful',
                description: `Welcome back, ${name}!`,
                placement: 'topRight',
            });
            
            navigate('/');
        } else {
            // Only navigate if we're sure there's no token/id and not already processed
            // Adding a small delay or ensuring params are present
            if (params.has('error') || params.has('token')) {
                // Should have been handled above
            } else {
                // If accessed directly without params
                navigate('/auth/login');
            }
        }
    }, [location, navigate, notification, login]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 16 }}>
            <Spin size="large" />
            <p>Completing login, please wait...</p>
        </div>
    );
};

export default AuthCallbackPage;
