import React from 'react';
import { App, Spin } from 'antd';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { getErrorMessages } from '../lib/utils';
import CampaignForm from '../components/CampaignForm';
import type { CampaignFormValues } from '../components/CampaignForm';
import type { Campaign } from '../types';

const EditCampaignPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { notification } = App.useApp();

    // Fetch Campaign Data
    const { data: campaign, isLoading: isLoadingCampaign } = useQuery<Campaign>({
        queryKey: ['campaign-edit', id],
        queryFn: async () => {
            const response = await api.get(`/campaigns/${id}`);
            return response.data.data;
        },
        enabled: !!id,
    });

    const updateCampaignMutation = useMutation({
        mutationFn: async ({ values, status, coverImage }: { values: CampaignFormValues, status: string, coverImage: File | null }) => {
            const formData = new FormData();

            formData.append('_method', 'PUT');
            formData.append('category_id', String(values.category_id));
            formData.append('goal_amount', String(values.goal_amount));
            formData.append('deadline', values.deadline.format('YYYY-MM-DD'));
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('story', values.story);
            formData.append('status', status);

            if (values.tags && Array.isArray(values.tags)) {
                values.tags.forEach((tagId: number) => formData.append('tags[]', String(tagId)));
            }

            if (coverImage) {
                formData.append('cover_image', coverImage);
            }

            const response = await api.post(`/auth/campaigns/${id}`, formData);
            return response.data.data;
        },
        onSuccess: (data, variables) => {
            notification.success({
                message: 'Campaign Diperbarui',
                description: variables.status === 'draft' 
                    ? 'Perubahan disimpan sebagai draft.' 
                    : 'Campaign Anda telah diajukan untuk review.',
                placement: 'topRight',
            });
            navigate('/my-campaigns');
        },
        onError: (error) => {
            const messages = getErrorMessages(error);
            notification.error({
                message: 'Gagal Memperbarui Campaign',
                description: messages[0] || 'Terjadi kesalahan.',
                placement: 'topRight',
            });
        }
    });

    if (isLoadingCampaign) {
        return (
            <div style={{ textAlign: 'center', padding: '100px' }}>
                <Spin size="large" tip="Memuat data campaign..." />
            </div>
        );
    }

    return (
        <CampaignForm
            title="Edit Campaign"
            subtitle="Perbarui informasi campaign Anda untuk hasil yang lebih baik."
            initialData={campaign}
            onSubmit={(values, status, coverImage) => updateCampaignMutation.mutate({ values, status, coverImage })}
            isSubmitting={updateCampaignMutation.isPending}
        />
    );
};

export default EditCampaignPage;
