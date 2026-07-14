# Notification APIs

Base URL

```text
/api/v1/notifications
```

---

## Get Notifications

**GET** `/`

Authentication: User

---

## Mark Notification As Read

**PATCH** `/:notificationId/read`

Authentication: User

---

## Mark All As Read

**PATCH** `/read-all`

Authentication: User

---

## Delete Notification

**DELETE** `/:notificationId`

Authentication: User

---

## Announcement API

**POST** `/announcement`

Authentication: Admin

---

## Broadcast Notification

**POST** `/broadcast`

Authentication: Admin

---

## Update Notification Preferences

**PATCH** `/preferences`

Authentication: User