import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Field, Input, Select, SectionBlock, UploadBox } from "../../components/Field";
import { useAuth } from "../../context/AuthContext";
import FamilyMembersSection from "./FamilyMembersSection";

const MOCK_DATA = {
  1: {
    name: "Aarav Sharma",
    mobile: "9876543210",
    email: "aarav@gmail.com",
    dob: "1990-03-15",
    gender: "Male",
    kycStatus: "Verified",
    address: "14, Green Valley Apartments, Andheri West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400053",
    nomineeName: "Priya Sharma",
    nomineeRelation: "Spouse",
    nomineeShare: "100",
    familyMembers: [
      { id: 1, type: "Spouse",   name: "Priya Sharma", dob: "1992-07-22", gender: "Female", preExisting: "" },
      { id: 2, type: "Son",      name: "Aryan Sharma", dob: "2016-02-10", gender: "Male",   preExisting: "" },
      { id: 3, type: "Daughter", name: "Aanya Sharma", dob: "2019-09-05", gender: "Female", preExisting: "" },
    ],
  },
};

function authUserToCustomer(u) {
  if (!u) return {};
  return { name: u.name, mobile: u.phone || '', email: u.email };
}

export default function CustomerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isProfile = !id;
  const profileData = isProfile
    ? (Object.values(MOCK_DATA).find(m => m.email === user?.email) ?? {})
    : {};
  const initial = isProfile
    ? { ...profileData, ...authUserToCustomer(user) }
    : (MOCK_DATA[id] ?? {});
  const [form, setForm] = useState(initial);
  const [members, setMembers] = useState(initial.familyMembers ?? []);
  const [kycFiles, setKycFiles] = useState({ aadhaar: null, pan: null });
  const set  = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  const setKF = (f) => (e) => setKycFiles((p) => ({ ...p, [f]: e.target.files[0] ?? null }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isProfile ? "Update customer profile:" : "Update customer:", form);
    navigate(isProfile ? "/profile" : "/customer");
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon">✏️</div>
          <div>
            <div className="page-title">{isProfile ? "Edit My Profile" : "Edit Customer"}</div>
            <div className="page-subtitle">{isProfile ? "Update your contact details" : "Update customer profile"}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {!isProfile && (
            <button
              className="btn btn-secondary"
              onClick={() => navigate(`/customer/${id}/360`)}
            >
              360° View
            </button>
          )}
          {isProfile && (
            <button className="btn btn-ghost" onClick={() => navigate("/profile")}>← Profile</button>
          )}
          <button
            className="btn btn-ghost"
            onClick={() => navigate(isProfile ? "/dashboard" : "/customer")}
          >
            {isProfile ? "← Dashboard" : "← Back"}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <SectionBlock icon="👤" title="Basic Information">
              <div className="form-grid">
                <Field label="Full Name" required>
                  <Input
                    value={form.name || ""}
                    onChange={set("name")}
                    required
                  />
                </Field>
                <Field label="Mobile" required>
                  <Input
                    type="tel"
                    value={form.mobile || ""}
                    onChange={set("mobile")}
                    required
                  />
                </Field>
                <Field label="Email">
                  <Input
                    type="email"
                    value={form.email || ""}
                    onChange={set("email")}
                  />
                </Field>
                <Field label="Date of Birth">
                  <Input
                    type="date"
                    value={form.dob || ""}
                    onChange={set("dob")}
                  />
                </Field>
                <Field label="Gender">
                  <Select value={form.gender || ""} onChange={set("gender")}>
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </Select>
                </Field>
                {!isProfile && (
                  <Field label="KYC Status">
                    <Select
                      value={form.kycStatus || "Pending"}
                      onChange={set("kycStatus")}
                    >
                      <option>Pending</option>
                      <option>Verified</option>
                      <option>Rejected</option>
                    </Select>
                  </Field>
                )}
              </div>
            </SectionBlock>

            <SectionBlock icon="📍" title="Address">
              <div className="form-grid">
                <Field label="Address">
                  <Input value={form.address || ""} onChange={set("address")} />
                </Field>
                <Field label="City">
                  <Input value={form.city || ""} onChange={set("city")} />
                </Field>
                <Field label="State">
                  <Select value={form.state || ""} onChange={set("state")}>
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
                <Field label="Pincode">
                  <Input
                    maxLength={6}
                    value={form.pincode || ""}
                    onChange={set("pincode")}
                  />
                </Field>
              </div>
            </SectionBlock>

            {isProfile && (
              <SectionBlock icon="🪪" title="KYC Documents">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                  <span className={`badge badge-${form.kycStatus === 'Verified' ? 'green' : form.kycStatus === 'Rejected' ? 'red' : 'amber'}`}>
                    KYC: {form.kycStatus || 'Pending'}
                  </span>
                  {form.kycStatus !== 'Verified' && (
                    <span style={{ fontSize: 12.5, color: 'var(--text-3)' }}>
                      Upload documents below to complete verification
                    </span>
                  )}
                  {form.kycStatus === 'Verified' && (
                    <span style={{ fontSize: 12.5, color: 'var(--text-3)' }}>
                      Your KYC is verified. You may re-upload to update documents.
                    </span>
                  )}
                </div>
                <div className="form-grid">
                  <Field label="Aadhaar Card">
                    <UploadBox
                      label="Upload Aadhaar card"
                      hint="JPG, PNG or PDF"
                      onChange={setKF('aadhaar')}
                    />
                  </Field>
                  <Field label="PAN Card">
                    <UploadBox
                      label="Upload PAN card"
                      hint="JPG, PNG or PDF"
                      onChange={setKF('pan')}
                    />
                  </Field>
                </div>
              </SectionBlock>
            )}

            <SectionBlock icon="👨‍👩‍👧" title="Family Details">
              <FamilyMembersSection members={members} onChange={setMembers} />
            </SectionBlock>

            <SectionBlock icon="📝" title="Nominee Details">
              <div className="form-grid-3">
                <Field label="Nominee Name">
                  <Input
                    value={form.nomineeName || ""}
                    onChange={set("nomineeName")}
                  />
                </Field>
                <Field label="Relation">
                  <Select
                    value={form.nomineeRelation || ""}
                    onChange={set("nomineeRelation")}
                  >
                    <option value="">Select</option>
                    <option>Spouse</option>
                    <option>Child</option>
                    <option>Parent</option>
                    <option>Sibling</option>
                    <option>Other</option>
                  </Select>
                </Field>
                <Field label="Share %">
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={form.nomineeShare || ""}
                    onChange={set("nomineeShare")}
                  />
                </Field>
              </div>
            </SectionBlock>

            <div className="actions-row">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate(isProfile ? "/profile" : "/customer")}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {isProfile ? "Save Profile" : "Update Customer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
