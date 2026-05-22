import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Field, Input, Select, SectionBlock } from "../../components/Field";
import { InsuranceCompanyIcon } from "../../icons";

const INITIAL = {
  icName: "",
  code: "",
  branch: "",
  contactPerson: "",
  email: "",
  phone: "",
  apiBaseUrl: "",
  apiKey: "",
  apiSecret: "",
  status: "Active",
};

export default function ICCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Create IC:", form);
    navigate("/ic");
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon">
            <InsuranceCompanyIcon />
          </div>
          <div>
            <div className="page-title">Add Insurance Company</div>
            <div className="page-subtitle">
              Register a new Insurance Company master
            </div>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate("/ic")}>
          ← Back
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <SectionBlock icon="🏦" title="IC Master Information">
              <div className="form-grid">
                <Field label="IC Name" required>
                  <Input
                    placeholder="e.g. Star Health Insurance"
                    value={form.icName}
                    onChange={set("icName")}
                    required
                  />
                </Field>
                <Field label="IC Code" required>
                  <Input
                    placeholder="e.g. SHI"
                    value={form.code}
                    onChange={set("code")}
                    required
                  />
                </Field>
                <Field label="Branch">
                  <Input
                    placeholder="e.g. Mumbai"
                    value={form.branch}
                    onChange={set("branch")}
                  />
                </Field>
                <Field label="Contact Person">
                  <Input
                    placeholder="Primary contact name"
                    value={form.contactPerson}
                    onChange={set("contactPerson")}
                  />
                </Field>
                <Field label="Email" required>
                  <Input
                    type="email"
                    placeholder="api@example.com"
                    value={form.email}
                    onChange={set("email")}
                    required
                  />
                </Field>
                <Field label="Phone">
                  <Input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    onChange={set("phone")}
                  />
                </Field>
                <Field label="Status">
                  <Select value={form.status} onChange={set("status")}>
                    <option>Active</option>
                    <option>Inactive</option>
                  </Select>
                </Field>
              </div>
            </SectionBlock>

            <SectionBlock icon="🔌" title="API Credentials">
              <div className="form-grid">
                <Field label="API Base URL" required>
                  <Input
                    type="url"
                    placeholder="https://api.example.com/v1"
                    value={form.apiBaseUrl}
                    onChange={set("apiBaseUrl")}
                    required
                  />
                </Field>
                <Field label="API Key" required>
                  <Input
                    placeholder="Enter API key"
                    value={form.apiKey}
                    onChange={set("apiKey")}
                    required
                  />
                </Field>
                <Field label="API Secret" required>
                  <Input
                    type="password"
                    placeholder="Enter API secret"
                    value={form.apiSecret}
                    onChange={set("apiSecret")}
                    required
                  />
                </Field>
              </div>
            </SectionBlock>

            <div className="actions-row">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate("/ic")}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create IC
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
