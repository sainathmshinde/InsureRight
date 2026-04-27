import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Field,
  Input,
  Select,
  UploadBox,
  SectionBlock,
} from "../../components/Field";

const MOCK_DATA = {
  1: {
    name: "Ravi Kulkarni",
    mobile: "9876543210",
    email: "ravi@email.com",
    dob: "1990-05-15",
    gender: "Male",
    pan: "ABCDE1234F",
    aadhaar: "1234 5678 9012",
    posLicense: "POS-2023-001",
    qualification: "Graduate",
    experience: "4",
    accountNumber: "50100XXXXXX",
    ifsc: "HDFC0001234",
    assignedBroker: "Mehta Insurance",
    reportingManager: "Sunil Mehta",
    status: "Active",
  },
};

export default function AgentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(MOCK_DATA[id] ?? {});
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  const setF = (f) => (e) =>
    setForm((p) => ({ ...p, [f]: e.target.files[0] ?? null }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Update agent:", id, form);
    navigate("/agent");
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon">✏️</div>
          <div>
            <div className="page-title">Edit Agent</div>
            <div className="page-subtitle">
              Update agent profile and documents
            </div>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate("/agent")}>
          ← Back
        </button>
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
                <Field label="Email" required>
                  <Input
                    type="email"
                    value={form.email || ""}
                    onChange={set("email")}
                    required
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
              </div>
            </SectionBlock>

            <SectionBlock icon="🪪" title="KYC Documents">
              <div className="form-grid">
                <Field label="PAN Number" required>
                  <Input
                    value={form.pan || ""}
                    onChange={set("pan")}
                    required
                  />
                </Field>
                <Field label="Aadhaar Number" required>
                  <Input
                    value={form.aadhaar || ""}
                    onChange={set("aadhaar")}
                    required
                  />
                </Field>
                <Field label="Re-upload PAN">
                  <UploadBox
                    label="Upload PAN card"
                    hint="JPG, PNG or PDF"
                    onChange={setF("panFile")}
                  />
                </Field>
                <Field label="Re-upload Aadhaar">
                  <UploadBox
                    label="Upload Aadhaar"
                    hint="JPG, PNG or PDF"
                    onChange={setF("aadhaarFile")}
                  />
                </Field>
              </div>
            </SectionBlock>

            <SectionBlock icon="💼" title="Professional Details">
              <div className="form-grid">
                <Field label="POS License Number" required>
                  <Input
                    value={form.posLicense || ""}
                    onChange={set("posLicense")}
                    required
                  />
                </Field>
                <Field label="Qualification">
                  <Select
                    value={form.qualification || ""}
                    onChange={set("qualification")}
                  >
                    <option value="">Select</option>
                    <option>10th Pass</option>
                    <option>12th Pass</option>
                    <option>Graduate</option>
                    <option>Post Graduate</option>
                  </Select>
                </Field>
                <Field label="Experience (Years)">
                  <Input
                    type="number"
                    min="0"
                    value={form.experience || ""}
                    onChange={set("experience")}
                  />
                </Field>
              </div>
            </SectionBlock>

            <SectionBlock icon="🏦" title="Bank Details">
              <div className="form-grid">
                <Field label="Account Number" required>
                  <Input
                    value={form.accountNumber || ""}
                    onChange={set("accountNumber")}
                    required
                  />
                </Field>
                <Field label="IFSC Code" required>
                  <Input
                    value={form.ifsc || ""}
                    onChange={set("ifsc")}
                    required
                  />
                </Field>
              </div>
            </SectionBlock>

            <SectionBlock icon="🔗" title="Mapping">
              <div className="form-grid">
                <Field label="Assigned Broker">
                  <Select
                    value={form.assignedBroker || ""}
                    onChange={set("assignedBroker")}
                  >
                    <option value="">Select broker</option>
                    <option>Mehta Insurance</option>
                    <option>Priya Brokers</option>
                    <option>AK Associates</option>
                    <option>Shah Financial</option>
                  </Select>
                </Field>
                <Field label="Reporting Manager">
                  <Input
                    value={form.reportingManager || ""}
                    onChange={set("reportingManager")}
                  />
                </Field>
                <Field label="Status">
                  <Select
                    value={form.status || "Active"}
                    onChange={set("status")}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </Select>
                </Field>
              </div>
            </SectionBlock>

            <div className="actions-row">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate("/agent")}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Update Agent
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
