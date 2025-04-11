# Chibi Todo 🎮

A gamified todo list application with a Y2K aesthetic, featuring cute chibi characters that help you manage your tasks. Built with Next.js, Supabase, and a modern UI component library.

## Recent Updates 🆕

### Data Visualization & Analytics 📊
- Added comprehensive analytics dashboard
- Implemented Chibi health tracking with visual charts
- Enhanced task analytics with completion trends
- Added sleep zone analytics for completed tasks
- Integrated real-time health monitoring for chibis

### Visual Enhancements 🎨
- Implemented CRT effect overlay for authentic Y2K aesthetic
- Updated Chibi display with improved animations
- Enhanced task visualization with due date support
- Improved dialog and toast notifications
- Streamlined UI components for better performance

### Technical Improvements 🛠️
- Added due date support to tasks
- Optimized component structure
- Updated package dependencies
- Enhanced type safety
- Improved error handling

## Remaining Tasks 🎯

### Stuff we can do quickly (Simple UI Changes) 🚀
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

- Theme: Blast from the Past
- Inspired by the Y2K aesthetic and chibi culture
- Built with ❤️ for PeachHacks 2025

## Component Overview 🧩

### Chibi Components
- **`ChibiList.tsx`**: Main component that displays all user's chibis in a grid layout. Handles fetching chibis from Supabase, displays their stats (happiness/energy), and manages the create-new-chibi flow. Includes empty state handling and loading states.

- **`Chibi.tsx`**: Individual chibi display component. Renders a single chibi with its image, name, and stat bars (happiness/energy). Includes hover animations and click handlers for interaction.

- **`CreateChibiForm.tsx`**: Form component for creating new chibis. Handles name input, type selection (cat, dog, bunny, fox, panda), and Supabase integration for saving new chibis.

- **`FeedDialog.tsx`**: Modal dialog that appears when completing tasks, offering the option to feed your chibi. Features Y2K-style animations and sound effects.

### Task Components
- **`TaskForm.tsx`**: Comprehensive task creation form with fields for title, description, due date, and notes. Integrates with Supabase for task persistence and chibi association.

- **`Task.tsx`**: Individual task display component with Windows 95-style design. Features:
  - Title bar with minimize/edit/delete controls
  - Task completion checkbox
  - Description and due date display
  - Collapsible notes section
  - Creation timestamp
  - Real-time note saving

### Authentication
- **`AuthForm.tsx`**: Handles user authentication with multiple modes:
  - Sign up with email/password/username
  - Sign in with existing credentials
  - Guest login option
  - Email verification flow
  - Form validation and error handling
  - Toast notifications for feedback

### Infrastructure
- **`supabase.ts`**: Core configuration file that initializes the Supabase client with environment variables. Enables:
  - Database operations
  - Authentication services
  - Real-time subscriptions
  - File storage access

Each component follows the Y2K aesthetic guidelines with:
- Retro Windows 95/DOS visual style
- Neon color palette
- Grid backgrounds and scanline effects
- Classic terminal fonts
- Animated effects and transitions

## Data Visualization & Tracking 📊

The application now features a comprehensive data visualization system:

### Analytics Dashboard
- **Chibi Health Tracking**:
  - Real-time health monitoring
  - Visual charts for happiness and energy levels
  - Historical data tracking
  - Status indicators with color coding

- **Task Analytics**:
  - Completion rate visualization
  - Due date tracking
  - Task distribution analysis
  - Performance metrics

- **Sleep Zone Analytics**:
  - Completed task statistics
  - Completion patterns
  - Productivity trends
  - Achievement tracking

### Technical Implementation
1. **Data Collection**:
   ```typescript
   interface ChibiStats {
     happiness: number;
     energy: number;
     last_fed: Date;
     tasks_completed: number;
     due_date?: Date;
   }
   ```

