# Software Requirements Specification (SRS)

## InsureRight — Insurance Intermediary Management Platform

**Version:** 1.0
**Date:** 2026-06-28
**Prepared by:** K.M. Dastur & Co.

---

## 1. Introduction

### 1.1 Purpose

This document defines the software requirements for **InsureRight**, a web-based insurance intermediary management platform. The system enables insurance brokers to manage operators, customers, policies, campaigns, payments, and reconciliation workflows through a unified interface.

### 1.2 Scope

InsureRight covers the complete insurance distribution lifecycle:

- Broker and operator onboarding
- Customer acquisition and management
- Product catalogue and campaign management
- Policy issuance and premium collection
- Payment processing (online, NEFT, cheque)
- Reconciliation with insurance company data
- Refund management
- CRM and lead tracking
- Reporting and analytics

### 1.3 Intended Audience

- Broker administrators
- Sales and calling operators
- End customers (policyholders)
- Development and QA teams

### 1.4 Definitions & Abbreviations

| Term | Definition |
|------|-----------|
| Broker | Licensed insurance intermediary (IRDAI registered) |
| Operator | Sales or calling agent working under a broker |
| IC | Insurance Company (e.g., Star Health, HDFC ERGO) |
| KYC | Know Your Customer — identity verification |
| MIS | Management Information System |
| NEFT | National Electronic Funds Transfer |
| Order ID | Unique proposal identifier (format: PRO-2025-XXXX) |
| CRM | Customer Relationship Management |

---

## 2. Overall Description

### 2.1 System Architecture

InsureRight is a single-page application (SPA) built with React. The application uses:

- **React Router v6** for client-side routing with nested routes
- **React Context API** for global state management
- **Component-based UI** with a custom design system
- **Role-based access control** via ProtectedRoute and RoleGuard wrappers

### 2.2 User Roles

| Role | Description | Access Level |
|------|-------------|-------------|
| **Broker** | System administrator, insurance intermediary firm | Full access to all modules |
| **Operator (Calling)** | Calling agent who contacts leads and claims customers | CRM, own customers, own profile, policy issuance |
| **Operator (Sales)** | Sales agent who converts leads to policies | CRM, own customers, own profile, policy issuance |
| **Customer** | End consumer / policyholder | Own profile, own policies, buy insurance |

### 2.3 Authentication

- Email + password based login
- Mobile number based login (OTP flow)
- Role-based redirection after login:
  - Broker → Broker Portal
  - Operator → Operator Portal
  - Customer → Customer Portal

---

## 3. Functional Requirements

### 3.1 Dashboard Module

#### 3.1.1 Broker Portal
- **FR-DASH-01:** Display key metrics — Premium Collected, Policy Purchased, Total Customers, Total Operators
- **FR-DASH-02:** Campaign MIS section with campaign and association filters
- **FR-DASH-03:** Action bar showing Non-Engaged Customers, Policy Pending, Payment Pending, Payment Rejected counts with amounts
- **FR-DASH-04:** Funnel visualization (Engaged → Policy Pending → Payment Pending → Active)
- **FR-DASH-05:** Quick action buttons for common tasks (Add Customer, Add Operator, Add Campaign, Buy Policy)
- **FR-DASH-06:** Recent operators and customers lists
- **FR-DASH-07:** Clicking on action bar cards navigates to filtered customer/policy lists

#### 3.1.2 Operator Portal
- **FR-DASH-08:** Display operator-specific metrics (assigned customers, policies sold)
- **FR-DASH-09:** Quick links to CRM, customers, policy issuance

#### 3.1.3 Customer Portal
- **FR-DASH-10:** Display customer's active policies with status
- **FR-DASH-11:** Quick link to buy insurance

---

### 3.2 Operator Management

- **FR-OPR-01:** List all operators with search (name/mobile) and status filter (Active/Inactive)
- **FR-OPR-02:** Create new operator with fields — Name, Email, Mobile, DOB, Gender, PAN, Aadhaar, Operator Type (Sales/Calling), Qualification, Experience, Bank Account (Number, IFSC)
- **FR-OPR-03:** Edit operator profile and documents
- **FR-OPR-04:** View operator profile with all details
- **FR-OPR-05:** Commission rules management
- **FR-OPR-06:** Table with sticky header and scrollable data
- **FR-OPR-07:** Pagination support

