import React, { useState } from 'react';
import { Typography, Form, Input, InputNumber, Modal, Alert, Button, Space, App } from 'antd';
import { WalletOutlined } from '@ant-design/icons';
import api from '../api/axios';
import { getErrorMessages } from '../lib/utils';

const { Text, Paragraph } = Typography;

interface WithdrawalModalProps {
    visible: boolean;
    onCancel: () => void;
    campaignId: number;
    campaignTitle: string;
    availableBalance: number;
    onSuccess?: () => void;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
    visible,
    onCancel,
    campaignId,
    campaignTitle,
    availableBalance,
    onSuccess
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { notification } = App.useApp();

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            await api.post('/auth/withdrawals', {
                campaign_id: campaignId,
                amount: values.amount,
                bank_name: values.bank_name,
                account_number: values.account_number,
                account_name: values.account_name,
            });

            notification.success({
                message: 'Success',
                description: 'Withdrawal request has been submitted successfully and is pending admin approval.',
                placement: 'topRight',
            });

            form.resetFields();
            onCancel();
            if (onSuccess) onSuccess();

        } catch (error: any) {
            console.error('Withdrawal request error:', error);
            const messages = getErrorMessages(error);
            notification.error({
                message: 'Failed to Request Withdrawal',
                description: messages[0] || 'An error occurred while submitting your request.',
                placement: 'topRight',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={
                <Space>
                    <WalletOutlined style={{ color: '#8b5cf6' }} />
                    <span>Withdraw Funds from {campaignTitle}</span>
                </Space>
            }
            open={visible}
            onCancel={onCancel}
            footer={
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
                    <Button onClick={onCancel} disabled={loading} style={{ borderRadius: '8px' }}>
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        loading={loading}
                        onClick={handleSubmit}
                        style={{ backgroundColor: '#8b5cf6', borderColor: '#8b5cf6', borderRadius: '8px' }}
                    >
                        Submit Request
                    </Button>
                </div>
            }
            width={500}
            centered
        >
            <div style={{ marginTop: 16, marginBottom: 16 }}>
                <Alert
                    message={
                        <div>
                            <Text>Available Balance to Withdraw: </Text>
                            <Text strong style={{ color: '#10b981', fontSize: '16px' }}>
                                Rp {new Intl.NumberFormat('id-ID').format(availableBalance)}
                            </Text>
                        </div>
                    }
                    type="info"
                    showIcon
                />
            </div>

            <Form
                form={form}
                layout="vertical"
                initialValues={{ amount: availableBalance >= 50000 ? availableBalance : undefined }}
            >
                <Form.Item
                    name="amount"
                    label="Withdrawal Amount"
                    rules={[
                        { required: true, message: 'Please enter the withdrawal amount' },
                        { type: 'number', min: 50000, message: 'Minimum withdrawal amount is Rp 50,000' },
                        {
                            validator: (_, value) => {
                                if (value && value > availableBalance) {
                                    return Promise.reject(new Error('Withdrawal amount cannot exceed available balance'));
                                }
                                return Promise.resolve();
                            }
                        }
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value!.replace(/Rp\s?|(,*)/g, '')}
                        placeholder="Enter amount"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="bank_name"
                    label="Bank Name"
                    rules={[
                        { required: true, message: 'Please enter the bank name' },
                        { max: 100, message: 'Bank name cannot exceed 100 characters' }
                    ]}
                >
                    <Input placeholder="e.g. BCA, Mandiri, BNI" size="large" />
                </Form.Item>

                <Form.Item
                    name="account_number"
                    label="Account Number"
                    rules={[
                        { required: true, message: 'Please enter the bank account number' },
                        { max: 50, message: 'Account number cannot exceed 50 characters' }
                    ]}
                >
                    <Input placeholder="e.g. 1234567890" size="large" />
                </Form.Item>

                <Form.Item
                    name="account_name"
                    label="Account Holder Name"
                    rules={[
                        { required: true, message: 'Please enter the account holder name' },
                        { max: 150, message: 'Name cannot exceed 150 characters' }
                    ]}
                >
                    <Input placeholder="e.g. John Doe" size="large" />
                </Form.Item>

                <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: 16 }}>
                    Withdrawal requests are processed manually by our administrators. Please allow up to 24-48 hours for the funds to be transferred. Once approved, the transfer proof will be uploaded to your dashboard.
                </Paragraph>
            </Form>
        </Modal>
    );
};

export default WithdrawalModal;
