import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Field,
  Input,
  Select,
  UploadBox,
  SectionBlock,
} from "../../components/Field";
import { AgentIcon } from "../../icons";

const INITIAL = {
  // Basic
  name: "",
  mobile: "",
  email: "",
  dob: "",
  gender: "",
  agentType: "",
  // KYC
  pan: "",
  aadhaar: "",
  photo: null,
  panFile: null,
  aadhaarFile: null,
  // Professional
  posLicense: "",
  qualification: "",
  experience: "",
  // Bank
  accountNumber: "",
  ifsc: "",
  // Mapping
  assignedBroker: "",
  reportingManager: "",
  status: "Active",
};

export default function AgentCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  const setF = (f) => (e) =>
    setForm((p) => ({ ...p, [f]: e.target.files[0] ?? null }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Create agent:", form);
    navigate("/agent");
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon">
            <AgentIcon />
          </div>
          <div>
            <div className="page-title">Add Agent</div>
            <div className="page-subtitle">Register a new agent</div>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate("/agent")}>
          ← Back
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <SectionBlock icon={<AgentIcon />} title="Basic Information">
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
                <Field label="Email" required>
                  <Input
                    type="email"
                    placeholder="agent@email.com"
                    value={form.email}
                    onChange={set("email")}
                    required
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
                <Field label="Agent Type" required>
                  <Select
                    value={form.agentType}
                    onChange={set("agentType")}
                    required
                  >
                    <option value="">Select agent type</option>
                    <option value="calling">Calling Agent</option>
                    <option value="sales">Sales Agent</option>
                  </Select>
                </Field>
              </div>
            </SectionBlock>

            {/* <SectionBlock icon="🪪" title="KYC Documents">
              <div className="form-grid">
                <Field label="PAN Number" required>
                  <Input
                    placeholder="ABCDE1234F"
                    value={form.pan}
                    onChange={set("pan")}
                    required
                  />
                </Field>
                <Field label="Aadhaar Number" required>
                  <Input
                    placeholder="XXXX XXXX XXXX"
                    value={form.aadhaar}
                    onChange={set("aadhaar")}
                    required
                  />
                </Field>
                <Field label="Upload PAN">
                  <UploadBox
                    label="Upload PAN card"
                    hint="JPG, PNG or PDF"
                    onChange={setF("panFile")}
                  />
                </Field>
                <Field label="Upload Aadhaar">
                  <UploadBox
                    label="Upload Aadhaar"
                    hint="JPG, PNG or PDF"
                    onChange={setF("aadhaarFile")}
                  />
                </Field>
                <Field label="Photo Upload">
                  <UploadBox
                    label="Upload passport photo"
                    hint="JPG or PNG, max 2MB"
                    onChange={setF("photo")}
                  />
                </Field>
              </div>
            </SectionBlock>

            <SectionBlock icon="💼" title="Professional Details">
              <div className="form-grid">
                <Field label="POS License Number">
                  <Input
                    placeholder="POS-XXXX-XXX"
                    value={form.posLicense}
                    onChange={set("posLicense")}
                  />
                </Field>
                <Field label="Qualification">
                  <Select
                    value={form.qualification}
                    onChange={set("qualification")}
                  >
                    <option value="">Select qualification</option>
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
                    max="50"
                    placeholder="0"
                    value={form.experience}
                    onChange={set("experience")}
                  />
                </Field>
              </div>
            </SectionBlock>

            <SectionBlock icon="🏦" title="Bank Details">
              <div className="form-grid">
                <Field label="Account Number">
                  <Input
                    placeholder="Enter account number"
                    value={form.accountNumber}
                    onChange={set("accountNumber")}
                  />
                </Field>
                <Field label="IFSC Code" required>
                  <Input
                    placeholder="HDFC0001234"
                    value={form.ifsc}
                    onChange={set("ifsc")}
                    required
                  />
                </Field>
              </div>
            </SectionBlock> */}

            <div className="actions-row">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate("/agent")}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Agent
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
