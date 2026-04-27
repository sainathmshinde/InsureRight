import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Field, Input, Select, SectionBlock } from "../../components/Field";

const MOCK_DATA = {
  1: {
    name: "Anita Desai",
    mobile: "9876543210",
    email: "anita@gmail.com",
    dob: "1985-04-12",
    gender: "Female",
    kycStatus: "Verified",
    address: "12, Rose Apartments, Bandra",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400050",
    nomineeName: "Ravi Desai",
    nomineeRelation: "Spouse",
    nomineeShare: "100",
  },
};

export default function CustomerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(MOCK_DATA[id] ?? {});
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Update customer:", id, form);
    navigate("/customer");
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon">✏️</div>
          <div>
            <div className="page-title">Edit Customer</div>
            <div className="page-subtitle">Update customer profile</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/customer/${id}/360`)}
          >
            360° View
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => navigate("/customer")}
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <SectionBlock icon=<AgentIcon /> title="Basic Information">
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
                onClick={() => navigate("/customer")}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Update Customer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
