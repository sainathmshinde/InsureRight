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

// Map existing agentType values to the new designation keys used in AgentCreate
const TYPE_TO_DESIG = {
  "sales-manager": "manager",
  "leader":        "team-lead",
  "sales":         "sales-operator",
  "calling":       "calling-operator",
};

// Derive employees from the real OPERATORS mock data
export const EMPLOYEES = OPERATORS
  .filter(op => TYPE_TO_DESIG[op.agentType])
  .map(op => ({
    id:          op.id,
    name:        op.name,
    designation: TYPE_TO_DESIG[op.agentType],
  }));

// id:4  Kavita Sharma  → manager
// id:8  Priya Menon    → manager
// id:3  Suresh Nair    → team-lead
// id:10 Neha Gupta     → team-lead
// id:1  Ravi Kulkarni  → sales-operator
// id:5  Amit Verma     → sales-operator
// id:7  Rahul Singh    → sales-operator
// id:11 Ajay Tiwari    → sales-operator
// id:2  Pooja Desai    → calling-operator
// id:6  Sneha Patil    → calling-operator
// id:9  Kiran Reddy    → calling-operator
// id:12 Divya Iyer     → calling-operator

export const EMP_MAP = Object.fromEntries(EMPLOYEES.map(e => [e.id, e]));

let _nextId = 6;

// Module-level store — persists across route navigations within the session
export const hierarchyRules = [
  { id: 1, reportingDesig: "manager",        reportingEmpId: 4,  reporteeDesig: "team-lead",        reporteeEmpIds: [3, 10] },
  { id: 2, reportingDesig: "team-lead",      reportingEmpId: 3,  reporteeDesig: "sales-operator",   reporteeEmpIds: [1, 5]  },
  { id: 3, reportingDesig: "sales-operator", reportingEmpId: 1,  reporteeDesig: "calling-operator", reporteeEmpIds: [2, 6]  },
  { id: 4, reportingDesig: "team-lead",      reportingEmpId: 10, reporteeDesig: "calling-operator", reporteeEmpIds: [9, 12] },
  { id: 5, reportingDesig: "manager",        reportingEmpId: 8,  reporteeDesig: "calling-operator", reporteeEmpIds: [9]     },
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
