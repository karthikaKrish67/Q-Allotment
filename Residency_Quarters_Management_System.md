# Residency / Quarters Allotment Management System – Project Prompt (Updated with UnEmployee Module)

## 1. Project Description
Build a complete **Residency / Quarters Allotment Management System** for township/organization administration.

The system must automate:
- UnEmployee registration  
- Quarters allotment & cancellation  
- Quarter categories (Type I, II, III, IV)  
- Billing (rent, utilities, maintenance)  
- Vacancy & occupancy tracking  
- Maintenance complaints  
- Admin dashboard with analytics  

## 2. User Roles

### Admin
- Login  
- Add/Edit/Delete/View UnEmployees  
- Allot/Cancel quarters  
- Update resident details  
- Track vacant vs occupied quarters  
- Manage maintenance complaints  
- Generate reports (PDF/Excel)  

### UnEmployee / User
- Login  
- View allotted quarter  
- File maintenance complaints  
- View bills & payment status  

## 3. Required Features

### Authentication
- Secure Login (Admin & User)  
- Role-based access  

## 4. UnEmployee Module (Replaces Employee Module)
Store details of non-employee residents:

| Field | Description |
|-------|-------------|
| **Name** | UnEmployee full name |
| **Private Party Code** | Unique identifier |
| **Address** | Residential address |

### Functionalities
- Add new UnEmployee  
- Edit or delete UnEmployee  
- Search by *Private Party Code*  
- Link UnEmployee to quarter allotment  

## 5. Quarters Module
- Create quarter categories (Type A/B/C/…)  
- Add quarters with unique quarter numbers  
- Allot to UnEmployee  
- Prevent duplicate allotment  
- Auto-update status (Vacant / Occupied)  

## 6. Billing Module
- Generate monthly bills  
- View payment history  
- Mark payments as paid  
- Include rent, service charges, maintenance fees  

## 7. Maintenance Complaints
- User can raise complaints  
- Admin can update status (Pending, In-progress, Completed)  
- Track complaint history  

## 8. Dashboard & Reports
Use **Chart.js** for visual analytics:

- Total quarters  
- Occupied vs Vacant quarters  
- Category-wise occupancy  
- Total UnEmployees  
- Complaint status distribution  
- Monthly billing overview  

## 9. Technical Requirements
- **Frontend:** HTML, CSS, JavaScript (or React.js)  
- **Backend:** Node.js + Express  
- **Database:** MongoDB or MySQL  
- **API Format:** JSON REST APIs  

## 10. Output Requirements
The project output must include:

1. Full frontend code  
2. Full backend (Node.js) code  
3. API documentation  
4. Database schema:  
   - UnEmployees  
   - Quarters  
   - Allotments  
   - Complaints  
   - Billing  
5. Architecture diagram  
6. README.md  
7. UI screen designs  
8. Dashboard with charts  

## 11. Final Instruction to AI
Build this full system exactly as described above using the given modules, schema, and requirements.  
Generate production-ready code, APIs, database models, UI pages, dashboard charts, and installation guide.
