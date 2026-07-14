# Admin APIs

Base URL

```text
/api/v1/admin
```

---

## Get All Users

**GET** `/users`

Authentication: Admin

Response

```json
{
  "success": true,
  "data": []
}
```

---

## Get User By ID

**GET** `/users/:id`

Authentication: Admin

---

## Update User

**PUT** `/users/:id`

Authentication: Admin

---

## Delete User

**DELETE** `/users/:id`

Authentication: Admin

---

## Suspend User

**PATCH** `/users/:id/suspend`

Authentication: Admin

---

## Restore User

**PATCH** `/users/:id/restore`

Authentication: Admin

---

## Dashboard Statistics

**GET** `/dashboard`

Authentication: Admin

Returns

- Total Revenue
- Total Users
- Total Courses
- Total Enrollments
- Recent Registrations
- Recent Payments

---

## Analytics

**GET** `/analytics`

Authentication: Admin

Returns

- Monthly Growth
- Top Rated Courses
- Top Instructors
- Most Active Students