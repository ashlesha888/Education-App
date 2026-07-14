# Profile APIs

Base URL

```text
/api/v1/profile
```

---

## Get User Details

**GET** `/getUserDetails`

Authentication: User Required

Response

```json
{
  "success": true,
  "data": {}
}
```

---

## Update Profile

**PUT** `/updateProfile`

Authentication: User Required

Request Body

| Field | Type |
|--------|------|
| gender | String |
| dateOfBirth | Date |
| about | String |
| contactNumber | String |

Response

```json
{
  "success": true,
  "message": "Profile updated successfully."
}
```

---

## Update Display Picture

**PUT** `/updateDisplayPicture`

Authentication: User Required

Multipart Form Data

| Field | Type |
|--------|------|
| displayPicture | File |

---

## Delete Account

**DELETE** `/deleteProfile`

Authentication: User Required

Response

```json
{
  "success": true,
  "message": "Account deleted successfully."
}
```

