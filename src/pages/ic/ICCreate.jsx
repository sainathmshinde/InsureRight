import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Field, Input, Select, SectionBlock } from "../../components/Field";
import { BranchModal, ContactModal, BranchLocationSection, ContactInfoSection } from "./ICBranchContact";

const INITIAL = {
  icName: "",
  code: "",
  email: "",
  apiBaseUrl: "",
  apiKey: "",
  apiSecret: "",
  status: "Active",
  branches: [],
  contacts: [],
};

export default function ICCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
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
          <span className="page-bar" />
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
              <div className="form-grid-3">
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
                <Field label="Email" required>
                  <Input
                    type="email"
                    placeholder="api@example.com"
                    value={form.email}
                    onChange={set("email")}
                    required
                  />
                </Field>
              </div>
            </SectionBlock>

            <SectionBlock icon="🏬" title="Branches/Location">
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowBranchModal(true)}>
                  + Add Branch/Location
                </button>
              </div>
              <BranchLocationSection form={form} setForm={setForm} />
            </SectionBlock>

            <SectionBlock icon="📇" title="Contact Info">
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={form.branches.length === 0}
                  title={form.branches.length === 0 ? "Add a branch/location first" : undefined}
                  onClick={() => setShowContactModal(true)}
                >
                  + Add Contact
                </button>
              </div>
              <ContactInfoSection form={form} setForm={setForm} />
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

      {showBranchModal && (
        <BranchModal
          onClose={() => setShowBranchModal(false)}
          onSave={(branch) => setForm((p) => ({ ...p, branches: [...p.branches, { id: Date.now(), ...branch }] }))}
        />
      )}

      {showContactModal && (
        <ContactModal
          branches={form.branches}
          onClose={() => setShowContactModal(false)}
          onSave={(contact) => setForm((p) => ({ ...p, contacts: [...p.contacts, { id: Date.now(), ...contact }] }))}
        />
      )}
    </div>
  );
}
