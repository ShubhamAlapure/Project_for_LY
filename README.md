# InternDocs 📄

> **"Generate. Preview. Print."**

**InternDocs** is a modern, student-centric internship document generation and database management system built with **React, Vite, Express, Supabase (PostgreSQL & Cloud Storage), and Vanilla CSS Print Layouts**. It enables university students to register their industrial training records, compute duration automatically, upload offer/completion letters, and generate official institutional documents (Undertaking & NOC) formatted to exact A4 standards.

---

## 🌟 Key Features

1. **Supabase Database & Cloud Storage Integration**:
   - Stores complete student internship records with all **17 mandatory institutional fields**.
   - Cloud file uploads for **Valid Offer Letter** and **Internship Completion Letter** with instant preview links.
   - Resilient multi-tier architecture: Direct Supabase client + Express Backend API + Local Offline Caching.
2. **Interactive Student Submission Form (17 Fields)**:
   - **Academic & Contact**: Date of Submission, Email ID, Contact No, Enrolment No, Full Name, Gender, Specialization, Semester.
   - **Company & Internship**: Name of Company + City, Domain, Source of Internship, Mode (Offline/Hybrid/Online), Offer/PPO status.
   - **Tenure & Auto Duration**: Start Date, End Date, and **Automatic Duration Calculation** (e.g. `6 Months (176 Days)`).
   - **Document Dropzones**: Drag-and-drop file upload for Offer Letter and Completion Certificate.
3. **Student Records Management Dashboard**:
   - Live search across student name, enrollment, email, company, and domain.
   - Multi-field filtering by Branch, Semester, Mode, and PPO status.
   - Instant 1-click **"Generate Undertaking"** and **"Generate NOC"** prefilled directly from any database record.
   - CSV / Excel Export for departmental record-keeping and audit.
   - Quick Modal to attach post-internship Completion Certificates.
4. **Document Selection Catalog**: Interactive catalog with document categories, estimated completion times, tags, and search/filters.
5. **Accurate Institutional Templates**:
   - **Document 1: Internship Undertaking** — Letterhead, Clauses I through IX, Student details, Company profile, Candidate & Mentor signatures, and Institutional footer.
   - **Document 2: No Objection Certificate (NOC)** — University letterhead, Reference Dispatch Number, Certification paragraph, Company HR recipient, 3 Authorized Signatories (Internship Head, HOD, Director), and Official Seal area.
6. **Realistic A4 Viewport Simulator**:
   - Exact A4 paper dimensions (`210mm × 297mm`).
   - Zoom controls (`Fit Width`, `75%`, `100%`, `125%`, `Reset`).
7. **1-Click High-Quality PDF & Browser Printing**:
   - Direct high-resolution PDF download using `html2pdf.js` with crisp vector rendering.
   - Native `window.print()` support via a dedicated `print.css` that strips all navigation and application chrome.
8. **Instant Testing with Sample Data**:
   - 1-Click **"Load Sample Data"** on all forms for instant testing.

---

## 🛠️ Tech Stack

