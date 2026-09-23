# Complaint Management System — Full-Stack Web Portal

A modern, responsive, college-grade **Complaint Management System** built by converting an existing Java console application into an enterprise web portal with a RESTful Java backend, SQLite relational database, and an interactive React + TailwindCSS frontend.

---

## 1. Project Structure

```
ComplaintManagementSystem/
├── start-portal.bat               # One-click Windows master launcher (starts both backend & frontend)
├── test-e2e.ps1                   # Automated end-to-end test suite
├── database/
│   ├── schema.sql                 # DDL definitions (students, admins, complaints, responses)
│   └── cms.db                     # Active SQLite database file
│
├── backend/
│   ├── build-backend.bat          # Compiles Java sources with javac
│   ├── run-backend.bat            # Starts Java REST API Server on port 8080
│   ├── lib/
│   │   ├── sqlite-jdbc.jar        # SQLite JDBC driver
│   │   ├── gson.jar               # Google Gson for JSON processing
│   │   ├── slf4j-api.jar          # Logging API
│   │   └── slf4j-simple.jar       # Simple logger implementation
│   └── src/com/cms/
│       ├── original/              # Original console files preserved intact
│       │   ├── Complaint.java
│       │   ├── ComplaintService.java
│       │   └── Main.java
│       ├── model/
│       │   ├── Complaint.java     # Extended Complaint model
│       │   ├── Student.java       # Registered student model
│       │   ├── Admin.java         # Administrative user model
│       │   └── Response.java      # Admin remarks / comments model
│       ├── dao/
│       │   ├── DatabaseManager.java  # Schema migrator, connection pooling & seeding
│       │   ├── ComplaintDAO.java     # Relational CRUD & filtering
│       │   ├── StudentDAO.java       # Student lookup & queries
│       │   ├── AdminDAO.java         # Admin credentials lookup
│       │   └── ResponseDAO.java      # Admin replies persistence
│       ├── service/
│       │   ├── ComplaintService.java # Business logic extending original CMS rules
│       │   ├── AuthService.java      # Registration, auth & validation
│       │   └── ReportService.java    # Aggregated metrics & CSV export
│       ├── security/
│       │   ├── PasswordUtil.java     # SHA-256 salted password hashing
│       │   └── SessionManager.java   # Bearer token generation & role validation
│       ├── http/
│       │   ├── HttpUtil.java         # CORS, headers & JSON responder
│       │   ├── HttpServerApp.java    # JDK HTTP Server context configuration
│       │   └── handlers/
│       │       ├── StudentHandler.java
│       │       ├── ComplaintHandler.java
│       │       ├── AdminHandler.java
│       │       └── ReportHandler.java
│       └── Server.java               # Main entrypoint
│
└── frontend/
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js
    ├── run-frontend.bat              # Starts Vite dev server on port 5173
    └── src/
        ├── api/
        │   └── client.js             # Fetch wrapper with Bearer token injection
        ├── components/
        │   ├── Navbar.jsx            # Responsive header with branding & user status
        │   ├── Sidebar.jsx           # Collapsible navigation drawer for Student & Admin
        │   ├── MobileNav.jsx         # Bottom navigation bar for mobile devices
        │   ├── StatusBadge.jsx       # Color-coded badges (Pending, In Progress, Resolved)
        │   ├── PriorityBadge.jsx     # Low, Medium, High, Urgent badges
        │   ├── Timeline.jsx          # Visual step-tracker: Submitted -> Pending -> In Progress -> Resolved
        │   ├── ConfirmModal.jsx      # Confirmation dialog for status updates & deletes
        │   └── Toast.jsx             # Floating notification alerts
        └── pages/
            ├── LandingPage.jsx       # Hero, quick search tracker, features, about
            ├── StudentLogin.jsx      # Student login with validation & demo autofill
            ├── StudentRegister.jsx   # Student registration with validation
            ├── StudentDashboard.jsx  # Student KPI summary & recent complaints table
            ├── RegisterComplaint.jsx # Multi-category grievance registration form
            ├── MyComplaints.jsx      # Filterable, sortable list (with mobile card view)
            ├── TrackComplaint.jsx    # Public tracking by Complaint ID (e.g. #CMP1001)
            ├── ComplaintDetails.jsx  # Comprehensive view with visual timeline & admin responses
            ├── AdminLogin.jsx        # Dedicated admin login (credentials protected)
            ├── AdminDashboard.jsx    # Admin metrics & interactive Chart.js visualizations
            ├── AdminComplaints.jsx   # Admin queue with status update, response, and delete modals
            ├── AdminStudents.jsx     # Registered students directory
            ├── AdminReports.jsx      # Analytics, CSV export, and print reports
            └── ProfilePage.jsx       # Account credentials & role details
```

---

