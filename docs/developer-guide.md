# Developer Guide

## Project Architecture

The backend follows a layered architecture:

- Routes
- Controllers
- Services / Helpers
- Models
- Utilities
- Middleware

Business logic is separated from route definitions to improve maintainability.

---

## Authentication Flow

1. User signs up.
2. OTP is generated.
3. OTP is verified.
4. Account is created.
5. User logs in.
6. JWT token is generated.
7. Protected APIs validate JWT using authentication middleware.

---

## Payment Flow

1. Student selects a course.
2. Razorpay order is created.
3. Payment is completed.
4. Signature is verified.
5. Student is automatically enrolled.
6. Purchase email is sent.
7. Payment history is updated.

---

## Course Flow

Instructor

Create Course

↓

Add Sections

↓

Add SubSections

↓

Publish Course

↓

Student Purchases Course

↓

Enrollment

↓

Watch Videos

↓

Progress Tracking

↓

Course Completion

↓

Completion Email

## Error Handling Flow

Client Request

↓

Routes

↓

Controllers

↓

Services / Helpers

↓

Business Logic

↓

Exception Thrown

↓

Global Error Handler

↓

Standardized JSON Response

The project uses centralized error handling with custom error classes to ensure consistent API responses across the application.