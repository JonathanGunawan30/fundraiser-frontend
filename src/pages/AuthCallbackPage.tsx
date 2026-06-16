import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App, Spin } from 'antd';

const AuthCallbackPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { notification } = App.useApp();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const name = params.get('name');
        const avatar = params.get('avatar');
        const role = params.get('role');
        const error = params.get('error');

        if (error) {
            notification.error({
                message: 'Login Failed',
                description: error,
                placement: 'topRight',
            });
            navigate('/auth/login');
            return;
        }

        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('user_name', name || '');
            localStorage.setItem('user_avatar', avatar || '');
            localStorage.setItem('user_role', role || 'user');

            notification.success({
                message: 'Login Successful',
                description: `Welcome back, ${name}!`,
                placement: 'topRight',
            });
            
            navigate('/');
        } else {
            navigate('/auth/login');
        }
    }, [location, navigate, notification]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 16 }}>
            <Spin size="large" />
            <p>Completing login, please wait...</p>
        </div>
    );
};

export default AuthCallbackPage;
