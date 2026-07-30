# LendSwift: Multi-Step Loan Application Form

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-blue?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/React_Hook_Form-7.x-ec5990?style=flat-square&logo=reacthookform" alt="React Hook Form">
  <img src="https://img.shields.io/badge/Zod-3.x-3e67b1?style=flat-square&logo=zod" alt="Zod">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38b2ac?style=flat-square&logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/State-Zustand-orange?style=flat-square" alt="Zustand">
  <img src="https://img.shields.io/badge/Status-Completed-brightgreen?style=flat-square" alt="Status">
</p>

## 📋 Project Overview
A production-grade, 8-step multi-step loan application form designed for a simulated Indian fintech NBFC (LendSwift). This application handles three distinct loan types (Personal, Home, Business) with divergent field requirements, full RBI-compliant KYC verification simulation, and persistent state management.

## ✨ Key Features

*   **8-Step Wizard Architecture:** Dynamic step routing with automatic skipping based on loan type and amount.
*   **Complex Validation Logic:** Cross-step dependencies (e.g., Employment type in Step 5 determines document requirements in Step 7).
*   **Indian KYC Compliance:** Simulated PAN (entity type validation) and Aadhaar (Verhoeff checksum) verification with 1.5s mock API delay and visual verification badges.
*   **Address Autocomplete:** PIN code lookup that auto-fills City, State, and Post Office using a static Indian dataset.
*   **Document Upload & Compression:** Drag-and-drop support with client-side Canvas image compression (up to 80% size reduction) and preview generation.
*   **E-Signature Capture:** Responsive touch/mouse canvas for capturing legally binding signatures.
*   **Encrypted Auto-Save:** AES-256-GCM encryption using the Web Crypto API for LocalStorage persistence every 30 seconds with a 72-hour TTL and "Resume/Start Fresh" recovery modal.
*   **Pre-Approval Summary:** Automated EMI calculation (Reducing Balance Method) with Indian number formatting (₹10,50,000) and four RBI-compliant consent checkboxes.

## 🛠️ Technology Stack

*   **Frontend Framework:** React 18 (Vite)
*   **Form Management:** React Hook Form
*   **Validation:** Zod (`@hookform/resolvers`)
*   **State Management:** Zustand (Global) + React Hook Form (Local step state)
*   **Styling:** Tailwind CSS (Utility-first, Responsive)
*   **File Upload:** React Dropzone
*   **E-Signature:** React Signature Canvas
*   **Security:** Web Crypto API (AES-256-GCM)
*   **Testing:** Cypress (E2E)



## 🚀 Getting Started

**Prerequisites:**
*   Node.js (v18+)
*   npm or yarn

**Installation:**
1.  Clone the repository:
    ```bash
    git clone https://github.com/barakacodes/Front-End-Developer-Multi-Step-Loan-Application-Form.git
