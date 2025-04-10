# Chibi Todo 🎮

A gamified todo list application with a Y2K aesthetic, featuring cute chibi characters that help you manage your tasks. Built with Next.js, Supabase, and a modern UI component library.

## Remaining Tasks 🎯

### Stuff we can do quickly (Simple UI Changes) 🚀
- Implement scanline effect overlay for CRT aesthetic
- Add blinking cursor animation for terminal feel
- Create Windows 95-style button components with 3D border effects
- Implement basic hover animations for interactive elements
- Add DOS-style alert dialogs for system messages
- Create simple shine animations for buttons and icons
- Implement basic pulse animations for status indicators

### Medium Hard Stuff (Virtual Pet Features) 🎮
- Build Chibi onboarding flow with character selection
- Create animated Chibi health stats display (happiness and energy)
- Implement task completion reward system with feeding animations
- Add "Clean All Completed" feature with Chibi cleaning animation
- Create Sleepy Zone with sleeping/cleaning Chibi animations
- Build settings page with theme configuration
- Implement time-based decay system for Chibi stats
- Add visual feedback system for task completion rewards
- Create DOS-style windows for different zones
- Implement basic sound effects system

### If Time Permits ⏳
- Chibi evolution system based on task completion
- Achievement system with unlockable badges
- Statistics dashboard with productivity trends
- Social features for sharing achievements
- Voice command integration
- Recurring task system
- Mobile app with push notifications
- Advanced animation system for Chibi interactions
- Customizable Chibi designs and accessories
- Advanced sound effects and background music system
- Detailed Chibi health tracking and care system
- Task categorization with visual indicators
- Advanced data visualization for productivity metrics

## Features ✨

- **Chibi Characters**: Cute companions that make task management fun
- **Task Zones**: 
  - Awake Zone: For active tasks
  - Sleep Zone: For completed tasks
- **Modern UI**: Clean, responsive design with Y2K aesthetic
- **Authentication**: Secure login with Supabase
- **Dark Mode**: Eye-friendly dark theme support

## User Registration & Account Creation 👤

The app uses Supabase for user authentication with a simple registration process:

1. **Registration Flow**:
   - Users can create an account using email and password
   - The registration form includes:
     - Email address
     - Password
     - Password confirmation
   - Upon successful registration:
     - User is automatically logged in
     - A new user profile is created in Supabase
     - User gains access to create and manage their chibis

2. **Account Security**:
   - Passwords are securely hashed and stored
   - Email verification is supported
   - Session management is handled automatically
   - Row Level Security ensures data privacy

3. **Post-Registration**:
   - Users can immediately start creating chibis
   - Each user gets their own isolated data space
   - All data is automatically associated with the user's account

## Game Loop 🎲

The application features a unique gamification loop centered around chibi characters:

1. **Chibi Management**:
   - Each user can have multiple chibi characters
   - Chibis have attributes:
     - Happiness (default: 50)
     - Energy (default: 60)
     - Last fed timestamp
   - Chibis need to be cared for to maintain their attributes

2. **Task System**:
   - Tasks are associated with specific chibis
   - Tasks can be:
     - Created in the Awake Zone
     - Completed and moved to the Sleep Zone
     - Tracked with timestamps (created_at, completed_at)

3. **Progression**:
   - Completing tasks affects chibi attributes
   - Regular interaction with chibis (feeding, etc.) maintains their well-being
   - The system tracks task completion history

## Data Storage & Retrieval 📦

The app uses Supabase for all data operations:

1. **Database Structure**:
   - Two main tables:
     - `chibis`: Stores chibi character data
     - `tasks`: Stores task data linked to chibis

2. **Chibis Table**:
   ```sql
   CREATE TABLE chibis (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id uuid REFERENCES auth.users NOT NULL,
     name text NOT NULL,
     type text NOT NULL,
     happiness integer DEFAULT 50,
     energy integer DEFAULT 60,
     last_fed timestamptz DEFAULT now(),
     created_at timestamptz DEFAULT now()
   );
   ```

3. **Tasks Table**:
   ```sql
   CREATE TABLE tasks (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     chibi_id uuid REFERENCES chibis ON DELETE CASCADE NOT NULL,
     text text NOT NULL,
     completed boolean DEFAULT false,
     completed_at timestamptz,
     created_at timestamptz DEFAULT now()
   );
   ```

4. **Data Operations**:
   - **Create**: Insert new chibis or tasks
   - **Read**: Fetch user's chibis and their associated tasks
   - **Update**: Modify chibi attributes or task status
   - **Delete**: Remove chibis (cascades to their tasks) or individual tasks

5. **Security**:
   - Row Level Security (RLS) enabled on all tables
   - Users can only access their own data
   - Automatic timestamps for tracking changes
   - Cascading deletes to maintain data integrity

## Authentication System 🔐

The app uses Supabase for secure authentication:

1. **Setup**:
   - Environment variables required:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-project-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     ```

2. **Security Features**:
   - Row Level Security (RLS) enabled on all tables
   - Users can only access their own data
   - Secure session management
   - Protected routes and API endpoints

3. **Database Schema**:
   - `chibis` table:
     - User-specific chibi characters
     - Attributes and stats tracking
   - `tasks` table:
     - Task management
     - Completion status
     - Association with chibis

## Tech Stack 🛠️

- **Frontend**: Next.js, React
- **Styling**: Tailwind CSS
- **Authentication**: Supabase
- **UI Components**: Custom component library
- **Icons**: Lucide Icons

## Getting Started 🚀

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure 📁

```
├── app/
│   ├── globals.css      # Global styles and theme configuration
│   ├── layout.tsx       # Root layout component
│   └── page.tsx         # Main application page
├── components/
│   └── ui/              # Reusable UI components
└── lib/
    └── supabase.ts      # Supabase client configuration
```


## Contributing 🤝

Created by Group KK at GSU!

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- Inspired by the Y2K aesthetic and chibi culture
- Built with ❤️ for PeachHacks 2025
