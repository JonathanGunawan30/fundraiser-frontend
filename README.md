# FundRaiser Frontend

This repository houses the frontend client application for FundRaiser, a modern, secure crowdfunding and charity donation platform. The application is built using React, TypeScript, and Vite, leveraging Ant Design for user interfaces.

## Core Features

- **Campaign Exploration**: Browse, search, and filter ongoing fundraising campaigns with intuitive UI grids.
- **Detailed Campaign Profiles**: Comprehensive views including progress trackers, target metrics, lists of contributors, and campaign storytelling timelines.
- **Structured Share System**: Share campaigns directly to WhatsApp, Facebook, Twitter / X, or quickly copy the shortlink using the premium Share Modal, with native system share fallback support.
- **Secure Authentication & OTP Verification**: Integrated segmented 6-digit OTP code verification card layouts for authentication.
- **Donor Interface**: Interactive contribution flow with dynamic validation and payment gateway integration.
- **Admin Settings and Controls**: Dedicated configuration modules to manage maintenance mode, edit site-wide details, and update profile metrics.
- **Maintenance Bypass Rules**: Routing guards ensure that while regular routes are inaccessible during scheduled maintenance, admin control panels under /admin remain open.
- **Static Pages and Legal Modules**: In-app Terms of Service, Privacy Policies, and a Help Center module supporting instant contact via email or WhatsApp support channels.

## Technology Stack

The project utilizes the following core technologies:

- **Framework**: React 19 (TypeScript)
- **Build Tool**: Vite 8
- **UI Component Library**: Ant Design 6
- **Routing**: React Router DOM 7
- **State Management & Caching**: TanStack Query (React Query) v5
- **HTTP Client**: Axios 1.16
- **Form Management**: React Hook Form with Zod schema validation
- **Charts**: Ant Design Charts 2
- **Animations & Interactivity**: Lottie-React, CountUp.js

## Project Directory Structure

```text
src/
├── api/             # Axios instance config and interceptors
├── components/      # Reusable UI components (Modals, guards, widgets)
├── layouts/         # Layout systems (MainLayout, AdminLayout)
├── lib/             # Context Providers (AuthContext, Theme config)
├── pages/           # Application views (CampaignDetailPage, LoginPage, profile, etc.)
│   └── admin/       # Dedicated views for administration panels
├── types/           # Zod schemas and TypeScript type declarations
├── App.tsx          # Router configuration and application shell
├── index.css        # Core stylesheet and layout modifications
└── main.tsx         # Application entry point
```

## Getting Started

### Prerequisites

Ensure you have Node.js installed on your machine.
- Node.js: v18.x or v20.x
- Package Manager: npm (v9.x or higher)

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd fundraiser-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the root directory and configure the environment variables as follows:

```env
VITE_API_URL=http://localhost:8000/api
```

Replace `http://localhost:8000/api` with the URL of your running backend api server.

### Running Development Server

Start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

### Production Build

Generate the production bundle:

```bash
npm run build
```

The compiled assets will be built into the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```
