export interface TwitchBotConfig {
    username: string;
    token: string;
    channels: string[];
  }
  
  export interface TwitchCommandHandler {
    command: string;
    handler: (channel: string, tags: TwitchUserState) => Promise<void>;
  }
  
  export type TwitchCommandName = '!join' | '!draw';
  
  export interface TwitchUserState {
    badges?: { [key: string]: string };
    'display-name'?: string;
    mod?: boolean;
    subscriber?: boolean;
    username: string;
  }