2. **Chart Configuration**:
   ```typescript
   const chartConfig = {
     happiness: {
       label: 'Happiness',
       theme: {
         light: '#4CAF50',
         dark: '#81C784'
       }
     },
     energy: {
       label: 'Energy',
       theme: {
         light: '#2196F3',
         dark: '#64B5F6'
       }
     }
   };
   ```

3. **Progress Tracking**:
   ```typescript
   const calculateProgress = (current: number, max: number) => {
     return Math.min(100, (current / max) * 100);
   };
   ```

4. **Calendar Integration**:
   ```typescript
   const taskDates = {
     due: Date[];
     completed: Date[];
     feeding: Date[];
   };
   ```

### Visual Feedback System
- **Positive Reinforcement**:
  - Happy chibi animations when tasks are completed
  - Sparkle effects when progress bars fill
  - Celebration animations for streaks and achievements

- **Warning Indicators**:
  - Pulsing red alerts when stats are low
  - Warning messages in DOS-style popups
  - Sad chibi animations when neglect is detected

- **Progress Celebrations**:
  - Level-up animations when milestones are reached
  - Achievement popups with retro styling
  - Sound effects for significant events

This data visualization system creates an engaging feedback loop where:
1. Users complete tasks
2. Chibi stats are updated in real-time
3. Visual feedback reinforces positive behavior
4. Historical data helps users track their progress
5. The calendar keeps everything organized and on schedule

## Chatbot Assistant 🤖

The application features an intelligent chatbot assistant that helps users manage their tasks and provides personalized support.

### Features ✨

1. **Task-Aware Responses**
   - Real-time access to all tasks
   - Contextual advice based on task status
   - Due date awareness
   - Notes integration
   - Completion status tracking

2. **Natural Language Interface**
   - Conversational interaction
   - Friendly and supportive tone
   - Task-specific suggestions
   - Progress tracking assistance
   - Motivation and encouragement

3. **Task Management Support**
   - Task creation guidance
   - Priority suggestions
   - Due date reminders
   - Progress tracking
   - Task organization tips

### Technical Implementation 🛠️

1. **API Integration**
   ```typescript
   // Example request structure
   {
     chibiId: string;
     chibiName: string;
     message: string;
     tasks: Array<{
       id: string;
       text: string;
       completed: boolean;
       due_date?: string;
       notes?: string;
     }>;
   }
   ```

2. **Task Context Formatting**
   ```typescript
   const taskContext = tasks.map(task => {
     const status = task.completed ? '✅ Completed' : '⏳ Pending';
     const dueDate = task.due_date ? ` (Due: ${new Date(task.due_date).toLocaleDateString()})` : '';
     const notes = task.notes ? `\n   Notes: ${task.notes}` : '';
     return `- ${task.text}${dueDate}\n   ${status}${notes}`;
   }).join('\n\n');
   ```

