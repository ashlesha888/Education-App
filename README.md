# LMS Backend

## Overview

A production-ready Learning Management System (LMS) backend built using Node.js, Express.js, MongoDB, and Cloudinary.

The project provides authentication, course management, payments using Razorpay, notifications, admin management, reviews, progress tracking, and secure REST APIs for an online learning platform.

## Features

- JWT Authentication
- Role Based Authorization
- Course Management
- Section & Lecture Management
- Student Enrollment
- Razorpay Payment Integration
- Course Progress Tracking
- Rating & Reviews
- Notifications
- Admin Dashboard APIs
- File Upload with Cloudinary
- Email Services
- Secure REST APIs

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Cloudinary
- Razorpay
- Nodemailer
- Multer

## 📂 Project Structure

```text
server/
│
├── config/
├── controllers/
├── helpers/
├── middlewares/
├── models/
├── routes/
├── services/
├── uploads/
├── utils/
│
├── .env
├── .gitignore
├── index.js
├── package.json
└── README.md
```

## 🚀 Installation

Clone the repository

```bash
git clone <repository-url>
```

Navigate to the project

```bash
cd server
```

Install dependencies

```bash
npm install
```

Create a `.env` file

Start the server

```bash
npm run dev
```

## Environment Variables

Create a `.env` file

```env
PORT=
MONGO_URL=
JWT_SECRET=
JWT_EXPIRES=

CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

MAIL_HOST=
MAIL_USER=
MAIL_PASS=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

FRONTEND_DEV=
FRONTEND_PROD=
```

## ▶ Running the Server

Development

```bash
npm run dev
```

Production

```bash
npm start
```

## 📌 API Modules

- Authentication
- Profile Management
- Course Management
- Sections
- SubSections
- Ratings & Reviews
- Student Progress
- Payment Integration
- Notifications
- Admin Management

## 🚀 Future Improvements

- Wishlist
- Discussion Forum
- Course Certificates
- Refresh Token Authentication
- Email Verification
- Two-Factor Authentication
- Instructor Verification
- Recommendation System


## Documentation

The project documentation is available inside the `docs/` directory.

- Authentication APIs
- Profile APIs
- Course APIs
- Rating APIs
- Progress APIs
- Payment APIs
- Admin APIs
- Notification APIs
- Developer Guide

---

## Postman Collection

Import the provided Postman Collection to test all APIs.

---

## License

This project is developed for educational purposes.


### Import Steps

1. Open Postman.
2. Click **Import**.
3. Select the collection JSON file.
4. Import the environment file.
5. Update environment variables.
6. Start testing the APIs.

### Required Variables

| Variable | Description |
|----------|-------------|
| BASE_URL | Backend URL |
| TOKEN | JWT Token |
| COURSE_ID | Sample Course ID |
| USER_ID | Sample User ID |
| PAYMENT_ID | Sample Payment ID |