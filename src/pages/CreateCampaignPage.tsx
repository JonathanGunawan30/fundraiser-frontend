import React from 'react';
import { App } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { getErrorMessages } from '../lib/utils';
import CampaignForm from '../components/CampaignForm';
import type { CampaignFormValues } from '../components/CampaignForm';

const CreateCampaignPage: React.FC = () => {
    const navigate = useNavigate();
    const { notification } = App.useApp();

    const createCampaignMutation = useMutation({
        mutationFn: async ({ values, status, coverImage }: { values: CampaignFormValues, status: 'draft' | 'pending', coverImage: File | null }) => {
            const formData = new FormData();

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

            const response = await api.post('/auth/campaigns', formData);
            return response.data.data;
        },
        onSuccess: (_data, variables) => {
            notification.success({
                message: variables.status === 'draft' ? 'Draft Disimpan' : 'Campaign Berhasil Dibuat',
                description: variables.status === 'draft' 
                    ? 'Campaign Anda telah disimpan sebagai draft.' 
                    : 'Campaign Anda sedang menunggu verifikasi admin.',
                placement: 'topRight',
            });
            navigate('/my-campaigns');
        },
        onError: (error) => {
            const messages = getErrorMessages(error);
            notification.error({
                message: 'Gagal Membuat Campaign',
                description: messages[0] || 'Terjadi kesalahan.',
                placement: 'topRight',
            });
        }
    });

    return (
        <CampaignForm
            title="Mulai Kebaikan Anda"
            subtitle="Isi formulir di bawah untuk membuat campaign baru."
            onSubmit={(values, status, coverImage) => createCampaignMutation.mutate({ values, status, coverImage })}
            isSubmitting={createCampaignMutation.isPending}
        />
    );
};

export default CreateCampaignPage;
