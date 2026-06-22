import React, { useState } from 'react';
import { Modal, Form, InputNumber, Input, Checkbox, Button, message, Space, Typography } from 'antd';
import { HeartFilled } from '@ant-design/icons';
import api from '../api/axios';

const { Text, Paragraph } = Typography;

interface DonationModalProps {
    visible: boolean;
    onCancel: () => void;
    campaignId: number;
    campaignTitle: string;
    onSuccess?: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ 
    visible, 
    onCancel, 
    campaignId, 
    campaignTitle,
    onSuccess 
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            const response = await api.post('/auth/donations', {
                campaign_id: campaignId,
                amount: values.amount,
                message: values.message,
                is_anonymous: values.is_anonymous || false,
            });

            const snapToken = response.data.data.payment.snap_token;

            window.snap.pay(snapToken, {
                onSuccess: (result: any) => {
                    message.success('Pembayaran berhasil! Terima kasih atas kebaikan Anda.');
                    form.resetFields();
                    onCancel();
                    if (onSuccess) onSuccess();
                },
                onPending: (result: any) => {
                    message.info('Pembayaran sedang diproses. Silakan selesaikan pembayaran Anda.');
                    form.resetFields();
                    onCancel();
                },
                onError: (result: any) => {
                    message.error('Pembayaran gagal. Silakan coba lagi.');
                },
                onClose: () => {
                    message.warning('Anda menutup jendela pembayaran sebelum menyelesaikannya.');
                }
            });

        } catch (error: any) {
            console.error('Donation error:', error);
            const errorMsg = error.response?.data?.message || 'Gagal memulai donasi. Silakan coba lagi.';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const presetAmounts = [10000, 25000, 50000, 100000, 250000, 500000];

    return (
        <Modal
            title={
                <Space>
                    <HeartFilled style={{ color: '#ef4444' }} />
                    <span>Donasi untuk {campaignTitle}</span>
                </Space>
            }
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Batal
                </Button>,
                <Button 
                    key="submit" 
                    type="primary" 
                    loading={loading} 
                    onClick={handleSubmit}
                    style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                >
                    Lanjutkan Pembayaran
                </Button>,
            ]}
            width={500}
            styles={{ body: { borderRadius: 16 } }}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{ is_anonymous: false }}
                style={{ marginTop: 16 }}
            >
                <div style={{ marginBottom: 24 }}>
                    <Text strong>Pilih Nominal Donasi</Text>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
                        {presetAmounts.map(amt => (
                            <Button 
                                key={amt} 
                                onClick={() => form.setFieldsValue({ amount: amt })}
                                style={{ borderRadius: 8 }}
                            >
                                Rp {new Intl.NumberFormat('id-ID').format(amt)}
                            </Button>
                        ))}
                    </div>
                </div>

                <Form.Item
                    name="amount"
                    label="Nominal Donasi Lainnya"
                    rules={[
                        { required: true, message: 'Masukkan nominal donasi' },
                        { type: 'number', min: 1000, message: 'Minimal donasi Rp 1.000' }
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value!.replace(/Rp\s?|(,*)/g, '')}
                        placeholder="Masukkan nominal"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="message"
                    label="Pesan atau Doa (Opsional)"
                >
                    <Input.TextArea 
                        placeholder="Tulis pesan penyemangat atau doa..." 
                        rows={3} 
                        maxLength={500}
                        showCount
                    />
                </Form.Item>

                <Form.Item name="is_anonymous" valuePropName="checked">
                    <Checkbox>Donasi sebagai hamba Allah (anonim)</Checkbox>
                </Form.Item>

                <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: 16 }}>
                    Dengan melanjutkan, Anda menyetujui syarat dan ketentuan penggunaan platform kami. 
                    Donasi Anda akan diproses melalui sistem pembayaran aman Midtrans.
                </Paragraph>
            </Form>
        </Modal>
    );
};

export default DonationModal;
