# 🚗 RideAlong

> **A modern vehicle document management platform that helps vehicle owners securely store documents, monitor expiry dates, and receive timely reminders to stay road compliant.**

<p align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)
![License](https://img.shields.io/badge/license-MIT-green)

</p>

---

## 🌍 Live Demo

**Application**

https://ride-along-nu.vercel.app/

---

# 📖 Overview

RideAlong is a modern web application designed to simplify vehicle document management for everyday drivers.

Instead of relying on physical folders or manually remembering renewal dates, users can securely manage their vehicle information, monitor document validity, and receive reminders before important documents expire.

The platform aims to reduce missed renewals, prevent unnecessary fines, and make compliance easier through a clean, intuitive dashboard.

Although RideAlong was designed primarily for desktop users, the interface was carefully adapted through responsive design techniques to ensure a smooth experience across tablets and mobile devices.

---

# 🚨 Problem

Many vehicle owners struggle to keep track of important documents such as:

- Driver's Licence
- Vehicle Insurance
- Roadworthiness Certificate
- Vehicle Registration

These documents often expire without notice, leading to:

- Police penalties
- Financial fines
- Delayed travel
- Poor document organization
- Stress during inspections

---

# 💡 Solution

RideAlong centralizes vehicle information into one platform where users can:

- Register multiple vehicles
- Store document information
- Track expiry dates automatically
- Receive reminder notifications
- Monitor compliance from one dashboard

---

# ✨ Features

## Authentication

- User Registration
- User Login
- Secure Authentication with Firebase

---

## Dashboard

A centralized dashboard displaying:

- Total Vehicles
- Valid Documents
- Expiring Documents
- Expired Documents
- Quick Actions
- Upcoming Reminders
- Notification Indicator

---

## Vehicle Management

Users can:

- Add vehicles
- Delete vehicles
- View vehicle information
- Track document compliance
- View vehicle-specific documents

Vehicle status is automatically calculated as:

- Fully Compliant
- Expiring Soon
- Expired
- No Documents

---

## Document Management

Users can:

- Upload document information
- View document status
- Track validity
- Automatically classify documents based on expiry date

Document status updates dynamically using calculated expiry dates.

---

## Reminder Management

RideAlong automatically organizes reminders into:

- Upcoming
- Overdue
- All Reminders

Users can:

- Search reminders
- Delete reminders
- Track reminder dates
- Monitor expiry countdowns

---

## Notification System

The application includes configurable notification preferences.

Users can enable or disable:

- Desktop Notifications
- Email Notifications
- In-App Notifications

Unread notification indicators are automatically displayed throughout the application.

---

## Dark Mode

RideAlong supports both:

- ☀️ Light Mode
- 🌙 Dark Mode

Theme preferences are persisted locally to provide a consistent user experience across sessions.

---

## Multi-language Support

RideAlong includes localization support allowing users to switch between:

- 🇬🇧 English
- 🇫🇷 French
- 🇪🇸 Spanish

This improves accessibility for international users and non-English speakers.

---

## Responsive Design

The application was designed for desktop use and later adapted through responsive design techniques to provide a smooth experience on:

- Desktop
- Laptop
- Tablet
- Mobile devices

Layouts, navigation, cards, and content dynamically adjust to different screen sizes.

---

# 🛠 Technology Stack

## Frontend

- React
- TypeScript
- Vite
- React Router
- CSS Modules / Custom CSS

---

## Backend & Database

Firebase

Used for:

- Authentication
- User Management
- Cloud Database
- Future scalability

---

## Deployment

Vercel

The application is deployed using Vercel with continuous deployment from GitHub.

---

# 🏗 Architecture

RideAlong follows a modular architecture built around reusable components and custom React hooks.

```
src
│
├── components
│ ├── dashboards
│ ├── vehicles
│ ├── reminders
│ ├── shared
│
├── pages
│ ├── onboarding
│ ├── dashboard
│ ├── vehicles
│ ├── documents
│ ├── reminders
│ ├── settings
│
├── hooks
│ ├── useVehicles
│ ├── useDocuments
│ ├── useReminders
│
├── context
│
├── assets
│
└── styles
```

---

# ⚙ Core Implementation

### useVehicles()

Responsible for:

- Vehicle creation
- Vehicle deletion
- Vehicle updates
- Local persistence
- Compliance calculation
- Dashboard prioritization

Vehicle compliance is automatically calculated from expiry dates.

---

### useDocuments()

Responsible for:

- Document validation
- Expiry calculations
- Status categorization
- Dashboard statistics

Document status updates dynamically as time progresses.

---

### useReminders()

Responsible for:

- Reminder generation
- Expiry calculations
- Search
- Filtering
- Reminder categorization
- Dashboard reminder prioritization

---

### Settings Context

Manages global application preferences including:

- Theme
- Language
- Notification preferences

---

# 🎨 User Experience Highlights

RideAlong was designed with usability in mind.

Features include:

- Empty States
- Progressive onboarding
- Quick Actions
- Search functionality
- Notification badges
- Visual compliance indicators
- Responsive layouts
- Accessible navigation

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/ebiseni/RideAlong.git
```

Navigate into the project

```bash
cd RideAlong
```

Install dependencies

```bash
npm install
```

Start development server

```bash
npm run dev
```

---

# 🔥 Firebase Configuration

Create a `.env` file in the project root.

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY

VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN

VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID

VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET

VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID

VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

---

# 🌍 Deployment

RideAlong is deployed on **Vercel**.

Deployment includes:

- Continuous deployment from GitHub
- Automatic production builds
- HTTPS
- Fast global CDN
- Optimized static hosting

---

# 📈 Future Improvements

- Push Notifications
- OCR Document Scanning
- Automatic Renewal Reminders
- Cloud File Uploads
- Government Verification APIs
- Email Reminder Scheduling
- Multi-user Vehicle Sharing
- Admin Dashboard
- Analytics
- Mobile Application

---

# 👨‍💻 Contributors

### Frontend

- **Ebiseni Adetokunbo**
- **Henry Chukwuma**
- **Favour Asadu**
- **Tariere Wodu**

### Team Project

Developed collaboratively during the RideAlong project.

---

# 📄 License

This project is intended for educational and portfolio purposes.

---

# 🙏 Acknowledgements

Special thanks to every team member who contributed to the planning, design, development, testing, and deployment of RideAlong.

Their collaboration helped transform the idea into a fully functional vehicle document management platform.

---

## ⭐ If you found this project interesting, consider giving it a star!
