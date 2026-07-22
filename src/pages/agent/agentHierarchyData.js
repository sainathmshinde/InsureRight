import { OPERATORS } from "./agentData";

export const DESIGNATIONS = [
  { value: "manager",          label: "Manager" },
  { value: "team-lead",        label: "Team Lead" },
  { value: "sales-operator",   label: "Sales Operator" },
  { value: "calling-operator", label: "Calling Operator" },
];

export const DESIG_LABEL = Object.fromEntries(DESIGNATIONS.map(d => [d.value, d.label]));

export const DESIG_META = {
  "manager":          { color: "#7c3aed", bg: "#f3e8ff", border: "#c4b5fd" },
  "team-lead":        { color: "#b45309", bg: "#fffbeb", border: "#fcd34d" },
  "sales-operator":   { color: "#15803d", bg: "#dcfce7", border: "#86efac" },
  "calling-operator": { color: "#1565d8", bg: "#e7f0fc", border: "#7dd3fc" },
};

// Maps every agentType value used in agentData.js → unified designation key
const TYPE_TO_DESIG = {
  "manager":       "manager",
  "sales-manager": "manager",
  "team-lead":     "team-lead",
  "leader":        "team-lead",
  "sales":         "sales-operator",
  "sales-operator":"sales-operator",
  "calling":       "calling-operator",
  "calling-operator":"calling-operator",
};

// All 12 employees derived from agentData.js:
//  id:4  Kavita Sharma   → manager
//  id:8  Priya Menon     → manager
//  id:3  Suresh Nair     → team-lead
//  id:10 Neha Gupta      → team-lead
//  id:1  Ravi Kulkarni   → sales-operator
//  id:5  Amit Verma      → sales-operator
//  id:7  Rahul Singh     → sales-operator
//  id:11 Ajay Tiwari     → sales-operator
//  id:2  Pooja Desai     → calling-operator
//  id:6  Sneha Patil     → calling-operator
//  id:9  Kiran Reddy     → calling-operator
//  id:12 Divya Iyer      → calling-operator
export const EMPLOYEES = OPERATORS
  .filter(op => TYPE_TO_DESIG[op.agentType])
  .map(op => ({
    id:          op.id,
    name:        op.name,
    designation: TYPE_TO_DESIG[op.agentType],
  }));

export const EMP_MAP = Object.fromEntries(EMPLOYEES.map(e => [e.id, e]));

let _nextId = 6;

// Pre-seeded rules that reflect a realistic org chain:
//
//  Kavita Sharma (Manager)
//    └─ Suresh Nair, Neha Gupta  (Team Leads)
//         ├─ Suresh → Ravi Kulkarni, Amit Verma  (Sales Operators)
//         │      └─ Ravi → Pooja Desai, Sneha Patil  (Calling Operators)
//         └─ Neha  → Kiran Reddy, Divya Iyer  (Calling Operators)
//
//  Priya Menon (Manager)
//    └─ Rahul Singh, Ajay Tiwari  (Sales Operators)
//
export const hierarchyRules = [
  // Manager → Team Leads
  {
    id: 1,
    reportingDesig: "manager",
    reportingEmpId: 4,           // Kavita Sharma
    reporteeDesig:  "team-lead",
    reporteeEmpIds: [3, 10],     // Suresh Nair, Neha Gupta
  },
  // Manager → Sales Operators (Priya's direct reports)
  {
    id: 2,
    reportingDesig: "manager",
    reportingEmpId: 8,           // Priya Menon
    reporteeDesig:  "sales-operator",
    reporteeEmpIds: [7, 11],     // Rahul Singh, Ajay Tiwari
  },
  // Team Lead → Sales Operators
  {
    id: 3,
    reportingDesig: "team-lead",
    reportingEmpId: 3,           // Suresh Nair
    reporteeDesig:  "sales-operator",
    reporteeEmpIds: [1, 5],      // Ravi Kulkarni, Amit Verma
  },
  // Team Lead → Calling Operators
  {
    id: 4,
    reportingDesig: "team-lead",
    reportingEmpId: 10,          // Neha Gupta
    reporteeDesig:  "calling-operator",
    reporteeEmpIds: [9, 12],     // Kiran Reddy, Divya Iyer
  },
  // Sales Operator → Calling Operators
  {
    id: 5,
    reportingDesig: "sales-operator",
    reportingEmpId: 1,           // Ravi Kulkarni
    reporteeDesig:  "calling-operator",
    reporteeEmpIds: [2, 6],      // Pooja Desai, Sneha Patil
  },
];

export function addHierarchyRule(data) {
  hierarchyRules.push({ id: _nextId++, ...data });
}

export function updateHierarchyRule(id, data) {
  const idx = hierarchyRules.findIndex(r => r.id === id);
  if (idx >= 0) hierarchyRules[idx] = { ...hierarchyRules[idx], ...data };
}

export function deleteHierarchyRule(id) {
  const idx = hierarchyRules.findIndex(r => r.id === id);
  if (idx >= 0) hierarchyRules.splice(idx, 1);
}

export function getHierarchyRule(id) {
  return hierarchyRules.find(r => r.id === id);
}
