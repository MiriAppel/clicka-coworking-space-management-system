# Clicka Co-working Space Management System
A comprehensive platform for managing all aspects of the Clicka women's co-working space in Bnei Brak, from workspace management to customer relationships and billing.

## Project Overview
This project provides an integrated digital solution for Clicka to manage their co-working space. The system replaces manual, file-based processes with a streamlined platform that handles lead tracking, customer management, workspace allocation, meeting room bookings, billing, and comprehensive reporting.

## Key Components
- **Backend API:** Node TypeScript service deployed on Render
- **Frontend Application:** React TypeScript application deployed on Vercel
- **Database:** Supabase PostgreSQL
- **Integrations:** Google Auth, Google Calendar, Google Drive, Gmail

## Team Structure
The project is divided into four specialized teams:

1. **Core & Integration Team:** Authentication, Google integration, shared components, and deployment
2. **Lead & Customer Team:** Lead management, customer profiles, contract management, and history tracking
3. **Workspace Team:** Workspace inventory, interactive map, meeting room booking, and occupancy tracking
4. **Billing Team:** Pricing configuration, invoice generation, payment tracking, and financial reporting

## Documentation
### Project Documentation

- [High-Level Design Document](https://docs.google.com/document/d/1svaiktE0Rf3LF9yKHL_gPI6uXSc49hKQ7gu3AlgMA9A/edit) - Contains user roles, system components, project timeline, and wireframes

### Team-Specific PRDs

- [Core & Integration Team PRD](https://docs.google.com/document/d/clicka-core-prd) - Detailed requirements for the Core & Integration team
- [Lead & Customer Team PRD](https://docs.google.com/document/d/clicka-customer-prd) - Detailed requirements for the Lead & Customer team
- [Workspace Team PRD](https://docs.google.com/document/d/clicka-workspace-prd) - Detailed requirements for the Workspace team
- [Billing Team PRD](https://docs.google.com/document/d/clicka-billing-prd) - Detailed requirements for the Billing team

### API Documentation
The API documentation is generated from the TypeScript definitions. You can view it [here:](types)

### Project Structure
```
├── packages/
│   ├── backend/           # Backend API
│   ├── frontend/          # Frontend application
├── types/                 # Shared types
└── README.md
```

## Development Setup
### Prerequisites

- Node.js
- yarn
- Supabase CLI
- Git

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/diversi-tech/clicka
cd clicka
```

2. Install dependencies:
```
yarn install
```

3. Set up environment variables:
```
cp packages/backend/.env.example packages/backend/.env
cp packages/frontend/.env.example packages/frontend/.env
```
Update the variables with your local configuration.

4. Start the development server:
```
# In one terminal:
yarn start:backend

# In another terminal:
yarn start:frontend
```

### Backend (Render)
The API is hosted on Render. To deploy:

1. Connect your Render account to the GitHub repository
2. Configure the build command: `yarn workspace clicka-backend build`
3. Configure the start command: `yarn workspace clicka-backend start`
4. Set the required environment variables in the Render dashboard

### Frontend (Vercel)
The frontend application is hosted on Vercel. To deploy:

1. Connect your Vercel account to the GitHub repository
2. Configure the build command: `yarn workspace clicka-frontend build`
3. Set the required environment variables in the Vercel dashboard
4. Deploy to production

### Database (Supabase)
The database is hosted on Supabase. To set up:

1. Create a new project in Supabase
2. Run the migration scripts: `yarn run migrate`
3. Update your environment variables with the Supabase connection details

## Contributing

1. Create a new branch for your feature: `git checkout -b feature/your-feature-name`
2. Commit your changes: `git commit -m "Add feature description"`
3. Push to the branch: `git push origin feature/your-feature-name`
4. Submit a pull request

### Development Guidelines

- Follow the API contract defined in the shared types
- Use the mock data during initial development
- Notify other teams of any breaking changes to APIs
- Write unit tests for critical functionality
- Use the shared UI component library for consistent styling
- Implement proper RTL (Right-to-Left) support for Hebrew

## License
This project is private and proprietary. Unauthorized copying, distribution, or use is strictly prohibited.