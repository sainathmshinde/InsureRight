import { useState } from 'react'

const INITIAL = {
  productName: '',
  productCode: '',
  insuranceType: '',
  icName: '',
  category: '',
  basePremium: '',
  sumInsuredOptions: '',
  gstPercent: '18',
  totalPremium: '',
  policyWordingsFile: null,
  coverageDetails: '',
  addOns: [],
  policyType: 'Base',
  basePolicyId: '',
  tenureOptions: [],
  waitingPeriod: '',
  roomRentLimit: '',
  diseaseRestrictions: '',
  eligibilityCriteria: '',
  ageMin: '',
  ageMax: '',
  geography: '',
  exclusions: '',
  notes: '',
  icApiProductId: '',
  status: 'Active',
}

export default function useProductForm(initial = INITIAL) {
  const [form, setForm] = useState({ ...INITIAL, ...initial })

  const set = field => e => setForm(p => ({ ...p, [field]: e.target.value }))
  const setFile = field => e => setForm(p => ({ ...p, [field]: e.target.files[0] ?? null }))
  const setArr = field => val => setForm(p => ({ ...p, [field]: val }))

  // auto-calculate total premium whenever base or GST changes
  const setPremium = field => e => {
    const val = e.target.value
    setForm(p => {
      const updated = { ...p, [field]: val }
      const base = parseFloat(field === 'basePremium' ? val : p.basePremium) || 0
      const gst  = parseFloat(field === 'gstPercent'  ? val : p.gstPercent)  || 0
      updated.totalPremium = base > 0 ? (base + base * gst / 100).toFixed(2) : ''
      return updated
    })
  }

  return { form, set, setFile, setArr, setPremium, setForm }
}
