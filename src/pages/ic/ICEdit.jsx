import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Field, Input, Select, SectionBlock } from '../../components/Field'
import { EditIcon } from '../../icons'
import { IC_MAP } from './icData'
import { BranchModal, ContactModal, BranchLocationSection, ContactInfoSection } from './ICBranchContact'
import { useFormValidation } from '../../hooks/useFormValidation'
import { useToast } from '../../context/ToastContext'

export default function ICEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [form, setForm] = useState(() => {
    const existing = IC_MAP[Number(id)] ?? {}
    if (existing.branches) return { ...existing, contacts: existing.contacts ?? [] }

    // Legacy records only carry a single branch city + single contact person —
    // migrate those into the new multi-branch/multi-contact shape.
    const mainBranchId = Date.now()
    const migratedBranches = existing.branch
      ? [{ id: mainBranchId, branchName: existing.branch, address1: '', address2: '', city: existing.branch, stateId: '', pinCode: '', country: 'India' }]
      : []
    const migratedContacts = existing.contactPerson
      ? [{
          id: mainBranchId + 1,
          branchId: mainBranchId,
          firstName: existing.contactPerson,
          lastName: '',
          phone: existing.phone ?? '',
          email: existing.contactEmail ?? existing.email ?? '',
        }]
      : []
    return { ...existing, branches: migratedBranches, contacts: migratedContacts }
  })
  const [showBranchModal, setShowBranchModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const fv = useFormValidation(form, {
    icName: { required: true, label: 'IC Name' },
    code: { required: true, label: 'IC Code' },
    email: { required: true, label: 'Email' },
  })

  const handleSubmit = e => {
    e.preventDefault()
    if (!fv.validateAll()) {
      toast.error('Please fix the highlighted fields before continuing.')
      return
    }
    console.log('Update IC:', id, form)
    toast.success('Insurance Company updated successfully.')
    navigate('/ic')
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon"><EditIcon /></div>
          <div>
            <div className="page-title">Edit Insurance Company</div>
            <div className="page-subtitle">Update IC master information</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => navigate(`/ic/${id}/integration`)}>Integration Setup</button>
          <button className="btn btn-ghost" onClick={() => navigate('/ic')}>← Back</button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate>
            <SectionBlock icon="🏦" title="IC Master Information">
              <div className="form-grid-3">
                <Field label="IC Name" required error={fv.fieldProps('icName').error}>
                  <Input placeholder="IC Name" value={form.icName || ''} onChange={set('icName')} required {...fv.fieldProps('icName')} />
                </Field>
                <Field label="IC Code" required error={fv.fieldProps('code').error}>
                  <Input placeholder="e.g. SHI" value={form.code || ''} onChange={set('code')} required {...fv.fieldProps('code')} />
                </Field>
                <Field label="Email" required error={fv.fieldProps('email').error}>
                  <Input type="email" placeholder="api@example.com" value={form.email || ''} onChange={set('email')} required {...fv.fieldProps('email')} />
                </Field>
              </div>
            </SectionBlock>

            <SectionBlock icon="🏬" title="Branches/Location">
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowBranchModal(true)}>
                  + Add Branch/Location
                </button>
              </div>
              <BranchLocationSection form={form} setForm={setForm} />
            </SectionBlock>

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
              <ContactInfoSection form={form} setForm={setForm} />
            </SectionBlock>

            <div className="actions-row">
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/ic')}>Cancel</button>
              <button type="submit" className="btn btn-primary">Update IC</button>
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
