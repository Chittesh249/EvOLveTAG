# Evolve TAG

A WordPress-style research community platform: public home, member profiles, research papers, and newsletters. JWT-based auth with Admin and Member roles.

---

## Quick start

### Backend (Flask + PostgreSQL)

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a PostgreSQL database named `evolve_tag` (or set `DATABASE_URI`). Optional: copy `.env.example` to `.env` and set:

- `DATABASE_URI` — e.g. `postgresql://user@localhost/evolve_tag`
- `SECRET_KEY` / `JWT_SECRET_KEY` — required in production

Run the API:

```bash
python run.py
```

API runs at **http://localhost:5000**. Tables are created on first run.

### Frontend (React)

```bash
cd client
npm install
npm start
```

App runs at **http://localhost:3000**. Set `REACT_APP_API_URL=http://localhost:5000/api` if the API is on another host.

### Production build (WordPress-style deploy)

1. **Backend**: set `FLASK_ENV=production`, `DATABASE_URI`, and `SECRET_KEY`; run with gunicorn or your WSGI server.
2. **Frontend**: `npm run build` in `client/`; serve the `build/` folder with a static server or reverse proxy (e.g. nginx). Point `REACT_APP_API_URL` to your API base URL.

---

## Deploy frontend to Vercel

Only the **React app** is deployed to Vercel. The Flask backend must be hosted elsewhere (e.g. [Render](https://render.com), [Railway](https://railway.app), or a VPS) and connected via `REACT_APP_API_URL`.

1. **Push your code** to GitHub (if not already).

2. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub.

3. **Import** your repository. Click **Add New** → **Project** and select the `EvOLveTAG` repo.

4. **Configure the project:**
   - **Root Directory:** set to `client` (click **Edit** and choose the `client` folder).
   - **Framework Preset:** Create React App (or leave as detected).
   - **Build Command:** `npm run build` (default).
   - **Output Directory:** `build` (default).

5. **Environment variables:** Add:
   - **Name:** `REACT_APP_API_URL`  
   - **Value:** your backend API base URL, e.g. `https://your-backend.onrender.com/api`  
   (No trailing slash. The app will call this for auth, papers, newsletters, etc.)

6. **Deploy.** Click **Deploy**. Vercel will build and host the app; you’ll get a URL like `https://evolvetag.vercel.app`.

**Note:** Deploy the backend first and enable CORS for your Vercel domain (e.g. `https://your-app.vercel.app`). The Flask app already allows all origins for `/api/*`; for production you may want to restrict this to your frontend URL.

---

## Software Requirements Specification (SRS)

### 1. Introduction

### 1.1 Purpose
This document outlines the functional and non-functional requirements for the **Evolve TAG Website**, a full-stack web application. It will serve as a WordPress-style platform allowing members to maintain personal profiles, publish research papers and newsletters, and enable secure access using JWT-based login.

### 1.2 Scope
The application will provide:
- A publicly accessible home page
- Research paper repository
- Newsletters section
- Editable individual profile pages for each TAG member  
Members can edit their own profiles, and a central admin can manage all content. JWT-based authentication ensures secure, role-based access.

### 1.3 Stakeholders

| Stakeholder        | Interest                                                       |
|--------------------|----------------------------------------------------------------|
| Evolve TAG Members | Manage and update their own profile pages                      |
| Central Admin      | Full control over users, content, and access                   |
| Researchers        | Browse research papers and newsletters                         |
| General Visitors   | View public-facing content such as home, newsletters, members  |
| DevOps Team        | Deploy and maintain the web application                        |

### 1.4 Definitions & Abbreviations

| Term         | Meaning                                             |
|--------------|-----------------------------------------------------|
| JWT          | JSON Web Token, used for secure authentication      |
| Admin        | User with full access privileges                    |
| Member       | Registered TAG member with editable profile access  |
| Repository   | Research paper storage and publication area         |
| Newsletter   | Periodic content shared by Evolve TAG               |
| SRS          | Software Requirements Specification                 |

---

## 2. Overall Description

### 2.1 Product Perspective
The application is a modern, mobile-responsive WordPress-style site.  
Tech stack includes:
- **Frontend**: React or Next.js
- **Backend**: Node.js (Express)
- **Authentication**: JWT
- **Database**: MongoDB or PostgreSQL  
Deployed as a scalable SaaS-like platform.

### 2.2  User Classes & Characteristics

| Class     | Description                                              |
|-----------|----------------------------------------------------------|
| Admin     | Create, edit, and delete all content; manage user access |
| Member    | Edit their own profile page after login                  |
| Visitor   | View public content (home, members, newsletters, papers) |

### 2.3  Product Functions (High-Level)

- User Authentication using JWT  
- Home Page with general information  
- Individual Member Pages with role-based edit access  
- Research Paper Repository (managed by Admin)  
- Newsletter Section (managed by Admin)  
- Role-Based Access Control (RBAC)

### 2.4  Assumptions & Dependencies

- JWT is used for session and role management  
- Roles (Admin/Member) are defined on user creation  
- Each member has a unique profile ID  
- MongoDB or PostgreSQL will be used as the database  
- File uploads handled via local or cloud (e.g., AWS S3)  
- CMS or markdown integration is **not** part of MVP  

---

## 3. Functional Requirements

### 3.1 User Authentication

| ID         | Requirement                                                    |
|------------|----------------------------------------------------------------|
| FR-A-01    | Users shall log in using email and password                    |
| FR-A-02    | System shall use JWT for session management                    |
| FR-A-03    | Role-based access shall be enforced using JWT claims           |

### 3.2 Member Profile Management

| ID         | Requirement                                                    |
|------------|----------------------------------------------------------------|
| FR-MP-01   | Members shall edit their profile page post-login               |
| FR-MP-02   | Admin shall have permission to edit all member profiles        |
| FR-MP-03   | Member pages shall be publicly viewable in read-only mode      |

### 3.3 Research Paper Repository

| ID         | Requirement                                                    |
|------------|----------------------------------------------------------------|
| FR-RP-01   | Admin shall upload research papers with title, author, etc.    |
| FR-RP-02   | System shall list all uploaded papers for public view          |
| FR-RP-03   | Papers shall be viewable/downloadable in-browser               |

### 3.4 Newsletter Section

| ID         | Requirement                                                    |
|------------|----------------------------------------------------------------|
| FR-NL-01   | Admin shall upload newsletters with metadata                   |
| FR-NL-02   | All users shall view and read newsletter content               |

### 3.5 Home Page

| ID         | Requirement                                                    |
|------------|----------------------------------------------------------------|
| FR-HP-01   | System shall have a public-facing home page                    |
| FR-HP-02   | Admin shall be able to update the home page content            |

---

## 4. Non-Functional Requirements

| ID         | Requirement                                                    |
|------------|----------------------------------------------------------------|
| NFR-01     | Application shall support major browsers (Chrome, Firefox, Edge)|
| NFR-02     | Application shall be mobile and tablet responsive              |
| NFR-03     | JWT tokens shall expire and support secure refresh mechanisms  |
| NFR-04     | Passwords shall be stored securely using hashing (e.g., bcrypt)|
| NFR-05     | Application shall support concurrent access & scalable backend |
| NFR-06     | System shall aim for 99.5% uptime after deployment             |

---


Maintained by: Vasudev Kishor
