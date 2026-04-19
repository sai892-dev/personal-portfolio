# 🚀 Personal Portfolio Website

A full-stack personal portfolio website built with a premium dark-mode design, glassmorphism effects, animated particle background, and complete CRUD API.

## ✨ Features

- **Animated particle canvas background** with connected dots
- **Glassmorphism UI** — frosted glass cards with gradient borders
- **Scroll reveal animations** — elements fade in as you scroll
- **Animated counters & progress bars**
- **Project filter + search** — filter by category, search by keyword
- **Project detail modal** — click cards for full project info
- **Contact form** with validation & API submission
- **Responsive design** — mobile hamburger menu, touch-friendly
- **Full REST API** — CRUD operations for projects & contact messages

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js + Express.js |
| Database | JSON file storage (swappable for MongoDB) |
| Design | Custom CSS, glassmorphism, gradient animations |

## 📁 Project Structure

```
portfolio/
├── backend/
│   ├── server.js              # Express server
│   ├── package.json
│   ├── routes/
│   │   ├── projects.js        # CRUD API for projects
│   │   └── contact.js         # Contact form API
│   └── data/
│       ├── projects.json      # Project data
│       └── messages.json      # Contact submissions
├── frontend/
│   ├── index.html             # Hero / Landing page
│   ├── projects.html          # Project gallery
│   ├── about.html             # About me
│   ├── contact.html           # Contact form
│   ├── css/style.css          # Design system (800+ lines)
│   └── js/
│       ├── main.js            # Nav, particles, animations
│       ├── projects.js        # Fetch, filter, search, modal
│       └── contact.js         # Form validation & submission
└── README.md
```

## 🚀 Quick Start

```bash
cd backend
npm install
node server.js
```

Open https://personal-portfolio-pwb2.onrender.com in your browser.

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects |
| GET | `/api/projects/:id` | Get single project |
| POST | `/api/projects` | Add new project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/contact` | List all messages |
| GET | `/api/health` | Health check |

## 🎨 Customization

1. **Your name/bio** → Edit `frontend/index.html` and `frontend/about.html`
2. **Your projects** → Edit `backend/data/projects.json` or use the POST API
3. **Your skills** → Edit `frontend/about.html` (progress bars section)
4. **Contact info** → Edit `frontend/contact.html`
5. **Colors** → Edit CSS variables at the top of `frontend/css/style.css`

## 📄 License

MIT License — feel free to use and customize!
