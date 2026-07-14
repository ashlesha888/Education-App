# Authentication APIs

Base URL

```
http://localhost:4000/api/v1/auth
```

All authentication related endpoints are documented below.

## Register User

**Endpoint**

```http
POST /signup
```

### Request Body

| Field | Type | Required |
|--------|------|----------|
| firstName | String | ✅ |
| lastName | String | ✅ |
| email | String | ✅ |
| password | String | ✅ |
| confirmPassword | String | ✅ |
| accountType | String | ✅ |

### Success Response

```json
{
  "success": true,
  "message": "OTP sent successfully."
}
```

### Error Responses

| Status | Description |
|---------|-------------|
|400|Validation Error|
|409|User Already Exists|
|500|Internal Server Error|

## Verify OTP

**Endpoint**

```http
POST /verify-otp
```

### Request Body

| Field | Type |
|--------|------|
| email | String |
| otp | String |

### Success Response

```json
{
  "success": true,
  "message": "Account created successfully."
}
```

## Login

**Endpoint**

```http
POST /login
```

### Request Body

| Field | Type |
|--------|------|
| email | String |
| password | String |

### Success Response

```json
{
  "success": true,
  "token": "...",
  "user": {}
}
```

### Cookies

- JWT Token

## Logout

**Endpoint**

```http
POST /logout
```

### Authentication

JWT Required

### Success Response

```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

## Forgot Password

**Endpoint**

```http
POST /forgot-password
```

### Request Body

| Field | Type |
|--------|------|
| email | String |

### Success Response

```json
{
  "success": true,
  "message": "Password reset email sent."
}
```

## Reset Password

**Endpoint**

```http
POST /reset-password/:token
```

### Request Body

| Field | Type |
|--------|------|
| password | String |
| confirmPassword | String |

### Success Response

```json
{
  "success": true,
  "message": "Password reset successful."
}
```

