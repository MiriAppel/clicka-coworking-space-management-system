# Clicka Co-working Space Management System
React TypeScript & Node.js full-stack co-working management platform for live client. Features CRM, automated billing, workspace allocation, Google API integrations. Production deployment on Cloudflare and Render.

## 🚀 Project Overview

A comprehensive digital solution for managing all aspects of women's co-working spaces. The system replaces manual, file-based processes with a streamlined platform that handles lead tracking, customer management, workspace allocation, meeting room bookings, billing, and comprehensive reporting.

## 🛠️ Tech Stack

- **Frontend:** React with TypeScript, Material-UI
- **Backend:** Node.js with Express, TypeScript
- **Database:** PostgreSQL via Supabase
- **Authentication:** Google OAuth
- **Integrations:** Google Calendar, Google Drive, Gmail APIs
- **Deployment:** Cloudflare (Frontend), Render (Backend)

## ✨ Key Features

### 🎯 Lead & Customer Management
- Lead tracking and conversion pipeline
- Customer profiles and contract management
- Interaction history and communication logs
- File upload and document management

### 🏢 Workspace Management
- Interactive workspace mapping
- Real-time occupancy tracking
- Meeting room booking system
- Space assignment and inventory management

### 💰 Billing & Financial Management
- Automated invoice generation
- Prorated pricing calculations
- Payment tracking and collection
- Comprehensive financial reporting
- Expense management system

### 🔧 Core Features
- Google OAuth authentication
- Role-based access control
- Email template management
- Document template system
- Audit logging

## 🏗️ Architecture

```
├── packages/
│ ├── backend/           # Node.js API server
│ ├── frontend/          # React application
│ └── shared-types/      # TypeScript type definitions
```

**Monorepo Structure:**
- **4 specialized development teams**
- **Shared TypeScript types** for consistency
- **Modular architecture** with clear separation of concerns

## 👥 Team Structure

The project was developed using **Agile methodology** by **4 specialized teams:**

1. **Core & Integration Team** - Authentication, Google integration, shared components
2. **Lead & Customer Team** - CRM functionality, customer management
3. **Workspace Team** - Space management, booking system, occupancy tracking
4. **Billing Team** - Financial management, invoicing, payment processing

*Note: Live demo unavailable due to client confidentiality*

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- Yarn
- Supabase account
- Google Cloud Console project

### Installation

1. **Clone the repository**
```
git clone https://github.com/MiriAppel/clicka-coworking-space-management-system.git
cd clicka-coworking-space-management-system
```

2. **Install dependencies**
```
yarn install
```

3. **Set up environment variables**
```
cp packages/backend/.env.example packages/backend/.env
cp packages/frontend/.env.example packages/frontend/.env
```

4. **Start development servers**
```
yarn workspace clicka-backend dev
yarn workspace clicka-frontend start
```

## 🔧 Environment Variables

Configure the following environment variables with your actual values:

### Backend (.env)
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

## 📦 Available Scripts
```
# Development
yarn start:backend          # Start backend server
yarn start:frontend         # Start frontend server

# Build
yarn build                  # Build all packages

# Type checking
yarn workspace shared-types build
```

## 🌟 Highlights

- **Enterprise-grade architecture** with proper separation of concerns
- **Comprehensive testing** with Jest and React Testing Library
- **Professional documentation** with detailed API specs
- **Production deployment** on cloud platforms
- **Team collaboration** with 4 specialized development teams

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Audit logging for all user actions
- Input validation and sanitization

## 📈 Business Impact

This system transformed manual, file-based processes into a streamlined digital platform, enabling:
- **Automated invoice generation**
- **Real-time workspace management**
- **Comprehensive business tracking**
- **Enhanced customer experience**

## 🤝 Contributing

This project was developed as part of a professional development program with multiple team members contributing to different aspects of the system.

---

**Built with ❤️ by a professional development team**