---

### 3.3 Organisation Management

- **FR-ORG-01:** List all organisations with search (name) and status filter
- **FR-ORG-02:** Create new organisation with Name, Description, Active status
- **FR-ORG-03:** Edit organisation details
- **FR-ORG-04:** Table with sticky header, no ID column displayed

---

### 3.4 Association Management

- **FR-ASC-01:** List all associations with search (name/code/city), organisation filter, and status filter
- **FR-ASC-02:** Create new association with fields — Name, Organisation (parent), Association Code, Address (2 lines), City, State, PIN Code, Parent Association
- **FR-ASC-03:** Edit association details
- **FR-ASC-04:** Hierarchical association structure (parent/child)
- **FR-ASC-05:** Table with sticky header, no ID column displayed

---

### 3.5 Customer Management

- **FR-CUS-01:** List all customers with search (name/mobile), campaign filter, engagement filter, KYC status filter
- **FR-CUS-02:** Operator role sees only their assigned customers ("My Customers")
- **FR-CUS-03:** Create new customer with fields — Name, Mobile, Email, DOB, Gender, City, State, PIN Code, Organisation, Association, Campaign
- **FR-CUS-04:** Edit customer profile
- **FR-CUS-05:** **Customer 360 View** — comprehensive snapshot including:
  - Personal details
  - Family members (spouse, children with DOB, gender, pre-existing conditions)
  - Policy history
  - Payment history
  - Interaction timeline
- **FR-CUS-06:** **KYC Review** — verify/approve/reject customer KYC documents (PAN, Aadhaar)
- **FR-CUS-07:** Customer engagement tracking per campaign
- **FR-CUS-08:** Table with sticky header and scrollable data
- **FR-CUS-09:** Actions per customer — Buy Policy, 360° View, Edit

---

### 3.6 Product Management

- **FR-PRD-01:** Product catalogue listing with search and filters
- **FR-PRD-02:** Create product with fields — Name, Insurance Company, Policy Type (Base, Top-up, OPD, Payment Protection, Age Band Premium, Super Top Up), Sum Insured options
- **FR-PRD-03:** Premium chart configuration by sum insured, age bands, and family composition
- **FR-PRD-04:** Product benefits, coverage details, exclusions, disclaimers
- **FR-PRD-05:** Edit product details
- **FR-PRD-06:** Table with sticky header

---

### 3.7 Campaign Management

- **FR-CMP-01:** List all campaigns with search (name), status filter, open/closed filter
- **FR-CMP-02:** Create campaign with fields — Name, Start Date, End Date, Target Type (Customer/Operator), Open status
- **FR-CMP-03:** Assign operators and products to campaigns
- **FR-CMP-04:** Edit campaign details
- **FR-CMP-05:** Table with sticky header, no ID column displayed

---

### 3.8 Policy Issuance

- **FR-POL-01:** List all policies with filters — search (Order ID/customer/policy no), campaign, engagement, KYC status
- **FR-POL-02:** Column: Order ID (format PRO-2025-XXXX), Customer, Product, IC, Type, Premium, Payment Status, Mode, Pay Type, Status
- **FR-POL-03:** **Buy Policy Wizard** — multi-step purchase flow:
  - Step 1: Select customer
  - Step 2: Select product and coverage
  - Step 3: Select family members to cover
  - Step 4: Premium calculation and review
  - Step 5: Payment (online/offline)
- **FR-POL-04:** Policy status tracking (Active, Renewal Due, Lapsed)
- **FR-POL-05:** Download policy document (for active policies)
- **FR-POL-06:** "Pay Now" action for pending payments
- **FR-POL-07:** Mobile-responsive card view for smaller screens
- **FR-POL-08:** Table with sticky header

---

### 3.9 Update Payment

