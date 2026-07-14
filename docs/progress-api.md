# Course Progress APIs

Base URL

```text
/api/v1/progress
```

---

## Update Progress

**PUT** `/updateCourseProgress`

Authentication: Student

Request Body

| Field | Type |
|--------|------|
| courseId | ObjectId |
| subsectionId | ObjectId |

---

## Get Course Progress

**GET** `/getCourseProgress/:courseId`

Authentication: Student

---

## Get Last Watched Video

**GET** `/lastWatched/:courseId`

Authentication: Student

---

## Mark Course Complete

Automatically handled when 100% progress is reached.