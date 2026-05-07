import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Field,
  Input,
  Select,
  UploadBox,
  SectionBlock,
} from "../../components/Field";
import { CustomerIcon } from "../../icons";
import FamilyMembersSection from "./FamilyMembersSection";

const INITIAL = {
  name: "",
  mobile: "",
  email: "",
  dob: "",
  gender: "",
  aadhaarFile: null,
  panFile: null,
  kycStatus: "Pending",
  address: "",
  city: "",
  state: "",
  pincode: "",
  members: [],
  nomineeName: "",
  nomineeRelation: "",
  nomineeShare: "100",
};

export default function CustomerCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [members, setMembers] = useState([]);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  const setF = (f) => (e) =>
    setForm((p) => ({ ...p, [f]: e.target.files[0] ?? null }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Create customer:", { ...form, members });
    navigate("/customer");
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon">
            <CustomerIcon />
          </div>
          <div>
            <div className="page-title">Add Customer</div>
            <div className="page-subtitle">
              Onboard a new customer with KYC and family details
            </div>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate("/customer")}>
          ← Back
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <SectionBlock icon={<CustomerIcon />} title="Basic Information">
              <div className="form-grid">
                <Field label="Full Name" required>
                  <Input
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={set("name")}
                    required
                  />
                </Field>
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
                    placeholder="customer@email.com"
                    value={form.email}
                    onChange={set("email")}
                  />
                </Field>
                <Field label="Date of Birth" required>
                  <Input
                    type="date"
                    value={form.dob}
                    onChange={set("dob")}
                    required
                  />
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
            </SectionBlock>

            {/* KYC */}
            <SectionBlock icon="🪪" title="KYC (OCR + API)">
              <div className="form-grid">
                <Field label="Upload Aadhaar (Auto fetch details)">
                  <UploadBox
                    label="Upload Aadhaar card"
                    hint="JPG, PNG or PDF — details auto-filled"
                    onChange={setF("aadhaarFile")}
                  />
                </Field>
                <Field label="Upload PAN">
                  <UploadBox
                    label="Upload PAN card"
                    hint="JPG, PNG or PDF"
                    onChange={setF("panFile")}
                  />
                </Field>
                <Field label="KYC Status">
                  <Select value={form.kycStatus} onChange={set("kycStatus")}>
                    <option>Pending</option>
                    <option>Verified</option>
                    <option>Rejected</option>
                  </Select>
                </Field>
              </div>
            </SectionBlock>

            {/* Address */}
            <SectionBlock icon="📍" title="Address (Auto-filled from Aadhaar)">
              <div className="form-grid">
                <Field label="Address" required className="col-span-2">
                  <Input
                    placeholder="House/Flat, Street, Area"
                    value={form.address}
                    onChange={set("address")}
                    required
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
              </div>
              <div className="form-grid" style={{ marginTop: 18 }}>
                <Field label="Pincode" required>
                  <Input
                    placeholder="400001"
                    maxLength={6}
                    value={form.pincode}
                    onChange={set("pincode")}
                    required
                  />
                </Field>
              </div>
            </SectionBlock>

            {/* Family Members */}
            <SectionBlock icon="👨‍👩‍👧" title="Family Details">
              <FamilyMembersSection members={members} onChange={setMembers} />
            </SectionBlock>

            {/* Nominee */}
            <SectionBlock icon="📝" title="Nominee Details">
              <div className="form-grid-3">
                <Field label="Nominee Name" required>
                  <Input
                    placeholder="Full name"
                    value={form.nomineeName}
                    onChange={set("nomineeName")}
                    required
                  />
                </Field>
                <Field label="Relation" required>
                  <Select
                    value={form.nomineeRelation}
                    onChange={set("nomineeRelation")}
                    required
                  >
                    <option value="">Select relation</option>
                    <option>Spouse</option>
                    <option>Child</option>
                    <option>Parent</option>
                    <option>Sibling</option>
                    <option>Other</option>
                  </Select>
                </Field>
                <Field label="Share %" required>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="100"
                    value={form.nomineeShare}
                    onChange={set("nomineeShare")}
                    required
                  />
                </Field>
              </div>
            </SectionBlock>

            <div className="actions-row">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate("/customer")}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Customer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