- **FR-PAY-01:** List offline payment records with search and filters
- **FR-PAY-02:** Display Order ID (PRO-2025-XXXX), Customer, Method, Amount, Date, Reference, Payment Status
- **FR-PAY-03:** Click on record to open payment detail drawer
- **FR-PAY-04:** Accept or reject payments with reason selection
- **FR-PAY-05:** Payment detail view showing customer info, product, campaign, bank details
- **FR-PAY-06:** Table with sticky header

---

### 3.10 Receive Cheque

- **FR-CHQ-01:** List cheque payment submissions with search (Order ID/customer/cheque no), status filter
- **FR-CHQ-02:** Display Order ID (PRO-2025-XXXX), Customer, Mobile, Cheque No, Bank, Amount, Submitted Date, Payment Status
- **FR-CHQ-03:** Click on record to open cheque detail drawer
- **FR-CHQ-04:** Accept or reject cheque with reason selection
- **FR-CHQ-05:** View cheque photo document
- **FR-CHQ-06:** Table with sticky header

---

### 3.11 Refund Management

- **FR-REF-01:** List all refund requests with search (Order ID/name/mobile) and status filter (Pending/Approved/Processed/Rejected)
- **FR-REF-02:** Display Order ID, Customer, Mobile, Product, IC, System Amount, Uploaded Amount, Refund Amount, Pay Type, Request Date, Status
- **FR-REF-03:** Refund entries are automatically created when "Accept & Refund" is clicked on the Reconciliation Compare & Match page (overpayment scenario)
- **FR-REF-04:** Refund status workflow: Pending → Approved → Processed (or Rejected)
- **FR-REF-05:** Data consistency — refund records reference the same Order ID (PRO-2025-XXXX) from the reconciliation system record
- **FR-REF-06:** Table with sticky header

---

### 3.12 Extract Payments

- **FR-EXT-01:** Bulk export of customer and payment data
- **FR-EXT-02:** CSV download with fields — Payment ID, Customer Name, Product, Campaign, Payment Method, Amount, Date, Status, Reference/Cheque No

---

### 3.13 CRM Module

- **FR-CRM-01:** Campaign lead tracking and operator performance dashboard
- **FR-CRM-02:** **Calling Operator View:**
  - View assigned campaigns
  - Unclaimed lead bucket — pick and claim leads
  - Claimed leads list with call logging
  - Log call responses (Connected, No Answer, Call Back Later, Not Interested, Interested)
  - Add comments per call
  - Assign interested leads to sales operators
- **FR-CRM-03:** **Sales Operator View:**
  - View campaigns with assigned leads
  - Track lead status (Interested → Purchased)
  - Log follow-up calls
- **FR-CRM-04:** **Broker View:**
  - Select operator to view their CRM data
  - Overview of all campaigns and lead performance
- **FR-CRM-05:** Call history tracking (up to 5 calls per lead with timestamps)
- **FR-CRM-06:** Lead purchase status tracking

---

### 3.14 Insurance Company (IC) Management

- **FR-IC-01:** List all insurance companies with search and status filter
- **FR-IC-02:** Create IC with fields — Name, Code, Branch, Contact Person, Email, Phone, Status
- **FR-IC-03:** Edit IC details
- **FR-IC-04:** **API Integration Configuration** — Base URL, API Key, API Secret for IC system connectivity
- **FR-IC-05:** Table with sticky header, no ID column displayed

---

### 3.15 Broker Management

- **FR-BRK-01:** List brokers with search and filters
- **FR-BRK-02:** Create/edit broker with fields — Name, Company, Broker Type (Individual/Corporate), IRDAI License (number, validity), PAN, Aadhaar, GST, KYC Status, Contact Details, Address, Bank Account, Agreement Dates, Compliance Notes
- **FR-BRK-03:** Broker profile view with all details

---

### 3.16 Reports

- **FR-RPT-01:** Operator performance reports with metrics per operator
- **FR-RPT-02:** Campaign analytics
- **FR-RPT-03:** Operator Name, Campaigns, Leads Assigned, Customers, Policies, Premium columns

---

### 3.17 Reconciliation

