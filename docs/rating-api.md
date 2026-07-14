# Rating & Review APIs

Base URL

```text
/api/v1/rating
```

---

## Create Review

**POST** `/createRating`

Authentication: Student

Request Body

| Field | Type |
|--------|------|
| courseId | ObjectId |
| rating | Number |
| review | String |

---

## Update Review

**PUT** `/updateRating/:reviewId`

Authentication: Student

---

## Delete Review

**DELETE** `/deleteRating/:reviewId`

Authentication: Student

---

## Get Course Reviews

**GET** `/getCourseReviews/:courseId`

Public

---

## Get Average Rating

**GET** `/getAverageRating/:courseId`

Public
