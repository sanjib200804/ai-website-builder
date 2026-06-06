# WebGenie AI 🧞‍♂️

WebGenie AI is a production-ready, AI-powered website builder designed to transform text prompts into fully functional, aesthetically pleasing landing pages. By leveraging advanced AI integrations and a custom drag-and-drop style editor, it empowers users to launch web presence in seconds.

## 🚀 Features

- **AI-Driven Generation**: Seamlessly generate website layouts and content based on user descriptions.
- **Real-time Editor**: A dedicated editing suite (`/editor/:id`) for fine-tuning AI-generated components.
- **Secure Authentication**: Integrated authentication system with protected routes to safeguard user dashboards and projects.
- **Responsive Dashboard**: Centralized management for all generated websites and user settings.
- **Modern UI/UX**: Built with Tailwind CSS for high-performance, utility-first styling and a mobile-responsive experience.
- **State Management**: Robust application state handling using Redux to manage user sessions and project data.
- **Toaster Notifications**: Real-time feedback for user actions via `react-hot-toast`.

## 🛠 Tech Stack

### Frontend

- **React 18**: Component-based UI library.
- **Vite**: Ultra-fast build tool and development server.
- **Redux Toolkit**: Centralized state management for user data and UI state.
- **Tailwind CSS**: Modern styling using the `@tailwindcss/vite` plugin.
- **React Router**: Declarative routing with protected navigation logic.

### Backend

- **Node.js**: Scalable server-side environment.
- **Express**: Minimalist web framework for API construction.
- **Authentication**: Firebase/OAuth compatible (configured with `Cross-Origin-Opener-Policy` for secure popups).

### Database & AI

- **Database**: MongoDB (Inferred from backend structure).
- **AI Integration**: Gemini / OpenAI API for generating semantic HTML and copy.

## 📁 Project Structure

```text
AI_WEBSITE_BUILDER/
├── frontend/                # Vite + React Application
│   ├── src/
│   │   ├── hooks/           # Custom hooks (e.g., useGetCurrentUser)
│   │   ├── pages/           # Home, DashBoard, Generate, Editor
│   │   ├── store/           # Redux logic (slices and store)
│   │   └── App.jsx          # Protected routing and core logic
│   ├── vite.config.js       # Vite + Tailwind configuration
│   └── index.html           # SEO meta tags and entry point
├── backend/                 # Node.js Express Server
│   ├── models/              # Database schemas
│   ├── routes/              # API endpoints
│   └── index.js             # Server entry point
└── README.md
```

## ⚙️ Installation

### Prerequisites

- Node.js (LTS version)
- npm or yarn

### 1. Clone Repository

```bash
git clone <repo-url>
cd AI_WEBSITE_BUILDER
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup

```bash
cd ../backend
npm install
# Configure your .env file with DB_URL and AI_API_KEY
npm start
```

## 🔒 Security Features

- **COOP Headers**: Configured in `vite.config.js` to ensure secure authentication flows for cross-origin popups.
- **Protected Routes**: Custom routing logic in `App.jsx` prevents unauthorized access to the `/generate` and `/dashboard` routes, redirecting unauthenticated users to the Home page.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

_Built with ❤️ by the WebGenie Team._

---

### 🛡 Note on Development

The project uses the latest Tailwind CSS Vite plugin. Ensure your development environment supports PostCSS 8+ for optimal performance.

For issues or feature requests, please open an issue in the repository.
