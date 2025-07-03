# Minibunn Planner (Web)

Minibunn Planner is a web-based application designed to help users organize their tasks, notes, journals, and calendars efficiently. This repository is public to allow anyone interested to review the codebase and understand the project's structure and implementation. It is not intended for forks or external contributions.

## Features

- **Task Management**: Create, edit, and manage tasks.
- **Notes**: Rich text editor for creating and organizing notes.
- **Journals**: Maintain daily journals.
- **Calendar**: View and manage events by date.
- **User Management**: Manage user accounts, subscriptions, and support.

## Tech Stack

Minibunn Planner is built using the following technologies:

- **Language**: TypeScript
- **Frontend Framework**: Next.js (built on React)
- **Styling**: SCSS
- **State Management**: Zustand, React Query, and Context API
- **Authentication**: Firebase Authentication
- **Hosting**: Vercel
- **Rich Text Editor**: Tiptap
- **Drag-and-Drop**: Dnd-kit
- **Icons**: Lucide-react
- **Animations**: Motion
- **Toast Notifications**: React-toastify
- **Syntax Checking**: ESLint

## Project Structure

The project is organized as follows:

```plaintext
src/
  api/                # API handlers for tasks, notes, journals, etc.
  app/                # Next.js pages and layouts
  components/         # Reusable UI components
  context/            # React context providers
  hooks/              # Custom React hooks
  lib/                # Utility libraries
  styles/             # SCSS stylesheets
  types/              # TypeScript type definitions
  utils/              # Utility functions
```

## Pages

### Auth Pages

- **Register**: `/auth/register`

- **Forgot Password**: `/auth/forgot-password`

- **Reset Password**: `/auth/reset`

- **Subscribe**: `/auth/subscribe`

- **Resubscribe**: `/auth/resubscribe`

### Main Pages

- **Home**: `/`

- **Calendar**: `/calendar` and `/calendar/[date]`

- **Notes**: `/notes`

- **User Profile**: `/user`

## Components

### Auth Components

- `GoogleSignInButton`: Button for Google authentication.

- `SignInForm`: Form for user sign-in.

- `ResetForm`: Form for password reset.

### Calendar Components

- `Calendar`: Main calendar view.

### Elements

- `Error`: Error message display.

- `IconButton`: Button with an icon.

- `Loading`: Loading spinner.

- `RichTextEditor`: Rich text editor for notes.

### Journal Components

- `Journal`: Journal entry display.

### Layout Components

- `Content`: Main content area.

- `Header`: Header bar.

- `SideBar`: Sidebar navigation.

### Note Components

- `Notes`: Notes list.

- `NoteItem`: Individual note item.

- `NotesHeader`: Header for notes page.

### Task Components

- `Tasks`: Task list.

- `TaskItem`: Individual task item.

- `TaskHeader`: Header for tasks page.

### User Components

- `Account`: User account details.

- `Personal`: Personal information.

- `Subscription`: Subscription management.

- `Support`: Support page.

## Local Run

To run the project locally:

```bash
npm install
npm run dev

# Test on Mobile
ngrok http 3000
```

## Environment Variables

The following environment variables are required:

```txt
NEXT_PUBLIC_WEB_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ENVIRONMENT=dev

# Subscription
NEXT_PUBLIC_MONTHLY_SUBSCRIPTION_PRICE_ID=price_xxx
NEXT_PUBLIC_YEARLY_SUBSCRIPTION_PRICE_ID=price_xxx
NEXT_PUBLIC_LIFETIME_PRICE_ID=price_xxx
NEXT_PUBLIC_CUSTOMER_PORTAL_LINK=https://xxx

# Firebase config
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=minibunn-planner.xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=minibunn-planner
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=minibunn-planner.xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=0000
NEXT_PUBLIC_FIREBASE_APP_ID=0:000
```

## Deploy to Firebase

To deploy the project to Firebase:

```bash
firebase deploy --only hosting
```

## Release Instructions

1. Create an annotated tag:

   ```bash
   git tag -a v1.0.0 -m "comment"
   git push origin v1.0.0
   ```

2. Draft a GitHub Release:
   - Go to Releases → Draft a new release.
   - Select your new tag.
   - Fill in a “What’s changed” summary or changelog items.
   - Publish.

## Screenshots

Take the following screenshots for documentation:

1. **Home Page**: Overview of the planner.

2. **Calendar Page**: Calendar view with events.

3. **Notes Page**: Notes list and editor.

4. **Tasks Page**: Task list and details.

5. **User Profile Page**: User account and subscription details.

6. **Auth Pages**: Register, login, and password reset.

## Contributing

This repository is public for anyone interested to review the codebase. It is not intended for forks or external contributions. If you have any questions or feedback, please contact the repository owner directly.

## Contact

If you have any advice, comments, or questions about Minibunn Planner, feel free to reach out:

- **Email**: <contact@minibunnplanner.com>
- **LinkedIn**: <https://www.linkedin.com/company/minibunn-planner>
- **X**: <https://x.com/minibunnplanner>

## License

This project is licensed under a Proprietary License.

### Terms

- The code in this repository is provided for viewing purposes only.

- Copying, modifying, redistributing, or using the code in any form is strictly prohibited.

- For inquiries or permissions, please contact the repository owner directly.

## Backend Repository

Minibunn Planner also has a backend repository that handles server-side logic and APIs. You can find it here:

- [Minibunn Planner Backend](https://github.com/yangjialin94/minibunn-planner-api)
