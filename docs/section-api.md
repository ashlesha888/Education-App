# Section APIs

Base URL

```text
/api/v1/section
```

---

## Create Section

**POST** `/createSection`

Authentication: Instructor

Request Body

| Field | Type |
|--------|------|
| courseId | ObjectId |
| sectionName | String |

---

## Update Section

**PUT** `/updateSection/:sectionId`

Authentication: Instructor

---

## Delete Section

**DELETE** `/deleteSection/:sectionId`

Authentication: Instructor

---

## Get Section Details

**GET** `/section/:sectionId`

Public