3. **System Prompt**
   ```typescript
   const systemMessage = `You are ${chibiName}'s AI assistant. You help manage tasks and provide friendly, supportive advice. Here are the current tasks:\n\n${taskContext}\n\nWhen responding, always consider the current tasks and provide relevant advice or suggestions based on them. If there are no tasks, acknowledge this and offer to help create some.`;
   ```

### User Interface 🖥️

1. **Chat Window**
   ```
   +----------------------------------------+
   | Chat with ${chibiName}                 |
   |----------------------------------------|
   | [Message history...]                   |
   |                                        |
   | [Input field] [Send]                   |
   +----------------------------------------+
   ```

2. **Message Formatting**
   - User messages aligned right
   - Assistant messages aligned left
   - Loading indicators for responses
   - Error handling with user-friendly messages

### Error Handling 🚨

1. **API Errors**
   - Graceful error messages
   - User-friendly notifications
   - Automatic retry mechanism
   - Fallback responses

2. **Data Validation**
   - Task data verification
   - Message sanitization
   - Input validation
   - Response formatting checks

### Security 🔐

1. **Data Protection**
   - Secure API communication
   - User authentication
   - Data encryption
   - Privacy-focused design

2. **Access Control**
   - User-specific chat sessions
   - Task data isolation
   - Secure message handling
   - Protected API endpoints

### Future Enhancements 🚀

1. **Planned Features**
   - Task creation through chat
   - Due date modification
   - Priority setting
   - Task categorization
   - Progress analytics

2. **AI Improvements**
   - Enhanced context awareness
   - Better task suggestions
   - Personalized advice
   - Learning from user patterns
   - Proactive reminders

## Required Implementation Files for Data Visualization 📊

### New Components
```typescript
// components/data/visualization/
├── stats/
│   ├── ChibiHealthChart.tsx      // Line chart for happiness/energy trends
│   ├── TaskAnalyticsChart.tsx    // Bar chart for task completion
│   └── StatsOverview.tsx         // Combined stats dashboard
├── progress/
│   ├── ChibiStatusBar.tsx        // Custom progress bar for chibi stats
│   ├── TaskProgressBar.tsx       // Progress indicator for tasks
│   └── ProgressContainer.tsx     // Wrapper for multiple progress bars
└── calendar/
    ├── TaskCalendar.tsx          // Enhanced calendar with task integration
    ├── DateIndicator.tsx         // Custom date status indicators
    └── CalendarLegend.tsx        // Calendar status explanations
```

### Types and Interfaces
```typescript
// types/stats.d.ts
export interface ChibiStats {
  id: string;
  happiness: number;
  energy: number;
  last_fed: Date;
  tasks_completed: number;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  by_category: Record<string, number>;
}

export interface ChartData {
  timestamp: Date;
  happiness: number;
  energy: number;
  tasks_completed: number;
}
```

### Hooks and Utils
```typescript
// hooks/
├── useChartData.ts          // Custom hook for chart data management
├── useProgressCalculation.ts // Progress calculation utilities
└── useCalendarEvents.ts     // Calendar event management

// lib/stats/
├── chartConfigs.ts          // Chart configuration and themes
├── progressUtils.ts         // Progress bar utilities
└── dateFormatters.ts        // Date formatting helpers
```

### Integration Files
```typescript
// lib/api/
├── stats/
│   ├── queries.ts           // Supabase queries for stats
│   └── mutations.ts         // Stats update operations
└── realtime/
    └── statsSubscription.ts // Real-time stats updates
```

### Required Dependencies
```json
{
  "dependencies": {
    "recharts": "^2.10.3",        // Already available in chart.tsx
    "react-day-picker": "^8.9.1", // Already available in calendar.tsx
    "@radix-ui/react-progress": "^1.0.3", // Already available in progress.tsx
    "date-fns": "^2.30.0",        // For date manipulation
    "zustand": "^4.4.7"           // For state management
  }
}
```

### Implementation Steps

1. **Core Components Setup**
   ```typescript
   // Example: components/data/visualization/stats/ChibiHealthChart.tsx
   import { ChartContainer } from '../../chart';
   
   export function ChibiHealthChart({ chibiId }: { chibiId: string }) {
     return (
       <ChartContainer
         config={{
           happiness: {
             label: 'Happiness',
             theme: { light: '#4CAF50', dark: '#81C784' }
           },
           energy: {
             label: 'Energy',
             theme: { light: '#2196F3', dark: '#64B5F6' }
           }
         }}
       >
         {/* Chart implementation */}
       </ChartContainer>
     );
   }
   ```

2. **Progress Bar Integration**
   ```typescript
   // Example: components/data/visualization/progress/ChibiStatusBar.tsx
   import { Progress } from '../../progress';
   
   export function ChibiStatusBar({ value, type }: { value: number, type: 'happiness' | 'energy' }) {
     return (
       <Progress
         value={value}
         className={`${type === 'happiness' ? 'bg-neon-pink' : 'bg-neon-blue'}`}
       />
     );
   }
   ```

3. **Calendar Enhancement**
   ```typescript
   // Example: components/data/visualization/calendar/TaskCalendar.tsx
   import { Calendar } from '../../calendar';
   
   export function TaskCalendar({ tasks, onDateSelect }: TaskCalendarProps) {
     return (
       <Calendar
         mode="single"
         selected={selected}
         onSelect={onDateSelect}
         modifiers={{
           task: tasks.map(task => task.due_date)
         }}
       />
     );
   }
   ```

### Testing Requirements
```typescript
// __tests__/data/visualization/
├── stats/
│   ├── ChibiHealthChart.test.tsx
│   └── TaskAnalytics.test.tsx
├── progress/
│   └── StatusBars.test.tsx
└── calendar/
    └── TaskCalendar.test.tsx
