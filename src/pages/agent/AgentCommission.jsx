import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Field, Input, Select, SectionBlock } from '../../components/Field'

const MOCK_RULES = [
  { id: 1, type: 'Health',  basis: 'Sales Amount', minAmount: '0',       maxAmount: '50000',  percentage: '15', timePeriod: 'Monthly' },
  { id: 2, type: 'Health',  basis: 'Sales Amount', minAmount: '50001',   maxAmount: '200000', percentage: '18', timePeriod: 'Monthly' },
  { id: 3, type: 'Motor',   basis: 'Premium',      minAmount: '0',       maxAmount: '10000',  percentage: '12', timePeriod: 'Quarterly' },
  { id: 4, type: 'Life',    basis: 'Sales Amount', minAmount: '100000',  maxAmount: '',       percentage: '20', timePeriod: 'Yearly' },
]

const EMPTY_RULE = { type: '', basis: '', minAmount: '', maxAmount: '', percentage: '', timePeriod: '' }

export default function AgentCommission() {
  const navigate = useNavigate()
  const [rules, setRules] = useState(MOCK_RULES)
  const [form, setForm] = useState(EMPTY_RULE)
  const [adding, setAdding] = useState(false)
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleAdd = e => {
    e.preventDefault()
    setRules(prev => [...prev, { ...form, id: Date.now() }])
    setForm(EMPTY_RULE)
    setAdding(false)
  }

  const handleDelete = id => setRules(prev => prev.filter(r => r.id !== id))

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon">💰</div>
          <div>
            <div className="page-title">Commission Rules</div>
            <div className="page-subtitle">Define payout rules by insurance type, amount and period</div>
          </div>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost" onClick={() => navigate('/agent')}>← Back</button>
          <button className="btn btn-primary" onClick={() => setAdding(true)}>+ Add Rule</button>
        </div>
      </div>

      {/* Add Rule Form */}
      {adding && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">New Commission Rule</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setAdding(false)}>✕ Cancel</button>
          </div>
          <div className="card-body">
            <form onSubmit={handleAdd}>
              <div className="form-grid-3">
                <Field label="Insurance Type" required>
                  <Select value={form.type} onChange={set('type')} required>
                    <option value="">Select type</option>
                    <option>Health</option><option>Motor</option><option>Life</option>
                  </Select>
                </Field>
                <Field label="Commission Basis" required>
                  <Select value={form.basis} onChange={set('basis')} required>
                    <option value="">Select basis</option>
                    <option>Sales Amount</option><option>Premium</option>
                  </Select>
                </Field>
                <Field label="Time Period" required>
                  <Select value={form.timePeriod} onChange={set('timePeriod')} required>
                    <option value="">Select period</option>
                    <option>Monthly</option><option>Quarterly</option><option>Yearly</option>
                  </Select>
                </Field>
                <Field label="Min Amount (₹)">
                  <Input type="number" min="0" placeholder="0" value={form.minAmount} onChange={set('minAmount')} />
                </Field>
                <Field label="Max Amount (₹)">
                  <Input type="number" min="0" placeholder="Leave blank for no limit" value={form.maxAmount} onChange={set('maxAmount')} />
                </Field>
                <Field label="Commission %" required>
                  <Input type="number" min="0" max="100" step="0.1" placeholder="e.g. 15" value={form.percentage} onChange={set('percentage')} required />
                </Field>
              </div>
              <div className="actions-row">
                <button type="button" className="btn btn-ghost" onClick={() => setAdding(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rules Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Active Commission Rules ({rules.length})</span>
        </div>
        <div className="card-body">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Insurance Type</th><th>Basis</th>
                  <th>Min Amount</th><th>Max Amount</th>
                  <th>Commission %</th><th>Period</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rules.map(r => (
                  <tr key={r.id}>
                    <td><span className={`badge ${r.type === 'Health' ? 'badge-green' : r.type === 'Motor' ? 'badge-blue' : 'badge-purple'}`}>{r.type}</span></td>
                    <td>{r.basis}</td>
                    <td>₹{Number(r.minAmount).toLocaleString('en-IN')}</td>
                    <td>{r.maxAmount ? `₹${Number(r.maxAmount).toLocaleString('en-IN')}` : <span style={{ color: 'var(--text-3)' }}>No limit</span>}</td>
                    <td style={{ fontWeight: 600, color: 'var(--brand)' }}>{r.percentage}%</td>
                    <td>{r.timePeriod}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
