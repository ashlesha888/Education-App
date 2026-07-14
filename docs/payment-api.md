# Payment APIs

Base URL

```text
/api/v1/payment
```

---

## Create Order

**POST** `/createOrder`

Authentication: Student

Request Body

| Field | Type |
|--------|------|
| courseId | ObjectId |

---

## Verify Payment

**POST** `/verifyPayment`

Authentication: Student

Request Body

| Field | Type |
|--------|------|
| razorpayOrderId | String |
| razorpayPaymentId | String |
| razorpaySignature | String |

---

## Cancel Payment

**POST** `/cancelPayment`

Authentication: Student

---

## Payment History

**GET** `/paymentHistory`

Authentication: Student

---

## Payment Details

**GET** `/payment/:paymentId`

Authentication: Student