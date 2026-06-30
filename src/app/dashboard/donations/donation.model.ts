export interface IncompleteLeadsResp {
    leads : {
        current_page: number;
        data: DonationType[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        next_page_url: string;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    }
}

export interface DonationType {
        amount: string;
        comments: {
            admin: {
                created_at: string;
                email: string;
                email_verified_at: string | null;
                gotopass: string;
                id: number;
                profile_url: string | null;
                status: string;
                updated_at: string;
                username: string;
            }[];
            admin_id: number;
            comment: string;
            created_at: string;
            disposition: string;
            follow_up_time: string;
            id: number;
            lead_id: number;
            updated_at: string;
        }[];
        country: string | null;
        created_at: string;
        currency: string;
        date: string;
        deleted_at: string | null;
        disposition_change: string;
        disposition_id: number;
        duration: string;
        email: string;
        follow_up_time: string;
        home_phone: string | null;
        id: number;
        lead_ip: string | null;
        mobile: string;
        name: string;
        nature: string | null;
        referral: string | null;
        referral_id: string | null;
        selected: number;
        sendgrid: number;
        type: string;
        updated_at: string;
}

export interface DeleteLeadResp {
    message: string;
    status: number
}

export interface Comment {
    admin_id: number,
    comment: string,
    created_at: Date,
    disposition: string,
    follow_up_time: Date,
    id: number
    lead_id: number,
    updated_at: Date,
}

export interface UpdateDispositionResp {
    message: string;
    status: number;
    comment: Comment
}