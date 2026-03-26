export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: 'client' | 'studio' | 'admin';
          full_name: string | null;
          email: string | null;
          phone: string | null;
          avatar_url: string | null;
          studio_name: string | null;
          fiscal_code: string | null;
          vat_number: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [];
      };
      clients: {
        Row: {
          id: string;
          studio_id: string | null;
          name: string;
          fiscal_code: string | null;
          vat_number: string | null;
          ateco: string | null;
          ateco_description: string | null;
          regime: 'forfettario' | 'ordinario' | 'semplificato' | null;
          package_type: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          start_date: string | null;
          status: 'attivo' | 'sospeso' | 'cessato';
          annual_revenue: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['clients']['Insert']>;
        Relationships: [];
      };
      invoices: {
        Row: {
          id: string;
          client_id: string | null;
          studio_id: string | null;
          number: string;
          date: string;
          client_name: string | null;
          recipient_name: string | null;
          recipient_vat: string | null;
          amount: number;
          vat_amount: number;
          total: number;
          status: 'bozza' | 'inviata' | 'consegnata' | 'accettata' | 'rifiutata' | 'scartata';
          type: 'emessa' | 'ricevuta';
          xml_content: string | null;
          sdi_id: string | null;
          payment_date: string | null;
          payment_method: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['invoices']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['invoices']['Insert']>;
        Relationships: [];
      };
      deadlines: {
        Row: {
          id: string;
          studio_id: string | null;
          client_id: string | null;
          client_name: string | null;
          title: string;
          description: string | null;
          due_date: string;
          type: 'inps' | 'inail' | 'ade' | 'altro';
          urgency: 'normale' | 'imminente' | 'scaduta';
          completed: boolean;
          completed_at: string | null;
          amount: number | null;
          payment_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['deadlines']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['deadlines']['Insert']>;
        Relationships: [];
      };
      tickets: {
        Row: {
          id: string;
          studio_id: string | null;
          client_id: string | null;
          client_name: string | null;
          subject: string;
          category: 'fiscale' | 'contributivo' | 'lavoro' | 'societario' | 'altro';
          status: 'aperto' | 'in_lavorazione' | 'chiuso';
          priority: 'bassa' | 'media' | 'alta' | 'urgente';
          last_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tickets']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['tickets']['Insert']>;
        Relationships: [];
      };
      ticket_messages: {
        Row: {
          id: string;
          ticket_id: string;
          sender_id: string | null;
          sender_role: string | null;
          sender_name: string | null;
          content: string;
          attachments: string[] | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ticket_messages']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['ticket_messages']['Insert']>;
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          studio_id: string | null;
          client_id: string | null;
          name: string;
          type: string | null;
          size_kb: number | null;
          storage_path: string | null;
          signed: boolean;
          signed_at: string | null;
          signature_id: string | null;
          category: string | null;
          tags: string[] | null;
          uploaded_at: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['documents']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['documents']['Insert']>;
        Relationships: [];
      };
      todo_items: {
        Row: {
          id: string;
          studio_id: string | null;
          client_id: string | null;
          client_name: string | null;
          title: string;
          description: string | null;
          completed: boolean;
          completed_at: string | null;
          due_date: string | null;
          priority: 'bassa' | 'media' | 'alta';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['todo_items']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['todo_items']['Insert']>;
        Relationships: [];
      };
      tax_assessments: {
        Row: {
          id: string;
          studio_id: string | null;
          client_id: string | null;
          client_name: string | null;
          category: 'imposte_dirette' | 'iva' | 'registro' | 'locale' | 'contributivo';
          status: 'caricato' | 'in_valutazione' | 'documenti_richiesti' | 'in_lavorazione' | 'concluso';
          notification_date: string | null;
          upload_date: string | null;
          amount: number | null;
          description: string | null;
          document_path: string | null;
          response_deadline: string | null;
          impugnation_deadline: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tax_assessments']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['tax_assessments']['Insert']>;
        Relationships: [];
      };
      chat_messages: {
        Row: {
          id: string;
          studio_id: string | null;
          client_id: string | null;
          sender_id: string | null;
          sender_role: 'client' | 'studio' | 'ai';
          sender_name: string | null;
          text: string;
          is_ai: boolean;
          read_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['chat_messages']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['chat_messages']['Insert']>;
        Relationships: [];
      };
      ai_notifications: {
        Row: {
          id: string;
          user_id: string | null;
          type: 'bando' | 'legge' | 'rottamazione' | 'scadenza' | 'anomalia';
          title: string;
          summary: string | null;
          action_label: string | null;
          action_url: string | null;
          read: boolean;
          read_at: string | null;
          date: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ai_notifications']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['ai_notifications']['Insert']>;
        Relationships: [];
      };
      dvr_documents: {
        Row: {
          id: string;
          studio_id: string | null;
          client_id: string | null;
          client_name: string | null;
          title: string;
          risk_level: 'basso' | 'medio' | 'alto';
          status: 'bozza' | 'completato' | 'firmato' | 'scaduto';
          version: string | null;
          created_date: string | null;
          review_date: string | null;
          signed_date: string | null;
          document_path: string | null;
          workers_count: number | null;
          activity_type: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['dvr_documents']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['dvr_documents']['Insert']>;
        Relationships: [];
      };
      colf_workers: {
        Row: {
          id: string;
          studio_id: string | null;
          client_id: string | null;
          full_name: string;
          fiscal_code: string | null;
          birth_date: string | null;
          birth_place: string | null;
          nationality: string | null;
          document_type: string | null;
          document_number: string | null;
          contract_type: string | null;
          hours_per_week: number | null;
          level: string | null;
          gross_salary: number | null;
          net_salary: number | null;
          start_date: string | null;
          end_date: string | null;
          status: 'attivo' | 'sospeso' | 'cessato';
          iban: string | null;
          address: string | null;
          phone: string | null;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['colf_workers']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['colf_workers']['Insert']>;
        Relationships: [];
      };
      colf_payslips: {
        Row: {
          id: string;
          worker_id: string;
          studio_id: string | null;
          month: string;
          year: number;
          gross_amount: number | null;
          net_amount: number | null;
          inps_contribution: number | null;
          irpef: number | null;
          trf_quota: number | null;
          extra_hours_amount: number | null;
          holiday_pay: number | null;
          document_path: string | null;
          generated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['colf_payslips']['Row'], 'id' | 'generated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['colf_payslips']['Insert']>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
