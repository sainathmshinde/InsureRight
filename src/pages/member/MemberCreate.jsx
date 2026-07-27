import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Field,
  Input,
  DateInput,
  Select,
  UploadBox,
  SectionBlock,
} from "../../components/Field";
import { MemberIcon } from "../../icons";
import { ORGANISATIONS, ASSOCIATIONS } from "./orgAssocData";

const INITIAL = {
  firstName: "",
  middleName: "",
  lastName: "",
  empId: "",
  mobile: "",
  email: "",
  dob: "",
  gender: "",
  organisationId: "",
  associationId: "",
  photoFile: null,
  aadhaarFile: null,
  panFile: null,
  address1: "",
  address2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

const MOCK_OCR = {
  aadhaar: {
    firstName: "Rajesh", lastName: "Kumar",
    dob: "1988-04-12", gender: "Male",
    address1: "24, Shivaji Park, Dadar", city: "Mumbai", state: "Maharashtra", pincode: "400028",
  },
  pan: {
    firstName: "Rajesh", lastName: "Kumar",
    dob: "1988-04-12", gender: "Male",
  },
};

export default function MemberCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [kycFetching, setKycFetching] = useState(null);
  const [kycFetched, setKycFetched] = useState(null);

  const [photoPreview, setPhotoPreview] = useState(null)
  useEffect(() => {
    if (form.photoFile instanceof File) {
      const url = URL.createObjectURL(form.photoFile)
      setPhotoPreview(url)
      return () => URL.revokeObjectURL(url)
    }
    setPhotoPreview(null)
  }, [form.photoFile])

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  const setF = (f) => (e) => {
    setForm((p) => ({ ...p, [f]: e.target.files[0] ?? null }));
    setKycFetched(null);
  };

  const fetchFromDoc = (docType) => {
    setKycFetching(docType);
    setTimeout(() => {
      setForm((p) => ({ ...p, ...MOCK_OCR[docType] }));
      setKycFetching(null);
      setKycFetched(docType);
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = [form.firstName, form.middleName, form.lastName]
      .map((s) => s.trim())
      .filter(Boolean)
      .join(" ");
    console.log("Create member:", { ...form, name });
    navigate("/member");
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <span className="page-bar" />
          <div>
            <div className="page-title">Add Member</div>
            <div className="page-subtitle">
              Onboard a new member with KYC and family details
            </div>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate("/member")}>
          ← Back
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* KYC — FIRST */}
            <SectionBlock icon="🪪" title="KYC">
              {kycFetched && (
                <div style={{
                  background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 8,
                  padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 13.5, color: '#166534',
                }}>
                  ✅ Info auto-filled from {kycFetched === 'aadhaar' ? 'Aadhaar' : 'PAN'} — please review and confirm below.
                </div>
              )}
              <div className="form-grid-3">
                <Field label="Upload Aadhaar (Auto fetch info)">
                  <UploadBox
                    label="Upload Aadhaar card"
                    hint="JPG, PNG or PDF — info auto-filled"
                    onChange={setF("aadhaarFile")}
                  />
                  {form.aadhaarFile && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ marginTop: 8, width: '100%' }}
                      onClick={() => fetchFromDoc('aadhaar')}
                      disabled={kycFetching !== null}
                    >
                      {kycFetching === 'aadhaar' ? '⏳ Fetching info…' : '🔍 Get Info from Aadhaar'}
                    </button>
                  )}
                </Field>
                <Field label="Upload PAN">
                  <UploadBox
                    label="Upload PAN card"
                    hint="JPG, PNG or PDF"
                    onChange={setF("panFile")}
                  />
                  {/* {form.panFile && (
                    // <button
                    //   type="button"
                    //   className="btn btn-secondary"
                    //   style={{ marginTop: 8, width: '100%' }}
                    //   onClick={() => fetchFromDoc('pan')}
                    //   disabled={kycFetching !== null}
                    // >
                    //   {kycFetching === 'pan' ? '⏳ Fetching details…' : '🔍 Get Details from PAN'}
                    // </button>
                  )} */}
                </Field>
              </div>
            </SectionBlock>

            {/* Basic Info */}
            <SectionBlock icon={<MemberIcon />} title="Basic Information">
              {/* Photo upload */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingBottom: 18, borderBottom: '1px solid var(--border)', marginBottom: 18 }}>
                <div style={{
                  width: 90, height: 90, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--brand-light)', border: '2.5px dashed var(--brand)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                }}>
                  {photoPreview
                    ? <img src={photoPreview} alt="Member" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: 38, lineHeight: 1 }}>👤</span>
                  }
                </div>
                <div>
                  <label style={{ cursor: 'pointer', display: 'inline-block' }}>
                    <input type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => setForm(p => ({ ...p, photoFile: e.target.files[0] ?? null }))} />
                    <span className="btn btn-secondary" style={{ pointerEvents: 'none' }}>
                      {photoPreview ? '🔄 Change Photo' : '📷 Upload Photo'}
                    </span>
                  </label>
                  {form.photoFile && (
                    <button type="button" className="btn btn-ghost" style={{ marginLeft: 8 }}
                      onClick={() => setForm(p => ({ ...p, photoFile: null }))}>
                      Remove
                    </button>
                  )}
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>JPG or PNG · Max 2 MB</div>
                </div>
              </div>
              <div className="form-grid-3" style={{ marginBottom: 18 }}>
                <Field label="First Name" required>
                  <Input
                    placeholder="First name"
                    value={form.firstName}
                    onChange={set("firstName")}
                    required
                  />
                </Field>
                <Field label="Middle Name">
                  <Input
                    placeholder="Middle name"
                    value={form.middleName}
                    onChange={set("middleName")}
                  />
                </Field>
                <Field label="Last Name" required>
                  <Input
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={set("lastName")}
                    required
                  />
                </Field>
              </div>
              <div className="form-grid-3" style={{ marginBottom: 18 }}>
                <Field label="Mobile" required>
                  <Input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={form.mobile}
                    onChange={set("mobile")}
                    required
                  />
                </Field>
                <Field label="Email">
                  <Input
                    type="email"
                    placeholder="member@email.com"
                    value={form.email}
                    onChange={set("email")}
                  />
                </Field>
              </div>
              <div className="form-grid-3" style={{ marginBottom: 18 }}>
                <Field label="Date of Birth" required>
                  <DateInput value={form.dob} onChange={set("dob")} required />
                </Field>
                <Field label="Gender">
                  <Select value={form.gender} onChange={set("gender")}>
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </Select>
                </Field>
              </div>
              <div className="form-grid-3">
                <Field label="EMP ID / PF No.">
                  <Input
                    placeholder="e.g. EMP-001 or PF123456"
                    value={form.empId}
                    onChange={set("empId")}
                  />
                </Field>
                <Field label="Organisation">
                  <Select
                    value={form.organisationId}
                    onChange={e => setForm(p => ({ ...p, organisationId: e.target.value, associationId: "" }))}
                  >
                    <option value="">Select organisation</option>
                    {ORGANISATIONS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </Select>
                </Field>
                <Field label="Association">
                  <Select
                    value={form.associationId}
                    onChange={set("associationId")}
                    disabled={!form.organisationId}
                  >
                    <option value="">{form.organisationId ? "Select association" : "Select organisation first"}</option>
                    {ASSOCIATIONS.filter(a => a.orgId === Number(form.organisationId)).map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </Select>
                </Field>
              </div>
            </SectionBlock>

            {/* Address */}
            <SectionBlock icon="📍" title="Address (Auto-filled from Aadhaar)">
              <div className="form-grid-3" style={{ marginBottom: 18 }}>
                <Field label="Address Line 1" required>
                  <Input
                    placeholder="Street / Building"
                    value={form.address1}
                    onChange={set("address1")}
                    required
                  />
                </Field>
                <Field label="Address Line 2">
                  <Input
                    placeholder="Area / Locality"
                    value={form.address2}
                    onChange={set("address2")}
                  />
                </Field>
                <Field label="City" required>
                  <Input
                    placeholder="City"
                    value={form.city}
                    onChange={set("city")}
                    required
                  />
                </Field>
              </div>
              <div className="form-grid-3">
                <Field label="State" required>
                  <Select value={form.state} onChange={set("state")} required>
                    <option value="">Select state</option>
                    {[
                      "Maharashtra",
                      "Delhi",
                      "Karnataka",
                      "Tamil Nadu",
                      "Gujarat",
                      "Rajasthan",
                      "Uttar Pradesh",
                      "West Bengal",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="PIN Code" required>
                  <Input
                    placeholder="400001"
                    maxLength={6}
                    value={form.pincode}
                    onChange={set("pincode")}
                    required
                  />
                </Field>
                <Field label="Country">
                  <Select value={form.country ?? "India"} onChange={set("country")}>
                    <option>India</option>
                  </Select>
                </Field>
              </div>
            </SectionBlock>

            <div className="actions-row">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate("/member")}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Member
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
