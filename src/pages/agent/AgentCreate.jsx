import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Field,
  Input,
  Select,
  UploadBox,
  SectionBlock,
} from "../../components/Field";
import { AgentIcon } from "../../icons";

const DESIGNATIONS = [
  { value: "manager", label: "Manager" },
  { value: "team-lead", label: "Team Lead" },
  { value: "sales-operator", label: "Sales Operator" },
  { value: "calling-operator", label: "Calling Operator" },
];

const INITIAL = {
  firstName: "",
  middleName: "",
  lastName: "",
  dob: "",
  gender: "",
  designation: "",
  pan: "",
  aadhaar: "",
  photo: null,
  panFile: null,
  aadhaarFile: null,
  mobile: "",
  email: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

export default function AgentCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [photoPreview, setPhotoPreview] = useState(null);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  const setF = (f) => (e) =>
    setForm((p) => ({ ...p, [f]: e.target.files[0] ?? null }));

  useEffect(() => {
    if (form.photo instanceof File) {
      const url = URL.createObjectURL(form.photo);
      setPhotoPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPhotoPreview(null);
  }, [form.photo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = [form.firstName, form.middleName, form.lastName]
      .map((s) => s.trim())
      .filter(Boolean)
      .join(" ");
    console.log("Create employee:", { ...form, name });
    navigate("/agent");
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <span className="page-bar" />
          <div>
            <div className="page-title">Add Employee</div>
            <div className="page-subtitle">Register a new employee with KYC and contact details</div>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate("/agent")}>
          ← Back
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>

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
                <Field label="First Name" required>
                  <Input placeholder="Enter first name" value={form.firstName} onChange={set("firstName")} required />
                </Field>
                <Field label="Middle Name">
                  <Input placeholder="Enter middle name" value={form.middleName} onChange={set("middleName")} />
                </Field>
                <Field label="Last Name" required>
                  <Input placeholder="Enter last name" value={form.lastName} onChange={set("lastName")} required />
                </Field>
              </div>

              <div className="form-grid-3" style={{ marginBottom: 18 }}>
                <Field label="Date of Birth" required>
                  <Input type="date" value={form.dob} onChange={set("dob")} required />
                </Field>
                <Field label="Gender">
                  <Select value={form.gender} onChange={set("gender")}>
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </Select>
                </Field>
                <Field label="Designation / Role" required>
                  <Select value={form.designation} onChange={set("designation")} required>
                    <option value="">Select designation</option>
                    {DESIGNATIONS.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </Select>
                </Field>
              </div>

              <div className="form-grid-3" style={{ marginBottom: 18 }}>
                <Field label="PAN Number" required>
                  <Input placeholder="ABCDE1234F" value={form.pan} onChange={set("pan")} maxLength={10} required />
                </Field>
                <Field label="Aadhaar Number" required>
                  <Input placeholder="XXXX XXXX XXXX" value={form.aadhaar} onChange={set("aadhaar")} maxLength={14} required />
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
                <Field label="Mobile" required>
                  <Input type="tel" placeholder="+91 XXXXX XXXXX" value={form.mobile} onChange={set("mobile")} required />
                </Field>
                <Field label="Email" required>
                  <Input type="email" placeholder="employee@email.com" value={form.email} onChange={set("email")} required />
                </Field>
              </div>
              <div className="form-grid-3" style={{ marginBottom: 18 }}>
                <Field label="Address Line 1" required>
                  <Input placeholder="Street / Building" value={form.address1} onChange={set("address1")} required />
                </Field>
                <Field label="Address Line 2">
                  <Input placeholder="Area / Locality" value={form.address2} onChange={set("address2")} />
                </Field>
                <Field label="City" required>
                  <Input placeholder="City" value={form.city} onChange={set("city")} required />
                </Field>
              </div>
              <div className="form-grid-3">
                <Field label="State" required>
                  <Select value={form.state} onChange={set("state")} required>
                    <option value="">Select state</option>
                    {["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat", "Rajasthan", "Uttar Pradesh", "West Bengal"].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="PIN Code" required>
                  <Input placeholder="400001" maxLength={6} value={form.pincode} onChange={set("pincode")} required />
                </Field>
                <Field label="Country">
                  <Select value={form.country} onChange={set("country")}>
                    <option>India</option>
                  </Select>
                </Field>
              </div>
            </SectionBlock>

            <div className="actions-row">
              <button type="button" className="btn btn-ghost" onClick={() => navigate("/agent")}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Employee
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
