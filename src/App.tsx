import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import UserDashboardLayout from './layouts/UserDashboardLayout';
import LandingPage from './pages/LandingPage';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';
import MyCampaigns from './pages/MyCampaigns';
import CreateCampaignPage from './pages/CreateCampaignPage';
import EditCampaignPage from './pages/EditCampaignPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import CampaignManagement from './pages/admin/CampaignManagement';
import AdminCampaignDetailPage from './pages/admin/AdminCampaignDetailPage';
import CategoryManagement from './pages/admin/CategoryManagement';
import TagManagement from './pages/admin/TagManagement';
import BannerManagement from './pages/admin/BannerManagement';
import FaqManagement from './pages/admin/FaqManagement';
import AuditLogList from './pages/admin/AuditLogList';
import UserManagement from './pages/admin/UserManagement';
import AdminProfile from './pages/admin/AdminProfile';
import SiteSettings from './pages/admin/SiteSettings';

function App() {
  return (
    <AntdApp>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="campaigns" element={<div>Explore Campaigns Page (Work in Progress)</div>} />
            <Route path="campaigns/:slug" element={<CampaignDetailPage />} />
            <Route path="auth/login" element={<LoginPage />} />
            <Route path="auth/callback" element={<AuthCallbackPage />} />
          </Route>

          {/* User Authenticated Routes */}
          <Route element={<UserDashboardLayout />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/my-campaigns" element={<MyCampaigns />} />
            <Route path="/campaigns/create" element={<CreateCampaignPage />} />
            <Route path="/campaigns/edit/:id" element={<EditCampaignPage />} />
          </Route>

          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="campaigns" element={<CampaignManagement />} />
            <Route path="campaigns/:slug/review" element={<AdminCampaignDetailPage />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="tags" element={<TagManagement />} />
            <Route path="banners" element={<BannerManagement />} />
            <Route path="faqs" element={<FaqManagement />} />
            <Route path="audit-logs" element={<AuditLogList />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="settings" element={<SiteSettings />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AntdApp>
  );
}

export default App;
