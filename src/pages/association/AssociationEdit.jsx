import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Field, Input, Select, SectionBlock } from '../../components/Field'
import { useAssociations } from './AssociationContext'
import { ORGANISATIONS, STATES } from '../member/orgAssocData'

export default function AssociationEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { associations, addAssociation, updateAssociation } = useAssociations()

  const isCreate = !id
  const existing = isCreate ? null : associations.find(a => a.id === Number(id))

  const BLANK = {
    name: '', parentId: null, hasParent: false,
    organisationIds: [],
    associationCode: '', isActive: true,
    ccdCode: '',
    bankName: '', branchName: '', accountName: '', accountNumber: '', ifscCode: '', micrCode: '',
    branches: [],
    contacts: [],
  }
  const [form, setForm] = useState(() => {
    if (!existing) return BLANK

    // Branches previously carried their own nested `contacts` — flatten those
    // into the top-level contacts list (tagged with branchId) if present.
    let migratedBranches = existing.branches
    let migratedContacts = existing.contacts ?? []
    if (migratedBranches) {
      migratedContacts = migratedBranches.some(b => b.contacts?.length)
        ? migratedBranches.flatMap(b => (b.contacts ?? []).map(c => ({ ...c, branchId: b.id })))
        : migratedContacts
      migratedBranches = migratedBranches.map(({ contacts, ...b }) => b)
    } else if (existing.address1 || existing.contacts?.length) {
      const mainBranchId = Date.now()
      migratedBranches = [{
        id: mainBranchId,
        branchName: 'Main Branch',
        address1: existing.address1 ?? '',
        address2: existing.address2 ?? '',
        city: existing.city ?? '',
        stateId: existing.stateId ?? '',
        pinCode: existing.pinCode ?? '',
        country: existing.country ?? 'India',
      }]
      migratedContacts = (existing.contacts ?? []).map(c => ({ ...c, branchId: mainBranchId }))
    } else {
      migratedBranches = []
    }

    return {
      ...existing,
      hasParent: !!existing.parentId,
      organisationIds: existing.organisationIds ?? (existing.orgId ? [existing.orgId] : []),
      branches: migratedBranches,
      contacts: migratedContacts,
    }
  })
  const [showBranchModal, setShowBranchModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const PARENT_ASSOCIATION_NAMES = ['BOIPARA-Federation', 'AIBRF-ALL INDIA BANK RETIREES FEDERATION']
  const parentOptions = associations.filter(a =>
    PARENT_ASSOCIATION_NAMES.includes(a.name) && a.id !== Number(id)
  )

  const handleSubmit = e => {
    e.preventDefault()
    const payload = {
      ...form,
      orgId:    form.organisationIds[0] ?? null,
      parentId: form.parentId ? Number(form.parentId) : null,
    }
    if (isCreate) {
      addAssociation(payload)
    } else {
      updateAssociation(Number(id), payload)
    }
    navigate('/association')
  }

  if (!isCreate && !existing) return (
    <div className="empty-state">
      <div className="empty-state-icon">🔍</div>
      <div>Association not found</div>
      <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/association')}>Back to list</button>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <span className="page-bar" />
          <div>
            <div className="page-title">{isCreate ? 'Add Association' : 'Edit Association'}</div>
            <div className="page-subtitle">{isCreate ? 'Create a new association' : `Editing: ${existing.name}`}</div>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/association')}>← Back</button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>

            {/* Organisation */}
            <SectionBlock icon="🏢" title="Organisation">
              <div className="form-grid-3">
                <Field label="Organisation">
                  <Select
                    value={form.organisationIds[0] ?? ''}
                    onChange={e => setForm(p => ({ ...p, organisationIds: e.target.value ? [Number(e.target.value)] : [] }))}
                  >
                    <option value="">Select organisation</option>
                    {ORGANISATIONS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </Select>
                </Field>
              </div>
            </SectionBlock>

            {/* Basic Info */}
            <SectionBlock icon="🤝" title="Association Info">
              <div className="form-grid-3">
                <Field label="Association Name" required>
                  <Input
                    placeholder="Full association name"
                    value={form.name}
                    onChange={set('name')}
                    required
                  />
                </Field>
                <Field label="Select Parent Association">
                  <Select
                    value={form.parentId ?? ''}
                    onChange={e => setForm(p => ({ ...p, parentId: e.target.value || null }))}
                  >
                    <option value="">Select parent association</option>
                    {parentOptions.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </Select>
                </Field>
              </div>
            </SectionBlock>

            {/* Branches/Location */}
            <SectionBlock icon="🏬" title="Branches/Location">
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowBranchModal(true)}>
                  + Add Branch/Location
                </button>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Branch/Location Name</th>
                      <th>Address</th>
                      <th>City</th>
                      <th>State</th>
                      <th>Contacts</th>
                      <th style={{ width: 44 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.branches.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '28px 0', color: 'var(--text-3)' }}>
                          No branches/locations found.
                        </td>
                      </tr>
                    ) : form.branches.map(b => (
                      <tr key={b.id}>
                        <td>{b.branchName}</td>
                        <td>{[b.address1, b.address2].filter(Boolean).join(', ')}</td>
                        <td>{b.city}</td>
                        <td>{STATES.find(s => s.id === Number(b.stateId))?.name ?? ''}</td>
                        <td>{form.contacts.filter(c => c.branchId === b.id).length}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            title="Remove branch/location"
                            onClick={() => setForm(p => ({
                              ...p,
                              branches: p.branches.filter(x => x.id !== b.id),
                              contacts: p.contacts.filter(c => c.branchId !== b.id),
                            }))}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-3)', lineHeight: 1, padding: '2px 6px' }}
                          >×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionBlock>

            {/* Contact Info */}
            <SectionBlock icon="📇" title="Contact Info">
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={form.branches.length === 0}
                  title={form.branches.length === 0 ? 'Add a branch/location first' : undefined}
                  onClick={() => setShowContactModal(true)}
                >
                  + Add Contact
                </button>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Branch/Location</th>
                      <th style={{ width: 44 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.contacts.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '28px 0', color: 'var(--text-3)' }}>
                          No contacts found.
                        </td>
                      </tr>
                    ) : form.contacts.map(c => (
                      <tr key={c.id}>
                        <td>{c.firstName}</td>
                        <td>{c.lastName}</td>
                        <td>{c.phone}</td>
                        <td>{c.email}</td>
                        <td>{form.branches.find(b => b.id === c.branchId)?.branchName ?? '—'}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            title="Remove contact"
                            onClick={() => setForm(p => ({ ...p, contacts: p.contacts.filter(x => x.id !== c.id) }))}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-3)', lineHeight: 1, padding: '2px 6px' }}
                          >×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionBlock>

            {/* Account Info */}
            <SectionBlock icon="🏦" title="Account Info">
              <div className="form-grid-3" style={{ marginBottom: 18 }}>
                <Field label="CCD Code/ Account Number">
                  <Input placeholder="e.g. CCD00872530012" value={form.ccdCode} onChange={set('ccdCode')} />
                </Field>
              </div>
              <div className="form-grid-3" style={{ marginBottom: 18 }}>
                <Field label="Bank Name" required>
                  <Input placeholder="e.g. HDFC Bank" value={form.bankName} onChange={set('bankName')} required />
                </Field>
                <Field label="Branch Name" required>
                  <Input placeholder="e.g. Andheri West" value={form.branchName} onChange={set('branchName')} required />
                </Field>
                <Field label="Account Name" required>
                  <Input placeholder="Name as per bank records" value={form.accountName} onChange={set('accountName')} required />
                </Field>
              </div>
              <div className="form-grid-3">
                <Field label="Account Number" required>
                  <Input placeholder="Enter account number" value={form.accountNumber} onChange={set('accountNumber')} required />
                </Field>
                <Field label="IFSC Code" required>
                  <Input placeholder="HDFC0001234" value={form.ifscCode} onChange={set('ifscCode')} required />
                </Field>
                <Field label="MICR Code" required>
                  <Input placeholder="400240002" value={form.micrCode} onChange={set('micrCode')} required />
                </Field>
              </div>
            </SectionBlock>

            <div className="actions-row">
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/association')}>Cancel</button>
              <button type="submit" className="btn btn-primary">
                {isCreate ? 'Create Association' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showBranchModal && (
        <BranchModal
          onClose={() => setShowBranchModal(false)}
          onSave={branch => setForm(p => ({ ...p, branches: [...p.branches, { id: Date.now(), ...branch }] }))}
        />
      )}

      {showContactModal && (
        <ContactModal
          branches={form.branches}
          onClose={() => setShowContactModal(false)}
          onSave={contact => setForm(p => ({ ...p, contacts: [...p.contacts, { id: Date.now(), ...contact }] }))}
        />
      )}
    </div>
  )
}

function ContactModal({ branches = [], onClose, onSave }) {
  const [draft, setDraft] = useState({ branchId: '', firstName: '', lastName: '', phone: '', email: '' })
  const setD = f => e => setDraft(p => ({ ...p, [f]: e.target.value }))

  const handleSave = e => {
    e.preventDefault()
    onSave({ ...draft, branchId: Number(draft.branchId) })
    onClose()
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
      onClick={onClose}
    >
      <div className="card" style={{ width: '100%', maxWidth: 480, margin: 0 }} onClick={e => e.stopPropagation()}>
        <div className="card-header">
          <div className="card-title">Add Contact</div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-3)', lineHeight: 1 }}>✕</button>
        </div>
        <div className="card-body">
          <form onSubmit={handleSave}>
            <div className="form-grid">
              <Field label="Select Branch/Location" required className="col-span-2">
                <Select value={draft.branchId} onChange={setD('branchId')} required>
                  <option value="">Select branch/location</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.branchName}</option>)}
                </Select>
              </Field>
              <Field label="First Name" required>
                <Input value={draft.firstName} onChange={setD('firstName')} required />
              </Field>
              <Field label="Last Name" required>
                <Input value={draft.lastName} onChange={setD('lastName')} required />
              </Field>
              <Field label="Phone Number" required>
                <Input type="tel" placeholder="+91 XXXXX XXXXX" value={draft.phone} onChange={setD('phone')} required />
              </Field>
              <Field label="Email" required>
                <Input type="email" placeholder="contact@email.com" value={draft.email} onChange={setD('email')} required />
              </Field>
            </div>
            <div className="actions-row">
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Add Contact</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function BranchModal({ onClose, onSave }) {
  const [draft, setDraft] = useState({
    branchName: '', address1: '', address2: '', city: '', stateId: '', pinCode: '', country: 'India',
  })
  const setD = f => e => setDraft(p => ({ ...p, [f]: e.target.value }))

  const handleSave = e => {
    e.preventDefault()
    onSave(draft)
    onClose()
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
      onClick={onClose}
    >
      <div className="card" style={{ width: '100%', maxWidth: 640, margin: 0 }} onClick={e => e.stopPropagation()}>
        <div className="card-header">
          <div className="card-title">Add Branch/Location</div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-3)', lineHeight: 1 }}>✕</button>
        </div>
        <div className="card-body">
          <form onSubmit={handleSave}>
            <div className="form-grid-3" style={{ marginBottom: 18 }}>
              <Field label="Branch/Location Name" required>
                <Input placeholder="e.g. Mumbai Branch" value={draft.branchName} onChange={setD('branchName')} required />
              </Field>
              <Field label="Address Line 1">
                <Input placeholder="Street / Building" value={draft.address1} onChange={setD('address1')} />
              </Field>
              <Field label="Address Line 2">
                <Input placeholder="Area / Locality" value={draft.address2} onChange={setD('address2')} />
              </Field>
            </div>
            <div className="form-grid-3" style={{ marginBottom: 18 }}>
              <Field label="City">
                <Input placeholder="City" value={draft.city} onChange={setD('city')} />
              </Field>
              <Field label="State">
                <Select value={draft.stateId} onChange={setD('stateId')}>
                  <option value="">Select state</option>
                  {STATES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
              </Field>
              <Field label="PIN Code">
                <Input placeholder="400001" maxLength={6} value={draft.pinCode} onChange={setD('pinCode')} />
              </Field>
            </div>

            <div className="actions-row">
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Add Branch/Location</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
