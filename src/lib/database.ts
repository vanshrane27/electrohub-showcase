import { supabase } from "@/integrations/supabase/client";

// Types for Customer Service AI System
export interface HistoryEntry {
  timestamp: string;
  message: string;
  type: string;
}

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  latest_message: string | null;
  history: HistoryEntry[] | unknown;
  created_at: string;
}

export interface Issue {
  id: string;
  customer_id: string;
  category: 'warranty' | 'booking' | 'order' | 'general';
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
}

export interface Warranty {
  id: string;
  customer_id: string;
  product_name: string;
  serial_number: string;
  warranty_start: string;
  warranty_end: string;
  created_at: string;
}

export interface Booking {
  id: string;
  customer_id: string;
  preferred_date: string;
  preferred_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

// Database functions
export const db = {
  // Customer operations
  customers: {
    async getAll() {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Customer[];
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Customer | null;
    },

    async getByPhone(phone: string) {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', phone)
        .maybeSingle();
      
      if (error) throw error;
      return data as Customer | null;
    },
  },

  // Issue operations
  issues: {
    async getAll() {
      const { data, error } = await supabase
        .from('issues')
        .select('*, customers(*)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },

    async getByCustomerId(customerId: string) {
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Issue[];
    },

    async updateStatus(id: string, status: Issue['status']) {
      const { data, error } = await supabase
        .from('issues')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Issue;
    },
  },

  // Warranty operations
  warranty: {
    async getAll() {
      const { data, error } = await supabase
        .from('warranty')
        .select('*, customers(*)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },

    async getByCustomerId(customerId: string) {
      const { data, error } = await supabase
        .from('warranty')
        .select('*')
        .eq('customer_id', customerId);
      
      if (error) throw error;
      return data as Warranty[];
    },

    async checkWarrantyStatus(serialNumber: string) {
      const { data, error } = await supabase
        .from('warranty')
        .select('*')
        .eq('serial_number', serialNumber)
        .maybeSingle();
      
      if (error) throw error;
      
      if (!data) return { valid: false, message: 'Warranty not found' };
      
      const now = new Date();
      const endDate = new Date(data.warranty_end);
      const isValid = now <= endDate;
      
      return {
        valid: isValid,
        warranty: data as Warranty,
        message: isValid ? 'Warranty is active' : 'Warranty has expired'
      };
    },
  },

  // Booking operations
  bookings: {
    async getAll() {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, customers(*)')
        .order('preferred_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },

    async getByCustomerId(customerId: string) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('customer_id', customerId)
        .order('preferred_date', { ascending: true });
      
      if (error) throw error;
      return data as Booking[];
    },

    async updateStatus(id: string, status: Booking['status']) {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Booking;
    },
  },
};

// Edge function endpoints (for n8n integration)
export const apiEndpoints = {
  customersCreateOrUpdate: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/customers-create-or-update`,
  issuesCreate: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/issues-create`,
  aiCallback: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-callback`,
};

export { supabase };