- **Frontend**:
  - [React 18](https://react.dev/)
  - [Vite 6](https://vitejs.dev/)
  - Modern Vanilla CSS with CSS Custom Properties & Glassmorphism
  - [Lucide React](https://lucide.dev/) (Modern UI Icons)
  - `html2pdf.js` for client-side vector PDF generation
- **Backend**:
  - [Node.js](https://nodejs.org/)
  - [Express.js](https://expressjs.com/)
  - REST API for template configuration, sample datasets, and schema validation

---

## 📁 Project Structure

```text
Project for LY/
├── client/
│   ├── index.html                   # HTML entry with institutional fonts
│   ├── vite.config.js               # Vite config with API proxy to port 5001
│   ├── package.json
│   └── src/
│       ├── main.jsx                 # Client entry point
│       ├── App.jsx                  # State router & page manager
│       ├── index.css                # Modern design system & token definitions
│       ├── print.css                # Dedicated strict @media print styles
│       ├── data/
│       │   ├── documentsConfig.js   # Extensible document registry
│       │   └── sampleData.js        # Realistic test datasets
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.jsx       # Header navigation bar
│       │   │   └── Footer.jsx       # Footer with compliance info
│       │   ├── common/
│       │   │   ├── FormInput.jsx    # Accessible form input with errors
│       │   │   ├── FormSelect.jsx   # Select dropdown
│       │   │   ├── FormTextarea.jsx # Multi-line input
│       │   │   ├── StepIndicator.jsx# 3-step progress bar
│       │   │   └── Toast.jsx        # Notification alert
│       │   └── preview/
│       │       ├── A4Container.jsx  # Scalable A4 paper sheet simulator
│       │       └── PreviewControls.jsx # Download, Print, and Edit action panel
│       ├── templates/
│       │   ├── DocumentHeaderFooter.jsx # Reusable letterhead and footer
│       │   ├── UndertakingTemplate.jsx  # A4 Undertaking document format
│       │   └── NOCTemplate.jsx          # A4 NOC document format
│       ├── pages/
│       │   ├── HomePage.jsx             # Hero, metrics, and cards
│       │   ├── DocumentSelectionPage.jsx# Searchable template catalog
│       │   ├── UndertakingFormPage.jsx  # Undertaking form
│       │   ├── NOCFormPage.jsx          # NOC form
│       │   └── DocumentPreviewPage.jsx  # Split-screen preview & actions
│       └── utils/
│           ├── pdfGenerator.js      # html2pdf engine with error fallback
│           ├── storage.js           # localStorage persistence helper
│           └── validation.js        # Input and date validation
├── server/
│   ├── package.json
│   └── server.js                    # Express API (Health, Configs, Sample Data)
├── package.json                     # Root orchestrator scripts
└── README.md
```

---

## 🚀 Installation & Running Locally

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Quick Start (Run Both Client & Server Concurrently)

From the root directory (`Project for LY/`):

```bash
# Install all dependencies (root, client, and server)
npm run install:all

# Start both backend server (port 5001) and frontend client (port 3000) concurrently
npm run dev
```

The application will be accessible at: **`http://localhost:3000`**
The backend API runs at: **`http://localhost:5001`**

---

### 2. Running Services Individually

#### Frontend (Client)
```bash
cd client
npm install
npm run dev
```

#### Backend (Server)
```bash
cd server
npm install
npm run dev
```

---

## 🧪 Testing the Application (Sample Data)

1. Open `http://localhost:3000` in your browser.
2. Click **"Generate Document"** or navigate to **"Documents"**.
3. Choose **"Internship Undertaking"** or **"Internship NOC"**.
4. Click the **"Load Sample Data"** button at the top right of the form.
5. Review the pre-populated fields and click **"Preview Document"**.
6. On the Preview page:
   - Click **"Download PDF"** to test local PDF generation.
   - Click **"Print Document"** to inspect the print layout dialog.
   - Click **"Edit Details"** to verify that state is preserved.

---

## ➕ How to Add a New Document Template

InternDocs is designed to be easily extensible. Follow these 3 steps to add a new document (e.g. *Bonafide Certificate*):

### Step 1: Register Document Configuration
Open `client/src/data/documentsConfig.js` and add your document entry:
```javascript
{
  id: "bonafide",
  code: "DOC-MIT-BON-04",
  name: "Bonafide Student Certificate",
  shortTitle: "Bonafide Certificate",
  category: "Student Identity Verification",
  description: "Institutional bonafide certificate for industrial onboarding.",
  route: "/form/bonafide",
  badge: "Active Template",
  iconName: "BadgeCheck",
  tags: ["Bonafide", "Verification"],
  estimatedTime: "2 mins",
  availableFormats: ["A4 Letterhead", "PDF Download"]
}
```

### Step 2: Create Template Component
Create `client/src/templates/BonafideTemplate.jsx`:
```jsx
import React from 'react';
import { DocumentHeader, DocumentFooter } from './DocumentHeaderFooter';

export const BonafideTemplate = ({ data = {} }) => {
  return (
    <div className="a4-document-paper" id="bonafide-document">
      <DocumentHeader 
        universityName={data.universityName}
        schoolName={data.schoolName}
      />
      <div className="doc-main-title">BONAFIDE CERTIFICATE</div>
      <p className="doc-body-paragraph">
        This is to certify that {data.studentName} is a bonafide student...
      </p>
      <DocumentFooter />
    </div>
  );
};
```

### Step 3: Register in DocumentPreviewPage
Import `BonafideTemplate` in `DocumentPreviewPage.jsx` and render it inside `A4Container` when `docType === 'bonafide'`.

---

## 🔒 Privacy & Compliance Guarantee

- **Zero Data Tracking**: No student names, roll numbers, or contact details are sent to external databases or third-party cloud services.
- **Client-Side Processing**: Document rendering and PDF compilation occur directly within the user's browser.

---

## 📄 License

This project is open-source and available under the **MIT License**.
