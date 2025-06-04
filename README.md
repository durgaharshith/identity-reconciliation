# Identity Reconciliation API

This is a backend system built for Bitespeed's Identity Reconciliation challenge. It identifies and manages user contact information based on email and/or phone number, merging duplicate or related entries while tracking relationship history.

---

##  Problem Statement

In real-world applications, a user may provide different combinations of email or phone across multiple interactions. This API:

- Identifies existing contacts with matching email or phone.
- Links duplicate entries and distinguishes primary and secondary identities.
- Supports soft deletion and preserves history.

---

##  Tech Stack

- **Node.js** & **Express.js** — Server and API framework  
- **PostgreSQL** — Relational database  
- **Nodemon** — For development hot-reloading  
- **dotenv** — To manage environment variables  

---

##  Project Structure

```text
.
└──index.html
└── src
    ├── controllers/
    │   └── identifyController.js
    ├── models/
    ├── routes/
    │   └── identifyRoutes.js
    ├── utils/
    ├── config/
    │   └── db.js
    ├── .env
    └── server.js

```


---

##  API Endpoints

### 1. Identify Contact

**POST** `/identify`

#### Request Body:

```json
{
  "email": "test@example.com",
  "phoneNumber": "9876543210"
}
````

#### Response:

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["test@example.com"],
    "phoneNumbers": ["9876543210"],
    "secondaryContactIds": [],
    "deletedAt" : null
  }
}
```

---

### 2. Delete Contact (Soft Delete)

**DELETE** `/contact/:id`

* Sets `deletedAt` timestamp instead of hard-deleting.

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/durgaharshith/identity-reconciliation.git
cd identity-reconciliation
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env` file:

```env
DATABASE_URL=postgres://username:password@localhost:5432/your_db
PORT=3000
```

### 4. Set up the database

Run migration if using Sequelize CLI or create the table manually:

```sql
CREATE TABLE "Contact" (
  "id" SERIAL PRIMARY KEY,
  "phoneNumber" VARCHAR(20),
  "email" VARCHAR(255),
  "linkedId" INTEGER,
  "linkprecedence" VARCHAR(10) CHECK ("linkprecedence" IN ('primary', 'secondary')),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP
);
```

### 5. Run the server

```bash
npm run dev
```

Server will run on `http://localhost:3000`.

---

