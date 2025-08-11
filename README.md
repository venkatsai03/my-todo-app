# My Todo App

This is a React Todo application integrated with Supabase for authentication and data storage. It features user signup/login with magic link, todo CRUD operations with filtering and sorting, and remembers user sessions.

## Live Demo
[https://my-todo-app-xwm2.vercel.app/](https://my-todo-app-xwm2.vercel.app/)

## Features
- User signup/login using Supabase magic link authentication
- Add, edit, delete todos
- Filter todos by category, status (pending/completed), and search query
- Sort todos by due date or priority
- Responsive and visually appealing UI with gradients and modern styles
- Persistent login session

## Setup and Run Locally

1. Clone the repository:
```bash
git clone <https://github.com/venkatsai03/my-todo-app.git>
cd my-todo-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root with your Supabase keys:
```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Deployment

You can deploy this app on Vercel or any static hosting provider supporting environment variables.

For Vercel:

- Connect your GitHub repo
- Add environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Vercel dashboard
- Deploy

## Important Notes

- Make sure to whitelist your deployed domain in Supabase authentication settings for magic links
- The app uses port 5173 by default when running locally with Vite

## Contact

For issues or questions, contact: menthanavenkatsai@gmail.com
