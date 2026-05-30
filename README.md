# 🚀 Task Manager — Modern Task Management Application

A full-stack task management web application built with React, Node.js, Express, MongoDB, and Socket.io. Features a beautiful UI with Kanban board, real-time updates, authentication, and dark mode.

![Task Manager](https://img.shields.io/badge/Task Manager-Task%20Management-6366f1?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)

## ✨ Features

### 🔐 Authentication
- User registration & login with JWT
- Password hashing with bcrypt
- Protected routes & API endpoints
- Session persistence after refresh

### 📋 Task Management
- **CRUD Operations** — Create, Read, Update, Delete tasks
- **Kanban Board** — Drag-and-drop between Pending, In Progress, Completed
- **Smart Filters** — Filter by status, priority, search, and sort
- **Pagination** — Efficient task browsing
- **Quick Status Change** — Click to cycle through statuses

### 📊 Dashboard
- Task statistics with animated counters
- Completion progress bar
- Priority distribution donut chart
- Recent tasks list
- Status breakdown visualization

### 🎨 UI/UX
- Modern glassmorphism design
- Dark mode with system preference detection
- Responsive for desktop, tablet, and mobile
- Smooth animations and transitions
- Toast notifications
- Loading spinners and skeleton states
- Empty state illustrations
- Confirmation dialogs for destructive actions

### ⚡ Real-Time (Socket.io)
- Live task updates
- Connection status indicator
- Instant status changes

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS v4 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Real-time | Socket.io |
| UI | Lucide React, react-hot-toast |
| DnD | @hello-pangea/dnd |

## 📁 Project Structure

```
taskmanager/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # Button, Input, Modal, Spinner, etc.
│   │   │   ├── layout/      # Sidebar, Navbar, AppLayout
│   │   │   ├── tasks/       # TaskCard, TaskForm, KanbanBoard
│   │   │   └── dashboard/   # StatsCard
│   │   ├── pages/           # Login, Register, Dashboard, Tasks, Kanban, Profile
│   │   ├── context/         # AuthContext, ThemeContext
│   │   ├── hooks/           # useTasks, useSocket
│   │   ├── services/        # API, Auth, Task services
│   │   └── utils/           # Constants, Helpers
│   └── ...
├── server/                  # Express Backend
│   ├── config/              # Database connection
│   ├── controllers/         # Auth, Task controllers
│   ├── middleware/           # Auth, Error, Validation
│   ├── models/              # User, Task schemas
│   ├── routes/              # Auth, Task routes
│   ├── socket/              # Socket.io setup
│   └── server.js            # Entry point
└── package.json             # Root scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/sai892-dev/taskmanager.git
cd taskmanager
```

### 2. Install dependencies
```bash
npm run install-all
```

### 3. Configure environment variables

**Server** — Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskmanager
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

**Client** — Create `client/.env`:
```env
VITE_API_URL=/api
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Run in development
```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 5173) concurrently.

### 5. Open in browser
Visit [http://localhost:5173](http://localhost:5173)

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile (protected) |
| PUT | `/api/auth/profile` | Update profile (protected) |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (filtered, paginated) |
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks/:id` | Get a single task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/tasks/stats` | Get task statistics |
| PUT | `/api/tasks/reorder` | Reorder tasks (Kanban) |

## 🚢 Deployment

### Frontend (Vercel/Netlify)
1. Set build command: `cd client && npm run build`
2. Set output directory: `client/dist`
3. Add environment variables

### Backend (Render/Railway)
1. Set build command: `cd server && npm install`
2. Set start command: `cd server && npm start`
3. Add environment variables (MONGO_URI, JWT_SECRET, CLIENT_URL)

### MongoDB
Use [MongoDB Atlas](https://www.mongodb.com/atlas) for cloud database hosting.

## 📄 License

MIT License — feel free to use this for learning and personal projects!

---

Built with ❤️ by [sai892-dev](https://github.com/sai892-dev)
