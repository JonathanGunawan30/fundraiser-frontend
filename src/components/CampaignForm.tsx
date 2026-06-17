import React, { useState, useEffect } from 'react';
import {
    Typography,
    Card,
    Form,
    Input,
    InputNumber,
    DatePicker,
    Select,
    Upload,
    Button,
    Divider,
    Steps,
    Row,
    Col,
} from 'antd';
import {
    InboxOutlined,
    InfoCircleOutlined,
    RocketOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import dayjs from 'dayjs';
import { compressImageToWebp } from '../lib/compressImage';
import type { Campaign, CampaignCategory, Tag } from '../types';
import type { Dayjs } from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;
const { Option } = Select;
const { TextArea } = Input;

export interface CampaignFormValues {
    title: string;
    category_id: number;
    description: string;
    goal_amount: number;
    deadline: Dayjs;
    tags?: number[];
    story: string;
}

interface CampaignFormProps {
    initialData?: Campaign;
    onSubmit: (values: CampaignFormValues, status: 'draft' | 'pending', coverImage: File | null) => void;
    isSubmitting: boolean;
    title: string;
    subtitle: string;
}

const STEP_FIELDS: Record<number, (keyof CampaignFormValues)[]> = {
    0: ['title', 'category_id', 'description'],
    1: ['goal_amount', 'deadline', 'tags'],
    2: ['story'],
};

const CampaignForm: React.FC<CampaignFormProps> = ({ 
    initialData, 
    onSubmit, 
    isSubmitting, 
    title, 
    subtitle 
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm<CampaignFormValues>();
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
    const previewUrl = localPreviewUrl ?? initialData?.cover_image_url ?? null;

    useEffect(() => {
        if (initialData) {
            form.setFieldsValue({
                title: initialData.title,
                category_id: initialData.category_id || initialData.category?.id,
                description: initialData.description,
                goal_amount: initialData.goal_amount,
                deadline: dayjs(initialData.deadline),
                tags: initialData.tags?.map(t => t.id),
                story: initialData.story,
            });
        }
    }, [initialData, form]);

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleBeforeUpload = async (file: File) => {
        try {
            const compressedFile = await compressImageToWebp(file, {
                maxWidth: 1600,
                maxHeight: 1600,
                quality: 0.8,
            });
            setCoverImage(compressedFile);
            setLocalPreviewUrl(URL.createObjectURL(compressedFile));
        } catch (error) {
            console.error('Gagal compress gambar:', error);
            setCoverImage(file);
            setLocalPreviewUrl(URL.createObjectURL(file));
        }
        return false;
    };

    const handleRemoveImage = () => {
        setCoverImage(null);
        setLocalPreviewUrl(null);
    };
    const { data: categories } = useQuery<CampaignCategory[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api.get('/campaign-categories');
            return response.data.data;
        },
    });

    const { data: tags } = useQuery<Tag[]>({
        queryKey: ['tags'],
        queryFn: async () => {
            const response = await api.get('/tags');
            return response.data.data;
        },
    });

    const next = async () => {
        try {
            await form.validateFields(STEP_FIELDS[currentStep]);
            setCurrentStep(currentStep + 1);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const prev = () => setCurrentStep(currentStep - 1);

    const stepsMeta = [
        { title: 'Informasi Dasar', icon: <InfoCircleOutlined /> },
        { title: 'Target & Waktu', icon: <RocketOutlined /> },
        { title: 'Konten & Gambar', icon: <InboxOutlined /> },
    ];

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <Title level={2} style={{ fontWeight: 800 }}>{title}</Title>
                <Text type="secondary">{subtitle}</Text>
            </div>

            <Card style={{ borderRadius: 20, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                <Steps
                    current={currentStep}
                    items={stepsMeta.map(item => ({ key: item.title, title: item.title, icon: item.icon }))}
                    style={{ marginBottom: 40 }}
                />

                <Form
                    form={form}
                    layout="vertical"
                >
                    <div style={{ minHeight: 300 }}>
                        <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
                            <Row gutter={24}>
                                <Col xs={24} lg={16}>
                                    <Form.Item
                                        label="Judul Campaign"
                                        name="title"
                                        rules={[{ required: true, message: 'Judul campaign wajib diisi' }]}
                                    >
                                        <Input size="large" placeholder="Contoh: Bantuan Kemanusiaan untuk Korban Banjir" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Kategori"
                                        name="category_id"
                                        rules={[{ required: true, message: 'Pilih kategori campaign' }]}
                                    >
                                        <Select size="large" placeholder="Pilih Kategori">
                                            {categories?.map(cat => (
                                                <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="Deskripsi Singkat"
                                        name="description"
                                        rules={[{ required: true, message: 'Deskripsi singkat wajib diisi' }]}
                                    >
                                        <TextArea rows={3} placeholder="Ceritakan singkat tentang campaign Anda..." maxLength={500} showCount />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} lg={8}>
                                    <Card title="Tips Membuat Judul" style={{ background: '#f8fafc', borderRadius: 12 }}>
                                        <Paragraph style={{ fontSize: 13 }}>
                                            <ul>
                                                <li>Gunakan kalimat yang jelas dan menyentuh hati.</li>
                                                <li>Sebutkan siapa yang dibantu dan tujuannya.</li>
                                                <li>Hindari penggunaan huruf kapital berlebihan.</li>
                                            </ul>
                                        </Paragraph>
                                    </Card>
                                </Col>
                            </Row>
                        </div>

                        <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
                            <Row gutter={24}>
                                <Col xs={24} lg={16}>
                                    <Form.Item
                                        label="Target Pendanaan (Rp)"
                                        name="goal_amount"
                                        rules={[{ required: true, message: 'Masukkan target pendanaan' }]}
                                    >
                                        <InputNumber<number>
                                            style={{ width: '100%' }}
                                            size="large"
                                            formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => Number(value!.replace(/Rp\s?|(,*)/g, ''))}
                                            min={10000}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Batas Waktu (Deadline)"
                                        name="deadline"
                                        rules={[{ required: true, message: 'Pilih batas waktu campaign' }]}
                                    >
                                        <DatePicker 
                                            size="large" 
                                            style={{ width: '100%' }} 
                                            disabledDate={(current) => current && current < dayjs().startOf('day')}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Tags (Opsional)"
                                        name="tags"
                                    >
                                        <Select mode="multiple" size="large" placeholder="Pilih Tags">
                                            {tags?.map(tag => (
                                                <Option key={tag.id} value={tag.id}>{tag.name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>

                        <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
                            <Row gutter={24}>
                                <Col xs={24} lg={16}>
                                    <Form.Item
                                        label="Cerita Lengkap"
                                        name="story"
                                        rules={[{ required: true, message: 'Ceritakan detail campaign Anda' }]}
                                    >
                                        <TextArea rows={8} placeholder="Jelaskan secara mendalam tentang campaign Anda, mengapa orang harus membantu, dan bagaimana dana akan digunakan..." />
                                    </Form.Item>

                                    <Form.Item
                                        label="Foto Utama (Cover)"
                                        required={!initialData}
                                    >
                                        <Dragger
                                            beforeUpload={handleBeforeUpload}
                                            onRemove={handleRemoveImage}
                                            maxCount={1}
                                            showUploadList={true}
                                            accept="image/*"
                                        >
                                            <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                                            <p className="ant-upload-text">Klik atau tarik file ke area ini untuk unggah</p>
                                            <p className="ant-upload-hint">Gunakan foto berkualitas tinggi untuk menarik donatur.</p>
                                        </Dragger>

                                        {previewUrl && (
                                            <div style={{ marginTop: 16, textAlign: 'center' }}>
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: 300,
                                                        borderRadius: 8,
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>
                    </div>

                    <Divider />

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            onClick={prev}
                            disabled={currentStep === 0}
                            style={{ borderRadius: 8, height: 44, padding: '0 32px' }}
                        >
                            Sebelumnya
                        </Button>

                        <div style={{ display: 'flex', gap: 12 }}>
                            {currentStep === stepsMeta.length - 1 && (
                                <Button
                                    onClick={() => {
                                        form.validateFields().then(values => {
                                            onSubmit(values, 'draft', coverImage);
                                        });
                                    }}
                                    loading={isSubmitting}
                                    style={{ borderRadius: 8, height: 44, padding: '0 24px' }}
                                >
                                    Simpan sebagai Draft
                                </Button>
                            )}

                            {currentStep < stepsMeta.length - 1 ? (
                                <Button
                                    type="primary"
                                    style={{ borderRadius: 8, height: 44, padding: '0 32px' }}
                                    onClick={next}
                                >
                                    Selanjutnya
                                </Button>
                            ) : (
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        form.validateFields().then(values => {
                                            onSubmit(values, 'pending', coverImage);
                                        });
                                    }}
                                    loading={isSubmitting}
                                    icon={<CheckCircleOutlined />}
                                    style={{ borderRadius: 8, height: 44, padding: '0 32px' }}
                                >
                                    {initialData ? 'Ajukan Perubahan' : 'Ajukan Campaign'}
                                </Button>
                            )}
                        </div>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default CampaignForm;
