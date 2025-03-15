# College Fest Admin Panel

A Next.js 14 admin panel for managing college fest events and team registrations.

## Features

- **Authentication**: Secure login with NextAuth.js (Google, GitHub, or credentials)
- **Dashboard**: Overview of events and registrations
- **Events Management**: View all events with their details
- **Teams Management**: View, search, and filter team registrations
- **Responsive Design**: Works on all devices with Material UI and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Material UI
- **Backend**: Next.js API routes
- **Database**: MongoDB Atlas with Mongoose
- **Authentication**: NextAuth.js
- **Styling**: Material UI with dark theme, Tailwind CSS for responsiveness

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- MongoDB Atlas account
- (Optional) GitHub and Google OAuth credentials for authentication

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd admin-panel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your MongoDB connection string and other required variables

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file with the following variables:

```
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# GitHub OAuth (optional)
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Admin Access
ADMIN_EMAILS=admin1@example.com,admin2@example.com

# For development/testing with credentials provider
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=securepassword
```

## Database Schema

The application uses two main collections:

1. **Events Collection**:
   - `title`: Event name
   - `description`: Event details
   - `date`: Event date
   - `venue`: Event location
   - `maxTeamSize`: Maximum team size
   - `minTeamSize`: Minimum team size
   - `registrationDeadline`: Last date for registration

2. **Teams Collection**:
   - `name`: Team name
   - `event`: Reference to event ID
   - `leader`: Team leader details (name, email, phone)
   - `members`: Array of team members (name, email, phone)
   - `registrationDate`: Date of registration

## Deployment

This project is ready to be deployed to Vercel:

1. Push your code to a GitHub repository
2. Import the project to Vercel
3. Set up the environment variables in the Vercel dashboard
4. Deploy!

## License

This project is licensed under the MIT License.
