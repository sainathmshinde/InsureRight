import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Field,
  Input,
  Select,
  UploadBox,
  SectionBlock,
} from "../../components/Field";
import { AgentIcon } from "../../icons";
import { AGENT_MAP } from "./agentData";
import { useAuth } from "../../context/AuthContext";

function authUserToAgent(u) {
  if (!u) return {};
  return { name: u.name, mobile: u.phone || '', email: u.email, assignedBroker: u.company || '' };
}

export default function AgentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isProfile = !id;

  // For profile: load full agent record (with doc URLs) then overlay auth user fields
  const profileAgent = isProfile
    ? (
        Object.values(AGENT_MAP).find(a => a.email === user?.email)
        ?? Object.values(AGENT_MAP).find(a => a.name === user?.name)
        ?? AGENT_MAP[2]
      )
    : null

  const initial = isProfile
    ? {
        ...profileAgent,
        name:           user?.name    || profileAgent?.name    || '',
        mobile:         user?.phone   || profileAgent?.mobile  || '',
        email:          user?.email   || profileAgent?.email   || '',
        assignedBroker: user?.company || profileAgent?.assignedBroker || '',
      }
    : (AGENT_MAP[Number(id)] ?? {});
  const [form, setForm] = useState(initial);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  const setF = (f) => (e) =>
    setForm((p) => ({ ...p, [f]: e.target.files[0] ?? null }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isProfile ? "Update agent profile:" : "Update agent:", form);
    navigate(isProfile ? "/profile" : "/agent");
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon">✏️</div>
          <div>
            <div className="page-title">{isProfile ? "Edit My Profile" : "Edit Agent"}</div>
            <div className="page-subtitle">
              {isProfile ? "Update your contact and professional details" : "Update agent profile and documents"}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {isProfile && (
            <button className="btn btn-ghost" onClick={() => navigate("/profile")}>← Profile</button>
          )}
          <button className="btn btn-ghost" onClick={() => navigate(isProfile ? "/dashboard" : "/agent")}>
            {isProfile ? "← Dashboard" : "← Back"}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <SectionBlock icon={<AgentIcon />} title="Basic Information">
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
                <Field label="PAN Document">
                  <UploadBox
                    label="Upload PAN card"
                    hint="JPG, PNG or PDF"
                    value={form.panFile}
                    onChange={setF("panFile")}
                  />
                </Field>
                <Field label="Aadhaar Document">
                  <UploadBox
                    label="Upload Aadhaar"
                    hint="JPG, PNG or PDF"
                    value={form.aadhaarFile}
                    onChange={setF("aadhaarFile")}
                  />
                </Field>
                <Field label="Photo">
                  <UploadBox
                    label="Upload passport photo"
                    hint="JPG or PNG, max 2MB"
                    value={form.photo}
                    onChange={setF("photo")}
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
                  <Input value="K.M. Dastur & Co." readOnly style={{ background: 'var(--bg-2)', color: 'var(--text-2)' }} />
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
                onClick={() => navigate(isProfile ? "/profile" : "/agent")}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {isProfile ? "Save Profile" : "Update Agent"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
