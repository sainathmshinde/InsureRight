/* Shared form state for Broker Create / Edit */
import { useState } from 'react'

export const INITIAL = {
  // Basic
  brokerName: '', companyName: '', brokerType: '', licenseNumber: '',
  licenseValidity: '', gstNumber: '',
  // KYC
  panNumber: '', aadhaarNumber: '', kycStatus: 'Pending',
  panFile: null, aadhaarFile: null,
  // Contact
  email: '', mobile: '', alternateContact: '', website: '',
  // Address
  registeredAddress: '', communicationAddress: '',
  city: '', state: '', pincode: '',
  // Bank
  accountHolder: '', bankName: '', accountNumber: '',
  ifscCode: '', cancelledCheque: null,
  // Agreement
  agreementFile: null, agreementStart: '', agreementEnd: '',
  complianceNotes: '', status: 'Active',
}

export function useBrokerForm(initial = INITIAL) {
  const [form, setForm] = useState(initial)

  const set = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const setFile = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.files[0] ?? null }))

  return { form, set, setFile, setForm }
}
