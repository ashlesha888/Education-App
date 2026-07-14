# SubSection APIs

Base URL

```text
/api/v1/subsection
```

---

## Create Lecture

**POST** `/createSubSection`

Authentication: Instructor

Multipart Form Data

| Field | Type |
|--------|------|
| sectionId | ObjectId |
| title | String |
| description | String |
| videoFile | File |

---

## Update Lecture

**PUT** `/updateSubSection/:subSectionId`

Authentication: Instructor

---

## Delete Lecture

**DELETE** `/deleteSubSection/:subSectionId`

Authentication: Instructor

---

## Get Lecture Details

**GET** `/subSection/:subSectionId`

Public