- **FR-REC-01:** Three-phase workflow: List → Upload → Review
- **FR-REC-02:** **List View:** Display all system payment records with filters (Campaign, Association, Pay Type)
- **FR-REC-03:** View records by payment type — All, Cheque (with bank/cheque details), NEFT (with bank/transaction details)
- **FR-REC-04:** **Upload:** Upload IC/external data file (CSV) for reconciliation
- **FR-REC-05:** **Review:** Three tabs after upload:
  - **Pending (Unmatched System Records)** — system records with no matching upload
  - **Matched Records** — side-by-side system vs uploaded comparison
  - **Unmatched Uploaded Records** — uploaded records with no system match
- **FR-REC-06:** **Match with Pending** — manually match unmatched uploaded records to pending system records:
  - Select a pending record to compare
  - Search and filter pending records
  - Pick a record to enter Compare & Match
- **FR-REC-07:** **Compare & Match** — side-by-side field comparison:
  - Match summary banner (matched/mismatched fields)
  - System (Pending) vs Uploaded (IC Data) detail rows
  - Cheque fields: Cheque Number, Cheque Date
  - NEFT fields: Transaction ID, NEFT Date
  - Premium amount comparison
  - Overpayment: "Please initiate a refund for the extra amount" — Accept & Refund button
  - Underpayment: "Please collect the remaining amount from the customer" — Accept with due amount
  - Reject with reason selection
- **FR-REC-08:** Accept & Refund automatically creates a refund entry in the Refund module
- **FR-REC-09:** **Transaction Detail Modal** — view full record details for matched records
- **FR-REC-10:** CSV export of reconciliation data
- **FR-REC-11:** All tables with sticky headers
- **FR-REC-12:** Column display — Order ID (PRO-2025-XXXX), Customer Name, Mobile, payment details, Campaign Name (no Payment Detail ID, Clearing Date, User ID, Policy No columns)

---

## 4. Data Entities

### 4.1 Customer

| Field | Type | Description |
|-------|------|-------------|
| id | Number | Unique identifier |
| name | String | Full name |
| mobile | String | Mobile number |
| email | String | Email address |
| dob | String | Date of birth |
| gender | String | Male/Female |
| city, state, pinCode | String | Address |
| kyc | String | Verified / Pending / Rejected |
| agentId | String | Assigned operator |
| organisationId | Number | Linked organisation |
| associationId | Number | Linked association |
| campaignId | Number | Enrolled campaign |
| campaignName | String | Campaign name |
| engaged | Boolean | Engagement status |
| policies | Number | Policy count |
| familyMembers | Array | Spouse, children details |

### 4.2 Policy

| Field | Type | Description |
|-------|------|-------------|
| id | Number | Unique identifier |
| proposalId | String | Order ID (PRO-2025-XXXX) |
| customerName | String | Customer name |
| product | String | Product name |
| icName | String | Insurance company |
| type | String | Health / Motor / Life / Travel |
| premium | Number | Premium amount |
| status | String | Active / Renewal Due / Lapsed |
| paymentStatus | String | Payment received / Pending / Failed |
| paymentMode | String | Online / Offline |
| paymentType | String | UPI / Gateway / NEFT / Cheque |
| startDate, endDate | String | Policy validity period |

### 4.3 Operator

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier |
| name | String | Full name |
| mobile, email | String | Contact details |
| agentType | String | sales / calling |
| status | String | Active / Inactive |
| panNumber, aadhaarNumber | String | Identity documents |
| bankAccountNo, ifscCode | String | Bank details |
| qualification, experience | String/Number | Professional details |

### 4.4 Organisation

| Field | Type | Description |
|-------|------|-------------|
| id | Number | Unique identifier |
| name | String | Organisation name |
| description | String | Description |
| isActive | Boolean | Status |

### 4.5 Association

| Field | Type | Description |
|-------|------|-------------|
| id | Number | Unique identifier |
| orgId | Number | Parent organisation |
| name | String | Association name |
| associationCode | String | Unique code |
| city, state, pinCode | String | Address |
| parentAssociationId | Number | Hierarchical parent |
| isActive | Boolean | Status |

