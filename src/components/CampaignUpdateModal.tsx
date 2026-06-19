import React, { useState } from 'react';
import { Modal, Form, Input, Button, Upload, App } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import api from '../api/axios';
import { compressImageToWebp } from '../lib/compressImage';
import type { CampaignUpdate } from '../types';

interface CampaignUpdateModalProps {
    visible: boolean;
    onCancel: () => void;
    campaignId: number;
    onSuccess: () => void;
    initialData?: CampaignUpdate | null;
}

const CampaignUpdateModal: React.FC<CampaignUpdateModalProps> = ({
    visible,
    onCancel,
    campaignId,
    onSuccess,
    initialData
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<any[]>([]);
    const { notification } = App.useApp();

    React.useEffect(() => {
        if (visible) {
            if (initialData) {
                form.setFieldsValue({
                    title: initialData.title,
                    content: initialData.content,
                });
            } else {
                form.resetFields();
                setFileList([]);
            }
        }
    }, [visible, initialData, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            const formData = new FormData();
            formData.append('campaign_id', campaignId.toString());
            formData.append('title', values.title);
            formData.append('content', values.content);
            
            if (fileList.length > 0 && fileList[0].originFileObj) {
                // ponytail: compress and convert to webp before uploading to match main campaign image compression
                try {
                    const compressedImage = await compressImageToWebp(fileList[0].originFileObj, {
                        maxWidth: 1200,
                        maxHeight: 1200,
                        quality: 0.8,
                    });
                    formData.append('image', compressedImage);
                } catch (compressError) {
                    console.error('Failed to compress update image:', compressError);
                    formData.append('image', fileList[0].originFileObj);
                }
            }

            if (initialData) {
                // Backend typically uses POST with _method=PUT for file uploads in Laravel
                formData.append('_method', 'PUT');
                await api.post(`/auth/campaign-updates/${initialData.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                notification.success({
                    message: 'Update Diperbarui',
                    description: 'Update perkembangan campaign berhasil diperbarui.',
                    placement: 'topRight',
                });
            } else {
                await api.post('/auth/campaign-updates', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                notification.success({
                    message: 'Update Ditambahkan',
                    description: 'Perkembangan campaign baru berhasil ditambahkan.',
                    placement: 'topRight',
                });
            }

            onSuccess();
            onCancel();
        } catch (error: any) {
            console.error('Update error:', error);
            notification.error({
                message: 'Gagal Menyimpan Update',
                description: error.response?.data?.message || 'Terjadi kesalahan saat menyimpan update campaign.',
                placement: 'topRight',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={initialData ? 'Edit Update' : 'Tambah Update Baru'}
            open={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            confirmLoading={loading}
            destroyOnClose
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="title"
                    label="Judul Update"
                    rules={[{ required: true, message: 'Masukkan judul update' }]}
                >
                    <Input placeholder="Contoh: Penyaluran Tahap 1" />
                </Form.Item>
                <Form.Item
                    name="content"
                    label="Konten / Berita"
                    rules={[{ required: true, message: 'Masukkan isi update' }]}
                >
                    <Input.TextArea rows={6} placeholder="Ceritakan perkembangan campaign Anda..." />
                </Form.Item>
                <Form.Item label="Foto (Opsional)">
                    <Upload
                        beforeUpload={() => false}
                        fileList={fileList}
                        onChange={({ fileList }) => setFileList(fileList.slice(-1))}
                        maxCount={1}
                        listType="picture"
                    >
                        <Button icon={<UploadOutlined />}>Pilih Foto</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CampaignUpdateModal;
