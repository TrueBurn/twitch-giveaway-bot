export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          twitch_id: string;
          username: string;
          is_admin: boolean;
          is_moderator: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Row']>;
      };
      giveaways: {
        Row: {
          id: string;
          title: string;
          prize_description: string;
          status: 'active' | 'completed' | 'cancelled';
          created_at: string;
          ended_at: string | null;
          created_by: string;
        };
        Insert: Omit<Database['public']['Tables']['giveaways']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['giveaways']['Row']>;
      };
      entries: {
        Row: {
          id: string;
          giveaway_id: string;
          twitch_username: string;
          entered_at: string;
          is_winner: boolean;
        };
        Insert: Omit<Database['public']['Tables']['entries']['Row'], 'id' | 'entered_at' | 'is_winner'>;
        Update: Partial<Database['public']['Tables']['entries']['Row']>;
      };
      prizes: {
        Row: {
          id: string;
          name: string;
          description: string;
          created_at: string;
          created_by: string;
        };
        Insert: Omit<Database['public']['Tables']['prizes']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['prizes']['Row']>;
      };
    };
  };
} 