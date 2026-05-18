import { createContext, useContext, useState } from 'react'

export const INITIAL_CUSTOMERS = [
  { id: 1,  name: 'Aarav Sharma',  mobile: '9876543210', email: 'aarav@gmail.com',  dob: '1990-03-15', gender: 'Male',   kyc: 'Verified',  policies: 1, agentId: 'a1', organisationId: 1003, associationId: 1007 },
  { id: 2,  name: 'Rohit Sharma',  mobile: '9812000000', email: 'rohit@gmail.com',  dob: '1990-11-20', gender: 'Male',   kyc: 'Pending',   policies: 0, agentId: 'a2', organisationId: 1005, associationId: 1033 },
  { id: 3,  name: 'Divya Nair',    mobile: '9911223344', email: 'divya@gmail.com',  dob: '1978-06-05', gender: 'Female', kyc: 'Verified',  policies: 3, agentId: 'a1', organisationId: 1006, associationId: 1023 },
  { id: 4,  name: 'Vijay Patil',   mobile: '9011223344', email: 'vijay@gmail.com',  dob: '1995-09-30', gender: 'Male',   kyc: 'Rejected',  policies: 0, agentId: 'a2', organisationId: 1005, associationId: 1019 },
  { id: 5,  name: 'Suresh Kumar',  mobile: '9988001122', email: 'suresh@gmail.com', dob: '1985-03-20', gender: 'Male',   kyc: 'Verified',  policies: 1, agentId: 'a1', organisationId: 1003, associationId: 1025 },
  { id: 6,  name: 'Vikram Rao',    mobile: '9944556677', email: 'vikram@gmail.com', dob: '1975-08-20', gender: 'Male',   kyc: 'Verified',  policies: 2, agentId: 'a1', organisationId: 1019, associationId: 1021 },
  { id: 7,  name: 'Kavita Pillai', mobile: '9899112233', email: 'kavita@gmail.com', dob: '1993-12-01', gender: 'Female', kyc: 'Verified',  policies: 1, agentId: 'a1', organisationId: 1012, associationId: 1058 },
  { id: 8,  name: 'Arjun Singh',   mobile: '9922334455', email: 'arjun@gmail.com',  dob: '1987-03-22', gender: 'Male',   kyc: 'Verified',  policies: 0, agentId: 'a1', organisationId: 1003, associationId: 1007 },
  { id: 9,  name: 'Priya Mehta',   mobile: '9812345678', email: 'priya@gmail.com',  dob: '1992-07-10', gender: 'Female', kyc: 'Verified',  policies: 1, agentId: 'a1', organisationId: 1013, associationId: 1027 },
  { id: 10, name: 'Rahul Gupta',   mobile: '9966778899', email: 'rahul@gmail.com',  dob: '1980-01-05', gender: 'Male',   kyc: 'Verified',  policies: 1, agentId: 'a1', organisationId: 1008, associationId: 1032 },
  { id: 11, name: 'Ritu Singh',    mobile: '9833221100', email: 'ritu@gmail.com',   dob: '1996-05-18', gender: 'Female', kyc: 'Pending',   policies: 0, agentId: 'a2', organisationId: 1015, associationId: 1008 },
  { id: 12, name: 'Ajay Iyer',     mobile: '9822110099', email: 'ajay@gmail.com',   dob: '1983-10-30', gender: 'Male',   kyc: 'Rejected',  policies: 0, agentId: 'a2', organisationId: 1012, associationId: 1030 },
]

const CustomerContext = createContext(null)

export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS)

  const updateKycStatus = (id, status) => {
    setCustomers(prev =>
      prev.map(c => c.id === Number(id) ? { ...c, kyc: status } : c)
    )
  }

  return (
    <CustomerContext.Provider value={{ customers, updateKycStatus }}>
      {children}
    </CustomerContext.Provider>
  )
}

export function useCustomers() {
  return useContext(CustomerContext)
}
