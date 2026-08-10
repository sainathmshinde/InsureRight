import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Field,
  Input,
  DateInput,
  Select,
  UploadBox,
  SectionBlock,
} from "../../components/Field";
import { AgentIcon, EditIcon } from "../../icons";
import { AGENT_MAP } from "./agentData";
import { useAuth } from "../../context/AuthContext";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useToast } from "../../context/ToastContext";

const DESIGNATIONS = [
  { value: "manager", label: "Manager" },
  { value: "team-lead", label: "Team Lead" },
  { value: "sales-operator", label: "Sales Operator" },
  { value: "calling-operator", label: "Calling Operator" },
];

// Legacy mock data stores designation under `agentType` with shorter values —
// map those onto the Add Employee form's `designation` values so both forms
// share the exact same field name and option set.
const AGENT_TYPE_TO_DESIGNATION = {
  manager: "manager",
  "team-lead": "team-lead",
  sales: "sales-operator",
  calling: "calling-operator",
};

function splitName(full) {
  const parts = (full || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", middleName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], middleName: "", lastName: "" };
  if (parts.length === 2) return { firstName: parts[0], middleName: "", lastName: parts[1] };
  return { firstName: parts[0], middleName: parts.slice(1, -1).join(" "), lastName: parts[parts.length - 1] };
}

function agentToInitial(agent) {
  if (!agent) return {};
  return {
    ...splitName(agent.name),
    dob: agent.dob || "",
    gender: agent.gender || "",
    designation: AGENT_TYPE_TO_DESIGNATION[agent.agentType] ?? agent.agentType ?? "",
    pan: agent.pan || "",
    aadhaar: agent.aadhaar || "",
    photo: agent.photo || null,
    panFile: agent.panFile || null,
    aadhaarFile: agent.aadhaarFile || null,
    mobile: agent.mobile || "",
    email: agent.email || "",
    address1: agent.address1 || "",
    address2: agent.address2 || "",
    city: agent.city || "",
    state: agent.state || "",
    pincode: agent.pincode || "",
    country: agent.country || "India",
  };
}

export default function AgentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const isProfile = !id;

  // For profile: load full agent record (with doc URLs) then overlay live auth user fields
  const profileAgent = isProfile
    ? (Object.values(AGENT_MAP).find((a) => a.email === user?.email) ??
      Object.values(AGENT_MAP).find((a) => a.name === user?.name) ??
      AGENT_MAP[2])
    : null;

  const initial = isProfile
    ? {
        ...agentToInitial(profileAgent),
        ...splitName(user?.name || profileAgent?.name || ""),
        mobile: user?.phone || profileAgent?.mobile || "",
        email: user?.email || profileAgent?.email || "",
      }
    : agentToInitial(AGENT_MAP[Number(id)]);

  const [form, setForm] = useState(initial);
  const [photoPreview, setPhotoPreview] = useState(typeof initial.photo === "string" ? initial.photo : null);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  const setF = (f) => (e) =>
    setForm((p) => ({ ...p, [f]: e.target.files[0] ?? null }));

  const fv = useFormValidation(form, {
    firstName: { required: true, label: "First Name" },
    lastName: { required: true, label: "Last Name" },
    dob: { required: true, label: "Date of Birth" },
    designation: { required: true, label: "Designation" },
    pan: { required: true, label: "PAN Number" },
    aadhaar: { required: true, label: "Aadhaar Number" },
    mobile: { required: true, label: "Mobile" },
    email: { required: true, label: "Email" },
    address1: { required: true, label: "Address Line 1" },
    city: { required: true, label: "City" },
    state: { required: true, label: "State" },
    pincode: { required: true, label: "PIN Code" },
  });

  useEffect(() => {
    if (form.photo instanceof File) {
      const url = URL.createObjectURL(form.photo);
      setPhotoPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPhotoPreview(typeof form.photo === "string" ? form.photo : null);
  }, [form.photo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fv.validateAll()) {
      toast.error("Please fix the highlighted fields before continuing.");
      return;
    }
    const name = [form.firstName, form.middleName, form.lastName]
      .map((s) => (s || "").trim())
      .filter(Boolean)
      .join(" ");
    console.log(isProfile ? "Update agent profile:" : "Update agent:", { ...form, name });
    toast.success(isProfile ? "Profile updated successfully." : "Employee updated successfully.");
    navigate(isProfile ? "/profile" : "/agent");
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon">
            <EditIcon />
          </div>
          <div>
            <div className="page-title">
              {isProfile ? "Edit My Profile" : "Edit Employee"}
            </div>
            <div className="page-subtitle">
              {isProfile
                ? "Update your contact and professional details"
                : "Update employee profile and documents"}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {isProfile && (
            <button
              className="btn btn-ghost"
              onClick={() => navigate("/profile")}
            >
              ← Profile
            </button>
          )}
          <button
            className="btn btn-ghost"
            onClick={() => navigate(isProfile ? "/dashboard" : "/agent")}
          >
            {isProfile ? "← Dashboard" : "← Back"}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate>

            <SectionBlock icon={<AgentIcon />} title="Employee KYC">
              {/* Profile photo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingBottom: 18, borderBottom: '1px solid var(--border)', marginBottom: 18 }}>
                <div style={{
                  width: 90, height: 90, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--brand-light)', border: '2.5px dashed var(--brand)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                }}>
                  {photoPreview
                    ? <img src={photoPreview} alt="Employee" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: 38, lineHeight: 1 }}>👤</span>
                  }
                </div>
                <div>
                  <label style={{ cursor: 'pointer', display: 'inline-block' }}>
                    <input type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => setForm(p => ({ ...p, photo: e.target.files[0] ?? null }))} />
                    <span className="btn btn-secondary" style={{ pointerEvents: 'none' }}>
                      {photoPreview ? '🔄 Change Photo' : '📷 Upload Photo'}
                    </span>
                  </label>
                  {form.photo && (
                    <button type="button" className="btn btn-ghost" style={{ marginLeft: 8 }}
                      onClick={() => setForm(p => ({ ...p, photo: null }))}>
                      Remove
                    </button>
                  )}
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>JPG or PNG · Max 2 MB</div>
                </div>
              </div>

              <div className="form-grid-3" style={{ marginBottom: 18 }}>
                <Field label="First Name" required error={fv.fieldProps("firstName").error}>
                  <Input placeholder="Enter first name" value={form.firstName || ""} onChange={set("firstName")} required {...fv.fieldProps("firstName")} />
                </Field>
                <Field label="Middle Name">
                  <Input placeholder="Enter middle name" value={form.middleName || ""} onChange={set("middleName")} />
                </Field>
                <Field label="Last Name" required error={fv.fieldProps("lastName").error}>
                  <Input placeholder="Enter last name" value={form.lastName || ""} onChange={set("lastName")} required {...fv.fieldProps("lastName")} />
                </Field>
              </div>

              <div className="form-grid-3" style={{ marginBottom: 18 }}>
                <Field label="Date of Birth" required error={fv.fieldProps("dob").error}>
                  <DateInput value={form.dob || ""} onChange={set("dob")} required {...fv.fieldProps("dob")} />
                </Field>
                <Field label="Gender">
                  <Select value={form.gender || ""} onChange={set("gender")}>
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </Select>
                </Field>
                <Field label="Designation / Role" required error={fv.fieldProps("designation").error}>
                  <Select value={form.designation || ""} onChange={set("designation")} required {...fv.fieldProps("designation")}>
                    <option value="">Select designation</option>
                    {DESIGNATIONS.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </Select>
                </Field>
              </div>

              <div className="form-grid-3" style={{ marginBottom: 18 }}>
                <Field label="PAN Number" required error={fv.fieldProps("pan").error}>
                  <Input placeholder="ABCDE1234F" value={form.pan || ""} onChange={set("pan")} maxLength={10} required {...fv.fieldProps("pan")} />
                </Field>
                <Field label="Aadhaar Number" required error={fv.fieldProps("aadhaar").error}>
                  <Input placeholder="XXXX XXXX XXXX" value={form.aadhaar || ""} onChange={set("aadhaar")} maxLength={14} required {...fv.fieldProps("aadhaar")} />
                </Field>
              </div>

              <div className="form-grid-3">
                <Field label="Upload PAN Card">
                  <UploadBox label="Upload PAN card" hint="JPG, PNG or PDF" onChange={setF("panFile")} />
                </Field>
                <Field label="Upload Aadhaar">
                  <UploadBox label="Upload Aadhaar" hint="JPG, PNG or PDF" onChange={setF("aadhaarFile")} />
                </Field>
              </div>
            </SectionBlock>

            <SectionBlock icon="📞" title="Contact Details">
              <div className="form-grid-3" style={{ marginBottom: 18 }}>
                <Field label="Mobile" required error={fv.fieldProps("mobile").error}>
                  <Input type="tel" placeholder="+91 XXXXX XXXXX" value={form.mobile || ""} onChange={set("mobile")} required {...fv.fieldProps("mobile")} />
                </Field>
                <Field label="Email" required error={fv.fieldProps("email").error}>
                  <Input type="email" placeholder="employee@email.com" value={form.email || ""} onChange={set("email")} required {...fv.fieldProps("email")} />
                </Field>
              </div>
              <div className="form-grid-3" style={{ marginBottom: 18 }}>
                <Field label="Address Line 1" required error={fv.fieldProps("address1").error}>
                  <Input placeholder="Street / Building" value={form.address1 || ""} onChange={set("address1")} required {...fv.fieldProps("address1")} />
                </Field>
                <Field label="Address Line 2">
                  <Input placeholder="Area / Locality" value={form.address2 || ""} onChange={set("address2")} />
                </Field>
                <Field label="City" required error={fv.fieldProps("city").error}>
                  <Input placeholder="City" value={form.city || ""} onChange={set("city")} required {...fv.fieldProps("city")} />
                </Field>
              </div>
              <div className="form-grid-3">
                <Field label="State" required error={fv.fieldProps("state").error}>
                  <Select value={form.state || ""} onChange={set("state")} required {...fv.fieldProps("state")}>
                    <option value="">Select state</option>
                    {["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat", "Rajasthan", "Uttar Pradesh", "West Bengal"].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="PIN Code" required error={fv.fieldProps("pincode").error}>
                  <Input placeholder="400001" maxLength={6} value={form.pincode || ""} onChange={set("pincode")} required {...fv.fieldProps("pincode")} />
                </Field>
                <Field label="Country">
                  <Select value={form.country || "India"} onChange={set("country")}>
                    <option>India</option>
                  </Select>
                </Field>
              </div>
            </SectionBlock>

            <div className="actions-row">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate(isProfile ? "/profile" : "/agent")}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {isProfile ? "Save Profile" : "Update Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
