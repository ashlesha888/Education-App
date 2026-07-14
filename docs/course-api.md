# Course APIs

Base URL

```text
/api/v1/course
```

All course-related endpoints are documented below.

## Create Course

**Endpoint**

```http
POST /createCourse
```

### Authentication

Instructor Only

### Request Body

| Field | Type | Required |
|--------|------|----------|
| courseName | String | ✅ |
| courseDescription | String | ✅ |
| whatYouWillLearn | String | ✅ |
| price | Number | ✅ |
| category | ObjectId | ✅ |
| thumbnail | File | ✅ |
| tag | Array | ✅ |
| instructions | Array | ✅ |

### Success Response

```json
{
  "success": true,
  "message": "Course created successfully.",
  "data": {}
}
```

### Possible Errors

| Status | Description |
|---------|-------------|
|400|Missing Required Fields|
|401|Unauthorized|
|404|Category Not Found|
|500|Internal Server Error|

## Edit Course

**Endpoint**

```http
PUT /editCourse/:courseId
```

### Authentication

Instructor Only

### Request Body

Only send the fields that need to be updated.

### Success Response

```json
{
  "success": true,
  "message": "Course updated successfully.",
  "data": {}
}
```

## Delete Course

**Endpoint**

```http
DELETE /deleteCourse/:courseId
```

### Authentication

Instructor Only

### Success Response

```json
{
  "success": true,
  "message": "Course deleted successfully."
}
```

## Get Course Details

**Endpoint**

```http
GET /getCourseDetails/:courseId
```

### Authentication

Public

### Success Response

```json
{
  "success": true,
  "data": {
    "course": {},
    "instructor": {},
    "sections": [],
    "rating": []
  }
}
```

## Get Published Courses

**Endpoint**

```http
GET /getAllCourses
```

### Authentication

Public

### Success Response

```json
{
  "success": true,
  "data": []
}
```

## Get Instructor Courses

**Endpoint**

```http
GET /getInstructorCourses
```

### Authentication

Instructor Only

### Success Response

```json
{
  "success": true,
  "data": []
}
```

## Publish Course

**Endpoint**

```http
PATCH /publishCourse/:courseId
```

### Authentication

Admin Only

### Success Response

```json
{
  "success": true,
  "message": "Course published successfully."
}
```

## Unpublish Course

**Endpoint**

```http
PATCH /unpublishCourse/:courseId
```

### Authentication

Admin Only

### Success Response

```json
{
  "success": true,
  "message": "Course unpublished successfully."
}
```