### 4.6 Campaign

| Field | Type | Description |
|-------|------|-------------|
| id | Number | Unique identifier |
| name | String | Campaign name |
| startDate, endDate | String | Campaign period |
| isCampaignOpen | Boolean | Open/Closed status |
| isActive | Boolean | Active status |
| assignedAgents | Array | Operator IDs |
| assignedProducts | Array | Product IDs |

### 4.7 Insurance Company

| Field | Type | Description |
|-------|------|-------------|
| id | Number | Unique identifier |
| name | String | IC name |
| code | String | Short code |
| branch | String | Branch name |
| contact, email, phone | String | Contact details |
| apiBaseUrl, apiKey, apiSecret | String | Integration config |
| status | String | Active / Inactive |

### 4.8 Refund

| Field | Type | Description |
|-------|------|-------------|
| id | String | REF-XXX format |
| proposalId | String | Order ID (PRO-2025-XXXX) |
| customerName, mobile | String | Customer details |
| product, icName | String | Policy details |
| systemAmount | Number | Expected amount |
| uploadedAmount | Number | Received amount |
| refundAmount | Number | Difference to refund |
| paymentType | String | Cheque / NEFT |
| status | String | Pending / Approved / Processed / Rejected |
| requestDate | String | Date refund was raised |
| processedDate | String | Date refund was processed |

---

## 5. Non-Functional Requirements

### 5.1 Usability

- **NFR-01:** Responsive design — mobile card views for policy and customer lists on smaller screens
- **NFR-02:** Sticky table headers with scrollable data for all list pages
- **NFR-03:** Consistent UI design system with branded gradient (pink-to-purple)
- **NFR-04:** Sidebar navigation with collapsible/expandable modes and flyout menus
- **NFR-05:** Search and filter controls on all list pages with clear/reset functionality
- **NFR-06:** Pagination on all data tables

### 5.2 Performance

- **NFR-07:** Client-side filtering and pagination for fast interaction
- **NFR-08:** Lazy rendering of large datasets

### 5.3 Security

- **NFR-09:** Protected routes — unauthenticated users redirected to login
- **NFR-10:** Role-based access control — operators cannot access broker-only modules
- **NFR-11:** Role guard on routes prevents unauthorized access

### 5.4 Consistency

- **NFR-12:** Order ID format consistently displayed as PRO-2025-XXXX across all modules
- **NFR-13:** "Operator" terminology used consistently (not "Agent") across all screens
- **NFR-14:** Uniform table formatting — sticky headers, consistent column styling
- **NFR-15:** ID columns hidden from user-facing tables (Organisation, Association, Campaign, IC)

---

## 6. System Interfaces

### 6.1 Insurance Company API Integration

Each IC can be configured with:
- API Base URL
- API Key
- API Secret

Used for policy issuance, premium calculation, and data reconciliation.

### 6.2 File Upload

- CSV file upload for reconciliation data
- Document uploads for KYC (PAN, Aadhaar images)
- Cheque photo uploads

### 6.3 Data Export

- CSV export for payment extraction
- CSV export for reconciliation data

---

## 7. Appendix

### 7.1 Supported Insurance Companies

1. Star Health and Allied Insurance
2. HDFC ERGO General Insurance
3. ICICI Lombard General Insurance
4. Bajaj Allianz General Insurance
5. Niva Bupa Health Insurance
6. Care Health Insurance
7. Digit Insurance
8. Tata AIG General Insurance
9. Reliance General Insurance

### 7.2 Payment Methods

| Method | Type | Details |
|--------|------|---------|
| UPI | Online | Direct UPI payment |
| Gateway | Online | Payment gateway |
| NEFT | Offline | Bank transfer with transaction ID |
| Cheque | Offline | Physical cheque with cheque number, bank, date |

### 7.3 Policy Types

1. Base Policy
2. Top-up
3. OPD
4. Payment Protection
5. Age Band Premium
6. Super Top Up

### 7.4 KYC Statuses

- **Pending** — documents submitted, awaiting review
- **Verified** — documents approved
- **Rejected** — documents rejected, re-submission required
