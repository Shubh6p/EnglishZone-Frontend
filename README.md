# English Zone School Management System

Welcome to the **English Zone** School Management System frontend application, built with React and Vite. This platform provides clean, highly dynamic, state-driven dashboards for students, teachers, and admins to manage courses, attendance, grades, invoicing, transit, and resources under a unified design theme (Royal Blue headers/footers, Orange action buttons, and White backgrounds).

---

## Technical Stack & Architecture

- **Core**: React 19, Vite, HTML5
- **Routing**: React Router DOM (v7)
- **State Management**: React Context API (`AppContext.jsx` global store)
- **Icons**: Lucide React
- **Design System**: Vanilla CSS with unified variables mapping theme colors (`--primary-color: #0052cc`, `--accent-color: #ff6b00`, `--success-color: #10b981`, etc.)

---

## Navigation & Portals

The application features three primary workspace dashboards accessed through a unified login toggle page.

### 1. Student Portal
- **Dashboard Home**: Summary of student profile details, visual circular attendance compliance meter, and dynamic lecture schedule.
- **Classroom**: Watch recorded lecture videos and download PDF lesson notes.
- **Teachers Room**: Listings of subject instructors with profiles and email quick-links.
- **Exams**: Unit test schedules, admit cards, and grade performance summary.
- **Fees & Invoices**: Fee slips log (paid/pending status indicators) and administrative deposits list.
- **Transport Details**: Bus routing lists, driver contact info, and route maps tracker.

* **Demo Login Credentials**:
  - **Email**: `student@englishzone.com`
  - **Password**: `password123`
  - **Auto-redirects to**: `/dashboard`

---

### 2. Teacher Portal
- **Dashboard Home**: Sidebar navigation split view showcasing teacher designation profile (Name, Employee ID, specialized subjects) and a dynamic weekday lecture slot calendar.
- **My Attendance**: June/May/April calendar view logging daily attendance statuses (Present, Absent, Leave, Weekend) and an SVG radial percentage meter.
- **Class Attendance**: Designated roster view of Grade 10-A students with custom-styled sliding track switches (Present/Absent).
- **Class Gradebook**: Numeric matrix inputs per subject and exam cycle, displaying class average grade, max score, and passing rate in real-time.
- **Salary & Payroll**: Monthly breakdown slips detailed by base gross salary, leaves cuts, tax, provident fund, and net payout.
- **Resources**: Upload simulation portal to publish lectures and PDF notes, alongside digital NCERT curriculum download books.

* **Demo Login Credentials**:
  - **Email**: `teacher@englishzone.com`
  - **Password**: `password123`
  - **Auto-redirects to**: `/teacher-dashboard`

---

### 3. Admin Command Center
- **Overview Dashboard**: General institutional briefing displaying overall metrics for student enrollments, faculty counts, transit fleet, and monthly dues collections.
- **User Management**: Unified roster table with directory filters. Enables adding user profiles and toggling active/suspended statuses in real-time.
- **Academic Control**: Academic class listings, curriculum book databases with official NCERT links, and interactive weekly class timetable queries.
- **Financial Invoicing**: Fee generator form supporting recipient class selection, base tuition amount, transport add-ons (+₹800), and custom billing deadlines. Displays accounts log tables with paid/pending status badges.
- **Transit Monitoring**: Transport fleet tracking tables with bus license numbers, active routes, drivers, and visual seating occupancy load progress bars. Integrates workshop/dispatch action triggers.

* **Demo Login Credentials**:
  - **Email**: `admin@englishzone.com`
  - **Password**: `password123`
  - **Auto-redirects to**: `/admin-dashboard`

---

## Development Setup

To run the application locally on your machine, run these commands inside the root workspace folder:

### 1. Run Development Server
```bash
# Bypasses execution policies on Windows
cmd /c npm run dev
```
Open `http://localhost:5173/` in your web browser.

### 2. Production Compile Build
```bash
# Validates build compiling
cmd /c npm run build
```

---

## Task Progress Checklist

Below is the checklist of what has been completed in the application, and what remaining actions are planned.

### Completed Tasks
- [x] Create Landing page Achievements & Hall of fame layouts
- [x] Implement Student login and register details pages
- [x] Design Student Dashboard layouts (Classroom, Fees, Transport, Exams, Teachers)
- [x] Add dynamic tab triggers on the login card to choose Student vs. Teacher portal vs. Admin Command Center
- [x] Configure router paths for `/teacher-dashboard` and `/admin-dashboard` and their children in `App.jsx`
- [x] Set up teacher and admin profiles, monthly payroll models, users directory, and rosters in context
- [x] Build Teacher Dashboard Home with top details card and dynamic timetables
- [x] Implement Class Attendance marked sheets using custom toggle slider tracks
- [x] Implement Teacher My Attendance tracker calendars with radial SVG rate meters
- [x] Create Salary & Payroll breakdown lists with month select dropdowns
- [x] Implement Class Gradebook matrices with real-time analytics averages recalculation
- [x] Build Digital Resources uploads simulator and digital NCERT books downloads
- [x] Standardize theme styling parity across all student and teacher pages
- [x] Design and build the Admin Portal Module (Overview metrics, User Management directories, Academic Control centers, Financial Invoicing generators, and Transit Monitoring tables)

### Remaining Tasks
- [ ] Implement Superadmin Panel frontend portal for system-wide configuration, institution management, and database logs
- [ ] Connect state to a live backend API database endpoint (currently using React mock state)
- [ ] Connect real file uploads (e.g. AWS S3 integrations) for notes and worksheets uploads
- [ ] Integrate a credit card / UPI billing gateway checkout for student fee payments
- [ ] Implement browser SMS/Email push alerts for student absence notifications