## 2. Technologies Used

- **Backend**: Java 26 (Standard Library `com.sun.net.httpserver.HttpServer`)
  - Zero heavy framework dependencies; launches instantly.
  - Salted SHA-256 password hashing.
  - Token-based session management.
  - Original `com.cms` business logic preserved and extended into DAO and Service layers.
- **Database**: SQLite 3 with `sqlite-jdbc`
  - Relational schema (`students`, `admins`, `complaints`, `responses`).
  - Foreign key constraints with cascading deletes.
  - Auto-initialization and seeding of default accounts and complaints on startup.
- **Frontend**: React 18 + Vite 8 + TailwindCSS v4
  - Modern Blue (`#1e40af`) and Teal (`#0d9488`) design aesthetic.
  - Lucide React icon library.
  - Chart.js & `react-chartjs-2` for doughnut, bar, and trend charts.
  - Fully responsive on Desktop, Tablet (collapsible sidebar), and Mobile (bottom navigation + responsive cards).

---

## 3. How to Run Frontend

Navigate to `frontend/` and start the Vite dev server:

```powershell
cd C:\Users\ASUS\.gemini\antigravity\scratch\ComplaintManagementSystem\frontend
npm run dev -- --port 5173
```
Or double-click:
`run-frontend.bat`

The portal will be accessible at: **`http://localhost:5173`**

---

## 4. How to Run Backend

Navigate to `backend/` and run the server:

```powershell
cd C:\Users\ASUS\.gemini\antigravity\scratch\ComplaintManagementSystem\backend
run-backend.bat
```

To recompile:
```powershell
build-backend.bat
```

The REST API server will run on: **`http://localhost:8080`**
Health check endpoint: **`http://localhost:8080/api/health`**

---

## 5. One-Click Master Launcher

To start both Backend and Frontend simultaneously:
Double-click **`start-portal.bat`** in the project root.

---

## 6. How to Configure Database

The database is powered by SQLite located at:
`ComplaintManagementSystem/database/cms.db`

- **Schema Definition**: `database/schema.sql`
- **Auto-Initialization**: The Java backend automatically checks and executes `schema.sql` if `cms.db` does not exist or is empty.
- **Manual Reset**: To reset the database to factory defaults, simply delete `database/cms.db` and restart the backend.

---

## 7. Default Test Accounts

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: System Administrator (Full management & triage rights)

### Student Account (Pre-seeded)
- **Student ID**: `STU1001`
- **Password**: `student123`
- **Name**: Aarav Sharma
- **Email**: `aarav@college.edu`

*(You can also register any new student account directly from the UI using the "Create Account" screen.)*

---

## 8. Sample Testing Workflow

### Scenario 1: Quick Complaint Tracking (No Login Required)
1. Open `http://localhost:5173`.
2. In the hero section, type `CMP1001` or click "Track Status".
3. View the live visual status timeline and complaint details.

### Scenario 2: Student Lodges Grievance
1. Click **Student Login** and enter `STU1001` / `student123` (or click "Auto Fill").
2. View the Student Dashboard with status KPI cards and recent complaints.
3. Click **Lodge Complaint** in the sidebar.
4. Fill out the form:
   - **Category**: Hostel (or Water, Electricity, Food, Maintenance, etc.)
   - **Priority**: Urgent
   - **Title**: Broken lock on Hostel Wing B Room 304
   - **Location**: Block B, Floor 3
   - **Description**: Door lock jammed; cannot secure room.
5. Click **Submit Complaint**.
6. Note down the newly assigned unique ID (e.g., `#CMP1006`).
7. Click **My Complaints** to search, filter by category or status, and sort by date.

### Scenario 3: Admin Triage & Resolution
1. Log out or open an incognito window at `http://localhost:5173`.
2. Click **Admin Login** and sign in with `admin` / `admin123`.
3. The Admin Dashboard presents interactive charts (Complaints by Status, Complaints by Category, Complaints over Time).
4. Click **All Complaints** in the sidebar to view the triage queue.
5. Locate the newly registered complaint `#CMP1006`.
6. Click the **Response** button (chat icon) and enter:
   `"Carpenter and locksmith dispatched. ETA 30 minutes."`
7. Click the **Status** button (edit icon) and update status to **In Progress**.
8. After completion, click **Status** again and select **Resolved**.

### Scenario 4: Verifying Student View & Reports
1. Switch back to the student portal. The student's complaint `#CMP1006` now displays a green **Resolved** badge, the visual timeline highlights "Resolved", and the official admin remark is visible.
2. In the Admin portal, navigate to **Reports & Analytics**:
   - Inspect the KPI summaries and charts.
   - Click **Export CSV** to download `complaints_report_*.csv`.
   - Click **Print Report** to trigger a clean printable report view.
