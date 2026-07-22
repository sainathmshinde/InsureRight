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
    address1: '', address2: '', city: '', stateId: '', pinCode: '', country: 'India',
    associationCode: '', isActive: true,
    ccdCode: '',
    bankName: '', branchName: '', accountName: '', accountNumber: '', ifscCode: '', micrCode: '',
    contacts: [],
  }
  const [form, setForm] = useState(
    existing
      ? {
          ...existing,
          hasParent: !!existing.parentId,
          organisationIds: existing.organisationIds ?? (existing.orgId ? [existing.orgId] : []),
          contacts: existing.contacts ?? [],
        }
      : BLANK
  )
  const [showContactModal, setShowContactModal] = useState(false)

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const parentOptions = associations.filter(a =>
    a.isParentAssociation && a.id !== Number(id)
  )

  const handleSubmit = e => {
    e.preventDefault()
    const payload = {
      ...form,
      orgId:    form.organisationIds[0] ?? null,
      stateId:  Number(form.stateId)  || null,
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

            {/* Address */}
            <SectionBlock icon="📍" title="Address">
              <div className="form-grid-3" style={{ marginBottom: 18 }}>
                <Field label="Address Line 1">
                  <Input placeholder="Street / Building" value={form.address1} onChange={set('address1')} />
                </Field>
                <Field label="Address Line 2">
                  <Input placeholder="Area / Locality" value={form.address2} onChange={set('address2')} />
                </Field>
                <Field label="City">
                  <Input placeholder="City" value={form.city} onChange={set('city')} />
                </Field>
              </div>
              <div className="form-grid-3">
                <Field label="State">
                  <Select value={form.stateId} onChange={set('stateId')}>
                    <option value="">Select state</option>
                    {STATES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </Select>
                </Field>
                <Field label="PIN Code">
                  <Input placeholder="400001" maxLength={6} value={form.pinCode} onChange={set('pinCode')} />
                </Field>
                <Field label="Country">
                  <Select value={form.country ?? 'India'} onChange={set('country')}>
                    <option>India</option>
                  </Select>
                </Field>
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

            {/* Contact Info */}
            <SectionBlock icon="📇" title="Contact Info">
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowContactModal(true)}>
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
                      <th style={{ width: 44 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.contacts.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '28px 0', color: 'var(--text-3)' }}>
                          No contacts found.
                        </td>
                      </tr>
                    ) : form.contacts.map(c => (
                      <tr key={c.id}>
                        <td>{c.firstName}</td>
                        <td>{c.lastName}</td>
                        <td>{c.phone}</td>
                        <td>{c.email}</td>
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

            <div className="actions-row">
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/association')}>Cancel</button>
              <button type="submit" className="btn btn-primary">
                {isCreate ? 'Create Association' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showContactModal && (
        <ContactModal
          onClose={() => setShowContactModal(false)}
          onSave={contact => setForm(p => ({ ...p, contacts: [...p.contacts, { id: Date.now(), ...contact }] }))}
        />
      )}
    </div>
  )
}

function ContactModal({ onClose, onSave }) {
  const [draft, setDraft] = useState({ firstName: '', lastName: '', phone: '', email: '' })
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
      <div className="card" style={{ width: '100%', maxWidth: 480, margin: 0 }} onClick={e => e.stopPropagation()}>
        <div className="card-header">
          <div className="card-title">Add Contact</div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-3)', lineHeight: 1 }}>✕</button>
        </div>
        <div className="card-body">
          <form onSubmit={handleSave}>
            <div className="form-grid">
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
