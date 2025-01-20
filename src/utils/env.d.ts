declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NEXT_PUBLIC_SUPABASE_URL: string;
        NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
        TWITCH_BOT_USERNAME: string;
        TWITCH_BOT_TOKEN: string;
        TWITCH_CLIENT_ID: string;
        TWITCH_CLIENT_SECRET: string;
      }
    }
  }
  
  export {};