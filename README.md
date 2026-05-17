# GigFlow / Smart Leads

![Smart Leads Dashboard](https://lh3.googleusercontent.com/aida-public/AB6AXuAzpv3CAHKyRqV1eyByMcqFvRCumAHyPPgebmFpSqlbL9wgBdLXTJI-HM4ftfEAKWmUFhUcDaOeH_9isrBumMpYLeT-2wN29_jwkfVdyRFkLFYAjFv-XW7IITh6birQWO0r0CmiG1vaa5Jjf69cqLs5CzOJMYSfcRUaPSboMjx30eXkGXQtXIEBXsAh0MW-qfEkvyl_5awCsPN9q3KJbZlsKA8D6Qd62XTlG---HchbyC_f_0M0rEqWSPyZCX4yjlS42gHSTZCBPI8)

Welcome to **GigFlow** (also known as the **Smart Leads** platform), a high-end, production-ready Full-Stack Lead Management System. It is designed with a premium, responsive glassmorphic UI and backed by a robust, secure Node.js architecture.

## 🚀 Key Features

- **Advanced Authentication**: Secure JWT-based authentication featuring Access & Refresh Token rotation. Includes session persistence via Local/Session Storage ("Remember Me" functionality).
- **Role-Based Access Control (RBAC)**: Differentiated experiences for `Admin` and `Sales User` roles.
- **Lead Management**: Full CRUD operations for managing client pipelines, assigning statuses, tracking lead sources, and writing sales notes.
- **Dynamic Filtering & Search**: Client-side debounced search and multi-parameter filtering for instant data retrieval.
- **Premium Aesthetics**: Built with Tailwind CSS utilizing a modern glassmorphic design system, smooth micro-animations, and full Dark Mode support.
- **Mobile-Optimized**: A flawlessly responsive design featuring mobile bottom-navigation, sliding modal panels, and perfectly optimized touch targets.
- **Serverless Ready**: Fully configured monorepo setup for seamless deployment to Vercel (React frontend + Express Serverless Functions).

## 🛠 Tech Stack

### Frontend
- **React.js** (Bootstrapped with Vite)
- **TypeScript** for type-safe components
- **Tailwind CSS** for utility-first styling
- **React Router v6** for client-side routing
- **Axios** for API requests & Interceptors

### Backend
- **Node.js & Express** for the RESTful API
- **TypeScript** for backend typing
- **MongoDB & Mongoose** for the NoSQL database schema
- **JSON Web Tokens (JWT)** for stateless authentication
- **Bcrypt.js** for secure password hashing

---

## 💻 Running Locally

### Prerequisites
- Node.js (v18+)
- MongoDB database (Local or Atlas Cluster)

### 1. Clone the repository
```bash
git clone https://github.com/MandeepSangwan/GigFlow.git
cd GigFlow
```

### 2. Setup Environment Variables
**Backend (`backend/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb+srv://<your_username>:<your_password>@cluster.mongodb.net/gigflow
JWT_SECRET=your_super_secret_jwt_key
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Run the Application
You will need two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## ☁️ Deployment

This project is configured as a Monorepo for zero-config deployment on **Vercel**. 

1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Configure the following Environment Variables in Vercel:
   - `MONGODB_URI`
   - `JWT_SECRET`
4. Deploy! The `vercel.json` file will automatically route frontend requests to the static React build and `/api/*` requests to the Express serverless functions.

---

## 📝 License

This project is licensed under the MIT License. Feel free to use it for personal or commercial projects.