```

## Jeremiah - Create Tasks to Personalize Chibi Feature 🎨

A unique gamification system that rewards task completion with chibi customization options. Each completed task unlocks new personalization features for your chibi companion.

### Unlock System 🔓

1. **Base Color** (1 Task)
   - Unlocked after completing first task
   - Choose from:
     - Neon Pink (#ff64d6)
     - Cyber Blue (#00c2ff)
     - Digital Purple (#b967ff)
     - Matrix Green (#33ff33)
     - Virtual Yellow (#ffff00)

2. **Personality** (2 Tasks)
   - Unlocked after completing two tasks
   - Affects chibi's expressions and animations
   - Options:
     - Happy (default smile)
     - Energetic (star eyes)
     - Sleepy (droopy eyes)
     - Shy (blushing)
     - Confident (sunglasses)

3. **Background** (3 Tasks)
   - Unlocked after completing three tasks
   - Choose environment:
     - Retro Computer Lab
     - Pixel City
     - Digital Space
     - Cyber Garden
     - Virtual Classroom

4. **Accessories** (4 Tasks)
   - Unlocked after completing four tasks
   - Multiple selections allowed
   - Categories:
     - Hats/Hair Accessories
     - Face Items
     - Held Items
     - Special Effects

### Technical Implementation 🛠️

1. **Database Schema Updates**:
   ```sql
   ALTER TABLE chibis
   ADD COLUMN customization jsonb DEFAULT json_build_object(
     'base_color', 'pink',
     'personality', 'happy',
     'background', 'retro',
     'accessories', ARRAY[]::text[],
     'unlocked_features', ARRAY[]::text[]
   );
   ```

2. **Window Integration**:
   - Customization icons appear in window title bar
   - Icons show locked/unlocked state
   - Hover tooltips show unlock requirements
   - Celebration animations on unlocks

3. **Progress Tracking**:
   - Visual progress indicators
   - Task completion counter
   - Unlock celebration effects
   - Persistent customization state

### User Interface 🖥️

1. **Window Header**:
   ```
   +----------------------------------------+
   | Title    🎨 😊 🖼️ 👒           _ □ X |
   |----------------------------------------|
   |               Content                   |
   |                                        |
   +----------------------------------------+
   ```
   - Icons show locked (gray) or unlocked (colored) state
   - Hover reveals unlock requirements
   - Click opens customization panel when unlocked

2. **Customization Panel**:
   - Windows 95-style interface
   - Real-time preview
   - Save/Cancel buttons
   - Category tabs for organization

### Gamification Elements 🎮

1. **Progressive Unlocks**:
   - Each task completion brings new customization options
   - Visual feedback on progress
   - Celebration animations for unlocks
   - Achievement notifications

2. **Motivation System**:
   - Clear progress indicators
   - Immediate rewards for task completion
   - Visual goal tracking
   - Persistent customization saves

This feature enhances user engagement by:
- Creating clear progression goals
- Providing immediate visual rewards
- Making task completion more engaging
- Personalizing the user experience
- Maintaining the Y2K aesthetic theme