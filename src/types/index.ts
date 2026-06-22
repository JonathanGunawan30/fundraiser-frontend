export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
    status: string;
}

export interface CampaignCategory {
    id: number;
    name: string;
    slug: string;
    icon_url?: string;
    is_active: boolean;
    order_index?: number;
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
}

export interface CampaignUpdate {
    id: number;
    campaign_id: number;
    title: string;
    content: string;
    image_url?: string;
    created_at: string;
}

export interface Banner {
    id: number;
    title: string;
    image_url: string;
    link_url?: string;
    is_active: boolean;
    start_at?: string;
    end_at?: string;
    order_index?: number;
}

export interface Campaign {
    id: number;
    user_id: number;
    category_id: number;
    title: string;
    slug: string;
    description: string;
    cover_image_url: string;
    goal_amount: number;
    collected_amount: number;
    donor_count: number;
    deadline: string;
    status: string;
    verified_status: string;
    created_at: string;
    story: string;
    user?: User;
    category?: CampaignCategory;
    tags?: Tag[];
    images?: { id: number; image_url: string; order_index: number }[];
    updates?: any[];
    donations?: Donation[];
}

export interface SiteSetting {
    id: number;
    key: string;
    label: string;
    value: string;
    group: string;
    type: string;
}

export interface Donation {
    id: number;
    donation_number: string;
    user_id: number;
    campaign_id: number;
    amount: number;
    message?: string;
    is_anonymous: boolean;
    status: string;
    invoice_url?: string;
    created_at: string;
    user?: User;
    campaign?: Campaign;
}

export interface Faq {
    id: number;
    question: string;
    answer: string;
    order_index: number;
    is_active: boolean;
}

export interface LoginCredentials {
    email: string;
    password?: string;
}

export interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        current_page: number;
        per_page: number;
        total: number;
    };
    message: string;
}

export interface UserDashboardData {
    overview: {
        total_donations: number;
        total_donated_amount: number;
        active_campaigns_count: number;
        total_collected_amount: number;
        total_raised_amount?: number;
        total_donors_count?: number;
    };
    charts: {
        donations_last_30_days: {
            date: string;
            amount: number;
            count: number;
        }[];
    };
    my_campaigns: (Campaign & { donations_count: number })[];
    recent_donations: Donation[];
}

export interface Withdrawal {
    id: number;
    campaign: {
        id: number;
        title: string;
    };
    user: {
        id: number;
        name: string;
    };
    amount: number;
    bank_info: {
        bank_name: string;
        account_number: string;
        account_name: string;
    };
    status: 'pending' | 'completed' | 'rejected';
    rejection_reason?: string;
    transfer_proof_url?: string;
    processed_at?: string;
    processed_by?: {
        id: number;
        name: string;
    };
    created_at: string;
}

export interface CreateWithdrawalPayload {
    campaign_id: number;
    amount: number;
    bank_name: string;
    account_number: string;
    account_name: string;
}

export interface ProcessWithdrawalPayload {
    status: 'completed' | 'rejected';
    transfer_proof?: File;
    rejection_reason?: string;
}

export interface AppNotification {
    id: string;
    type: string;
    notifiable_type: string;
    notifiable_id: number;
    data: {
        type: string;
        campaign_id?: number;
        campaign_title?: string;
        user_name?: string;
        amount?: number;
        status?: string;
        message: string;
    };
    read_at: string | null;
    created_at: string;
    updated_at: string;
}

