# Twitch Giveaway Bot

A Next.js application for managing Twitch giveaways with real-time updates and stream overlays.

## Features

- 🎮 **Twitch Integration**: Seamless connection with Twitch chat and API
- 🎁 **Giveaway Management**: Create, manage, and track giveaways
- 🎯 **Real-time Updates**: Live entry tracking and winner selection
- 🎨 **Stream Overlays**: Customizable overlays for your stream
- 👥 **User Management**: Role-based access control (admin/moderator)
- 📊 **Analytics**: Track participation and engagement
- 🔒 **Secure**: Built with Supabase authentication and row-level security

## Prerequisites

- Node.js 18.x or later
- npm or pnpm
- Supabase account
- Twitch Developer account

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
TWITCH_BOT_USERNAME=your_bot_username
TWITCH_BOT_TOKEN=your_bot_oauth_token
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret
```

### How to obtain the environment variables

#### Supabase Credentials
1. Create a new project at [Supabase](https://supabase.com)
2. Once created, go to Project Settings > API
3. Copy the following values:
   - `NEXT_PUBLIC_SUPABASE_URL`: "Project URL"
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: "anon" public API key

#### Twitch Bot Credentials
1. Create a Twitch account for your bot or use your existing account
2. Set `TWITCH_BOT_USERNAME` to your bot's Twitch username

#### Twitch OAuth Token
1. Visit [Twitch Token Generator](https://twitchapps.com/tmi/)
2. Click "Connect with Twitch"
3. Authorize the application
4. Copy the generated token (including "oauth:")
5. Set `TWITCH_BOT_TOKEN` to this value

#### Twitch Developer Credentials
1. Go to [Twitch Developer Console](https://dev.twitch.tv/console)
2. Log in with your Twitch account
3. Click "Register Your Application"
4. Fill in the application details:
   - Name: "Your Bot Name"
   - OAuth Redirect URLs: `http://localhost:3000/api/auth/callback/twitch` (development)
   - Category: "Chat Bot"
5. Click "Create"
6. Copy the generated Client ID and set as `TWITCH_CLIENT_ID`
7. Click "New Secret" to generate a Client Secret
8. Copy the Client Secret and set as `TWITCH_CLIENT_SECRET`

### Security Notes
- Never commit your `.env.local` file
- Keep your Client Secret and OAuth tokens secure
- Rotate secrets if they become compromised
- Use different credentials for development and production

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/twitch-giveaway-bot.git
cd twitch-giveaway-bot
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up the database:
   - Create a new Supabase project
   - Run the SQL schema from `src/lib/supabase/schema.sql`
   - Update your environment variables

4. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

## Usage

### Admin Dashboard

1. **Login**: Authenticate with your Twitch account
2. **Create Giveaway**: Set up new giveaways with custom rules
3. **Manage Entries**: View and manage participant entries
4. **Select Winners**: Automatically or manually select winners
5. **View Analytics**: Track giveaway performance

### Stream Overlay

1. Add a new Browser Source in OBS:
   - URL: `http://your-domain/overlay/winner`
   - Width: 1920px
   - Height: 1080px
   - Custom CSS:
     ```css
     body { background-color: rgba(0, 0, 0, 0); }
     ```

### Twitch Commands

- `!join`: Allows viewers to enter the active giveaway
- `!draw`: (Moderators only) Draws a winner from the entries

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/         # React components
├── lib/               # Utility libraries
│   └── supabase/     # Supabase client & types
├── types/            # TypeScript type definitions
└── utils/            # Helper functions
```

## Contributing

We welcome contributions to Twitch Giveaway Bot! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- How to submit bug reports
- How to submit feature requests
- How to submit pull requests
- Development setup
- Coding standards
- Testing guidelines

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [tmi.js](https://tmijs.com/)

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Deployment

### Prerequisites
- [GitHub Account](https://github.com)
- [Vercel Account](https://vercel.com)
- [Supabase Account](https://supabase.com)

### Step 1: Prepare Your Repository
1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

### Step 2: Set Up Supabase Project
1. Create a new Supabase project
2. Go to Project Settings > Database
3. Run the schema setup SQL from `src/lib/supabase/schema.sql`
4. Note down your project URL and anon key
5. Set up row level security (RLS) policies as defined in the schema

### Step 3: Configure Vercel
1. Go to [Vercel](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `pnpm install` (if using pnpm)

### Step 4: Set Up Environment Variables
1. In Vercel project settings, go to "Environment Variables"
2. Add all required variables from your `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
   TWITCH_BOT_USERNAME=your_bot_username
   TWITCH_BOT_TOKEN=your_production_bot_oauth_token
   TWITCH_CLIENT_ID=your_production_client_id
   TWITCH_CLIENT_SECRET=your_production_client_secret
   ```

### Step 5: Update Twitch Application
1. Go to [Twitch Developer Console](https://dev.twitch.tv/console)
2. Select your application
3. Add your production OAuth redirect URL:
   - Format: `https://your-domain.vercel.app/api/auth/callback/twitch`
   - Example: `https://my-giveaway-bot.vercel.app/api/auth/callback/twitch`

### Step 6: Link Services
1. **GitHub to Vercel**:
   - Vercel automatically sets up GitHub integration during project import
   - Enables automatic deployments on push to main branch

2. **Vercel to Supabase**:
   - Go to your Supabase project settings
   - Add your Vercel deployment URL to the allowed domains:
     - Project Settings > API > API Settings
     - Add `https://your-domain.vercel.app` to "Additional Redirect URLs"

3. **Configure CORS in Supabase**:
   - Project Settings > API > API Settings
   - Add your Vercel domain to "Additional Allowed Origins"

### Step 7: Deploy
1. Trigger a deployment in Vercel:
   ```bash
   git push origin main
   ```
   Or manually deploy from Vercel dashboard

2. Verify the deployment:
   - Check Vercel build logs
   - Test authentication flow
   - Verify database connections
   - Test Twitch bot functionality

### Production Considerations

#### Security
- Use separate Twitch applications for development and production
- Regularly rotate OAuth tokens and secrets
- Enable 2FA on all service accounts
- Monitor Supabase logs for unusual activity

#### Performance
- Enable Vercel's Edge Functions where applicable
- Use Supabase's connection pooling
- Configure appropriate RLS policies
- Set up monitoring and alerts

#### Maintenance
- Set up automatic backups in Supabase
- Configure GitHub Actions for CI/CD
- Set up error tracking (e.g., Sentry)
- Monitor resource usage

### Troubleshooting

#### Common Issues
1. **OAuth Callback Errors**:
   - Verify redirect URLs in Twitch Developer Console
   - Check environment variables
   - Ensure proper CORS configuration

2. **Database Connection Issues**:
   - Verify Supabase credentials
   - Check RLS policies
   - Monitor connection limits

3. **Build Failures**:
   - Check Vercel build logs
   - Verify dependencies
   - Check environment variables

For more help, check the [Vercel Documentation](https://vercel.com/docs) or [Supabase Documentation](https://supabase.com/docs).
