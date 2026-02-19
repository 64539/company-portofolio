# Synthesize Axonova - Deployment Guide

This guide details the deployment process for the Synthesize Axonova high-end portfolio site, including environment configuration, build steps, and maintenance procedures.

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- An Upstash Redis database
- A Resend account for email services

### Installation
```bash
npm install
```

### Local Development
```bash
npm run dev
```
The application will start on `http://localhost:3000`.

## 🔐 Environment Variables

Create a `.env` file in the root directory. The application includes a runtime validation script (`src/lib/env.ts`) that will log warnings if any critical variables are missing.

| Variable | Description | Required |
|----------|-------------|----------|
| `UPSTASH_REDIS_REST_URL` | The REST URL for your Upstash Redis instance | Yes |
| `UPSTASH_REDIS_REST_TOKEN` | The REST Token for your Upstash Redis instance | Yes |
| `RESEND_API_KEY` | API Key from Resend for sending emails | Yes |
| `ADMIN_PASSWORD` | The password for accessing the Admin Gate (7-click trigger) | Yes |

> **Security Note:** Never commit your `.env` file to version control.

## 🛠️ Build & Production

To create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## ☁️ Deployment (Vercel)

This project is optimized for deployment on Vercel.

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  Add the **Environment Variables** listed above in the Vercel Project Settings.
4.  Deploy.

## 🛡️ "Zero Error" Features Implemented

-   **Runtime Environment Audit**: Automatically checks for missing env vars at startup.
-   **Robust Admin Panel**:
    -   **Split-Pane Layout**: Desktop-optimized viewing experience.
    -   **Input Validation**: Client-side and server-side checks for replies.
    -   **Auto-Save Drafts**: Prevents data loss during reply composition.
    -   **Skeleton Loaders**: Smooth loading states for better UX.
-   **Mobile Optimization**: All interactive elements meet WCAG 2.1 touch target standards (min 44x44px).
-   **Integrated Reply System**:
    -   **Double Resend**: Parallel execution of Admin Notification and User Auto-Reply.
    -   **Redis History**: Full conversation history stored in Upstash.
    -   **WhatsApp Integration**: Direct click-to-chat from the Admin Panel.

## 🧪 Testing

Run the build command to verify type safety and compilation:

```bash
npm run build
```

## 📝 Maintenance

-   **Logs**: Check Vercel Function Logs for server-side errors.
-   **Redis**: Monitor your Upstash usage to ensure you stay within limits.
-   **Resend**: Monitor email delivery rates and bounce rates in the Resend Dashboard.
