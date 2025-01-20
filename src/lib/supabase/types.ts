export type UserRole = 'admin' | 'moderator';
export type GiveawayStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export interface User {
  id: string;
  twitch_id: string;
  twitch_login: string;
  display_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Giveaway {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  prize: string;
  requirements?: string;
  status: GiveawayStatus;
  duration_minutes?: number;
  created_at: string;
  started_at?: string;
  ended_at?: string;
  updated_at: string;
}

export interface Entry {
  id: string;
  giveaway_id: string;
  twitch_username: string;
  twitch_id?: string;
  is_winner: boolean;
  entered_at: string;
}

export interface Prize {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'created_at' | 'updated_at'>>;
      };
      giveaways: {
        Row: Giveaway;
        Insert: Omit<Giveaway, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Giveaway, 'id' | 'created_at' | 'updated_at'>>;
      };
      entries: {
        Row: Entry;
        Insert: Omit<Entry, 'id' | 'entered_at'>;
        Update: Partial<Omit<Entry, 'id' | 'entered_at'>>;
      };
      prizes: {
        Row: Prize;
        Insert: Omit<Prize, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Prize, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Functions: {
      is_admin: {
        Args: { user_id: string };
        Returns: boolean;
      };
      is_moderator_or_admin: {
        Args: { user_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      giveaway_status: GiveawayStatus;
    };
  };
} 