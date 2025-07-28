export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      game_packs: {
        Row: {
          game_id: number;
          pack_id: number;
        };
        Insert: {
          game_id: number;
          pack_id: number;
        };
        Update: {
          game_id?: number;
          pack_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "game_pack_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "game_pack_pack_id_fkey";
            columns: ["pack_id"];
            isOneToOne: false;
            referencedRelation: "user_packs";
            referencedColumns: ["id"];
          },
        ];
      };
      games: {
        Row: {
          active_round: number | null;
          created_at: string;
          creator_id: string;
          first_to: number;
          id: number;
          invite_code: string;
          max_submission_length: number;
          pool_size: number;
          state: Database["public"]["Enums"]["game_state"];
          voting_mode: Database["public"]["Enums"]["voting_mode"];
        };
        Insert: {
          active_round?: number | null;
          created_at?: string;
          creator_id: string;
          first_to?: number;
          id?: number;
          invite_code: string;
          max_submission_length?: number;
          pool_size?: number;
          state?: Database["public"]["Enums"]["game_state"];
          voting_mode?: Database["public"]["Enums"]["voting_mode"];
        };
        Update: {
          active_round?: number | null;
          created_at?: string;
          creator_id?: string;
          first_to?: number;
          id?: number;
          invite_code?: string;
          max_submission_length?: number;
          pool_size?: number;
          state?: Database["public"]["Enums"]["game_state"];
          voting_mode?: Database["public"]["Enums"]["voting_mode"];
        };
        Relationships: [
          {
            foreignKeyName: "games_active_round_fkey";
            columns: ["active_round"];
            isOneToOne: false;
            referencedRelation: "rounds";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "games_creator_id_fkey1";
            columns: ["creator_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      participants: {
        Row: {
          game_id: number;
          joined_at: string;
          user_id: string;
        };
        Insert: {
          game_id: number;
          joined_at?: string;
          user_id: string;
        };
        Update: {
          game_id?: number;
          joined_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "participant_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "participants_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          display_name: string | null;
          id: string;
        };
        Insert: {
          avatar_url?: string | null;
          display_name?: string | null;
          id: string;
        };
        Update: {
          avatar_url?: string | null;
          display_name?: string | null;
          id?: string;
        };
        Relationships: [];
      };
      prompts: {
        Row: {
          family_friendly: boolean;
          id: number;
          prompt: string;
        };
        Insert: {
          family_friendly?: boolean;
          id?: number;
          prompt: string;
        };
        Update: {
          family_friendly?: boolean;
          id?: number;
          prompt?: string;
        };
        Relationships: [];
      };
      rounds: {
        Row: {
          created_at: string;
          game_id: number;
          id: number;
          judge_id: string | null;
          phase: Database["public"]["Enums"]["round_phase"];
          prompt_id: number;
        };
        Insert: {
          created_at?: string;
          game_id: number;
          id?: number;
          judge_id?: string | null;
          phase?: Database["public"]["Enums"]["round_phase"];
          prompt_id: number;
        };
        Update: {
          created_at?: string;
          game_id?: number;
          id?: number;
          judge_id?: string | null;
          phase?: Database["public"]["Enums"]["round_phase"];
          prompt_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "rounds_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rounds_judge_id_fkey1";
            columns: ["judge_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rounds_prompt_id_fkey";
            columns: ["prompt_id"];
            isOneToOne: false;
            referencedRelation: "prompts";
            referencedColumns: ["id"];
          },
        ];
      };
      submissions: {
        Row: {
          created_at: string;
          round_id: number;
          rows: string[];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          round_id: number;
          rows: string[];
          user_id: string;
        };
        Update: {
          created_at?: string;
          round_id?: number;
          rows?: string[];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "submissions_round_id_fkey";
            columns: ["round_id"];
            isOneToOne: false;
            referencedRelation: "rounds";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "submissions_user_id_fkey1";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_packs: {
        Row: {
          created_at: string;
          id: number;
          questions: string[];
          title: string;
          user_id: string;
          words: string[];
        };
        Insert: {
          created_at?: string;
          id?: number;
          questions: string[];
          title: string;
          user_id: string;
          words: string[];
        };
        Update: {
          created_at?: string;
          id?: number;
          questions?: string[];
          title?: string;
          user_id?: string;
          words?: string[];
        };
        Relationships: [
          {
            foreignKeyName: "user_packs_user_id_fkey1";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      votes: {
        Row: {
          author_id: string;
          created_at: string;
          round_id: number;
          user_id: string;
        };
        Insert: {
          author_id: string;
          created_at?: string;
          round_id: number;
          user_id: string;
        };
        Update: {
          author_id?: string;
          created_at?: string;
          round_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "votes_round_id_fkey";
            columns: ["round_id"];
            isOneToOne: false;
            referencedRelation: "rounds";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "votes_user_id_fkey1";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      word_pools: {
        Row: {
          game_id: number;
          user_id: string;
          words: string[];
        };
        Insert: {
          game_id: number;
          user_id: string;
          words: string[];
        };
        Update: {
          game_id?: number;
          user_id?: string;
          words?: string[];
        };
        Relationships: [
          {
            foreignKeyName: "word_pools_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "word_pools_user_id_fkey1";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      game_state: "open" | "running" | "finished";
      round_phase: "submission" | "voting" | "finished";
      voting_mode: "judge" | "jury";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      game_state: ["open", "running", "finished"],
      round_phase: ["submission", "voting", "finished"],
      voting_mode: ["judge", "jury"],
    },
  },
} as const;
