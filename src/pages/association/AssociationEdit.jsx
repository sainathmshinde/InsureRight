import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Field, Input, Select, SectionBlock } from '../../components/Field'
import { GroupIcon } from '../../icons'
import { useAssociations } from './AssociationContext'
import { ORGANISATIONS, STATES } from '../customer/orgAssocData'

export default function AssociationEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { associations, addAssociation, updateAssociation } = useAssociations()

  const isCreate = !id
  const existing = isCreate ? null : associations.find(a => a.id === Number(id))

  const BLANK = { name: '', orgId: '', parentId: null, address1: '', address2: '', city: '', stateId: '', pinCode: '', associationCode: '', isActive: true }
  const [form, setForm] = useState(existing ?? BLANK)

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const siblingsForParent = associations.filter(a =>
    a.orgId === Number(form.orgId) && a.id !== Number(id)
  )

  const handleSubmit = e => {
    e.preventDefault()
    const payload = {
      ...form,
      orgId:    Number(form.orgId)    || null,
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
          <div className="page-icon"><GroupIcon /></div>
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

            {/* Basic Info */}
            <SectionBlock icon="🤝" title="Association Details">
              <div className="form-grid">
                <Field label="Association Name" required className="col-span-2">
                  <Input
                    placeholder="Full association name"
                    value={form.name}
                    onChange={set('name')}
                    required
                  />
                </Field>
                <Field label="Organisation" required>
                  <Select
                    value={form.orgId}
                    onChange={e => setForm(p => ({ ...p, orgId: e.target.value, parentId: null }))}
                    required
                  >
                    <option value="">Select organisation</option>
                    {ORGANISATIONS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </Select>
                </Field>
                <Field label="Parent Association">
                  <Select
                    value={form.parentId ?? ''}
                    onChange={e => setForm(p => ({ ...p, parentId: e.target.value || null }))}
                    disabled={!form.orgId}
                  >
                    <option value="">{form.orgId ? 'None (top-level)' : 'Select organisation first'}</option>
                    {siblingsForParent.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </Select>
                </Field>
                <Field label="Association Code">
                  <Input
                    placeholder="e.g. CCD00872530012"
                    value={form.associationCode ?? ''}
                    onChange={set('associationCode')}
                  />
                </Field>
                <Field label="Status">
                  <div style={{ display: 'flex', gap: 20, alignItems: 'center', paddingTop: 6 }}>
                    {[{ label: 'Active', value: true }, { label: 'Inactive', value: false }].map(opt => (
                      <label key={opt.label} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 14 }}>
                        <input
                          type="radio"
                          name="isActive"
                          checked={form.isActive === opt.value}
                          onChange={() => setForm(p => ({ ...p, isActive: opt.value }))}
                          style={{ accentColor: 'var(--brand)', width: 16, height: 16 }}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </Field>
              </div>
            </SectionBlock>

            {/* Address */}
            <SectionBlock icon="📍" title="Address">
              <div className="form-grid">
                <Field label="Address Line 1">
                  <Input placeholder="Street / Building" value={form.address1} onChange={set('address1')} />
                </Field>
                <Field label="Address Line 2">
                  <Input placeholder="Area / Locality" value={form.address2} onChange={set('address2')} />
                </Field>
                <Field label="City">
                  <Input placeholder="City" value={form.city} onChange={set('city')} />
                </Field>
                <Field label="State">
                  <Select value={form.stateId} onChange={set('stateId')}>
                    <option value="">Select state</option>
                    {STATES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </Select>
                </Field>
                <Field label="PIN Code">
                  <Input placeholder="400001" maxLength={6} value={form.pinCode} onChange={set('pinCode')} />
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
    </div>
  )
}
