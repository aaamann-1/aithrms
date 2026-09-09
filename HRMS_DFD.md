# HRMS Project Data Flow Diagram (DFD)

This DFD is designed for the current Angular HRMS project structure and explains the full flow of data between users, system modules, and data stores in a simple, numbered format.

> Note: This project is a frontend Angular application, so the diagram represents the app logic and the expected backend/data flow as a complete HRMS system design.

---

## 1. Level 0 DFD (Context Diagram)

```mermaid
flowchart LR
    A[Admin User] -->|1. Login & access request| P[HRMS System]
    S[Staff User] -->|2. Login & task request| P
    P -->|3. User dashboard / access response| A
    P -->|4. Staff dashboard / task response| S

    P -->|5. Employee, attendance, report data| DB[(HRMS Database)]
    DB -->|6. Stored data response| P

    P -->|7. Reports / alerts / notifications| N[Notification Service]
    N -->|8. Email / mobile / alert updates| A
    N -->|9. Task and reminder alerts| S

    P -->|10. Exported report files| R[Report Output]
    R -->|11. Downloaded report| A
```

### Level 0 Flow Explanation

1. Admin user sends login and access request to the HRMS system.
2. Staff user sends login and task request to the HRMS system.
3. System sends admin dashboard and authorization details.
4. System sends staff dashboard and task access details.
5. HRMS system stores and updates employee, attendance, and report data in the database.
6. Database returns saved data and records to the system.
7. System sends reports, alerts, and notifications to the notification service.
8. Notification service delivers alerts to admin users.
9. Notification service delivers reminders and updates to staff users.
10. System creates exported report files.
11. Admin downloads or reviews output reports.

---

## 2. Level 1 DFD (Main System Breakdown)

```mermaid
flowchart TD
    A[Admin] -->|1. Login / manage staff| P1[1.0 Authentication & Access]
    S[Staff] -->|2. Login / task update| P1

    P1 -->|3. Valid user token / role| P2[2.0 Employee & Staff Management]
    P1 -->|4. Dashboard access| P3[3.0 Attendance & Task Tracking]
    P1 -->|5. Report access| P4[4.0 Reports & Analytics]
    P1 -->|6. Settings access| P5[5.0 Settings & Issue Management]

    P2 -->|7. Employee records| D1[(Employee DB)]
    D1 -->|8. Staff details / roles| P2

    P3 -->|9. Attendance records| D2[(Attendance DB)]
    D2 -->|10. Attendance status| P3

    P3 -->|11. Task entries| D3[(Task DB)]
    D3 -->|12. Task completion status| P3

    P4 -->|13. Generated reports| D4[(Reports DB)]
    D4 -->|14. Report output| P4

    P5 -->|15. Settings / categories| D5[(Settings DB)]
    D5 -->|16. Config data| P5

    P4 -->|17. Export report| O[Exported Reports]
    P5 -->|18. Alerts / issues| N[Notification System]
    P3 -->|19. Reminder notifications| N

    N -->|20. Email / push alerts| A[Admin]
    N -->|21. Task reminders| S
```

### Detailed Process Mapping to This Project

#### 1.0 Authentication & Access
- Login page
- Register page
- Forgot password page
- Role-based access for Admin and Staff

#### 2.0 Employee & Staff Management
- Staff management module
- Employee module
- Employee form
- Issue categories
- Settings

#### 3.0 Attendance & Task Tracking
- Admin attendance records
- Staff attendance page
- Task entry page
- Live feed activities

#### 4.0 Reports & Analytics
- Individual reports
- Team reports
- Export reports
- Dashboard summaries

#### 5.0 Settings & Issue Management
- Issue categories
- Admin settings
- System preferences
- Configuration management

---

## 3. Numbered Data Flow Mapping for the Full Project

### A. User Login Flow
1. User enters username/password on the login screen.
2. Login form sends data to Authentication module.
3. Authentication validates role: admin or staff.
4. System generates access token and redirect path.
5. User is redirected to dashboard or assigned page.

### B. Admin Management Flow
1. Admin opens Staff Management page.
2. Admin creates/updates employee records.
3. Employee data is validated by the form logic.
4. Data is stored in the Employee database.
5. Dashboard refreshes with updated staff list.

### C. Attendance Flow
1. Staff marks attendance or checks in.
2. Attendance data is sent to the attendance module.
3. System stores record in Attendance database.
4. Attendance is compared against working schedules.
5. Admin sees attendance summary on dashboard.

### D. Task Entry Flow
1. Staff submits daily tasks.
2. Task data goes to Task Entry module.
3. The task is stored in Task database.
4. Admin or manager views live feed and updates.
5. Completed tasks trigger notifications.

### E. Report Generation Flow
1. User selects report type (individual or team).
2. System fetches staff, task, and attendance data.
3. Data is processed in report engine.
4. Report summary is generated.
5. User exports or views the final report file.

### F. Settings and Issues Flow
1. Admin enters issue categories or configuration values.
2. System validates category/setting data.
3. Data is stored in Settings database.
4. UI reflects updated rules and labels.
5. Notifications are triggered for system-level updates.

---

## 4. Component-to-Data Flow Relationship in This Project

```mermaid
flowchart LR
    subgraph Public
        LP[Login Page]
        RP[Register Page]
        FP[Forgot Password]
    end

    subgraph Admin
        AD[Admin Dashboard]
        SM[Staff Management]
        EMP[Employee Form]
        AT[Attendance]
        IR[Individual Reports]
        TR[Team Reports]
        IC[Issue Categories]
        EX[Export Reports]
        ST[Settings]
    end

    subgraph Staff
        SD[Staff Dashboard]
        TE[Task Entry]
        SA[Staff Attendance]
        PR[Profile]
        MR[My Reports]
    end

    subgraph Data
        EDB[(Employee Data)]
        ADB[(Attendance Data)]
        TDB[(Task Data)]
        RDB[(Report Data)]
        SDB[(Settings Data)]
    end

    LP -->|1| AD
    RP -->|2| LP
    FP -->|3| LP

    AD -->|4| SM
    SM -->|5| EDB
    EDB -->|6| EMP

    SD -->|7| TE
    TE -->|8| TDB
    TDB -->|9| SA
    SA -->|10| ADB

    AD -->|11| IR
    IR -->|12| RDB
    TR -->|13| RDB
    RDB -->|14| EX

    AD -->|15| IC
    AD -->|16| ST
    IC -->|17| SDB
    ST -->|18| SDB
```

---

## 5. Simple Full-Project Summary

This HRMS project consists of 5 major data flows:

1. User authentication and access
2. Employee/staff management
3. Attendance and task tracking
4. Reports and exports
5. Settings, categories, and notifications

The main data movement is:

User -> System Modules -> Database -> Dashboard / Reports / Notifications -> User

---

## 6. Recommended Project Logic for Future Backend Integration

For a real backend version, connect each module to these tables:

- users
- employees
- departments
- attendance
- tasks
- reports
- issue_categories
- settings
- notifications

This will make the project scalable and easier to manage in a full-stack implementation.

---

## 7. Final DFD Interpretation

The full project works like this:

- Users log in to the system.
- Admins manage employees and operations.
- Staff record attendance and update tasks.
- Reports are generated from stored data.
- Configurations and issue records are updated in settings.
- All important actions trigger notifications and reporting outputs.

This gives a complete and clear data flow for the entire HRMS application.
