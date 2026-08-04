import { createContext, useContext, useState } from 'react'

const _FN = ['Amit','Priya','Rahul','Sneha','Suresh','Geeta','Mohit','Divya','Ravi','Pooja','Kiran','Ajay','Nisha','Saurabh','Deepa','Vikram','Kavita','Ashok','Sunita','Manoj','Rekha','Rajesh','Neha','Arun','Meera','Vinod','Usha','Gaurav','Swati','Naveen','Asha','Sanjay','Radha','Tarun','Lata','Deepak','Poonam','Girish','Madhuri','Sunil']
const _LN = ['Sharma','Verma','Singh','Gupta','Patel','Kumar','Mishra','Joshi','Rao','Nair','Pillai','Iyer','Reddy','Shah','Mehta','Jain','Pandey','Tiwari','Yadav','Sinha','Kulkarni','Bose','Nambiar','Agarwal','Saxena']
const _CD = [[5,'Campaign OPD and DIGIT PAYMENT PROTECTION'],[6,'BPP Campaign'],[8,'SBI_STP_Campaign'],[11,'BPP Campaign_2026-2027'],[12,'Standalone campaign']]
const _KYC = ['Verified','Verified','Verified','Verified','Pending','Rejected']
const _ORG = [1003,1005,1006,1008,1012,1013,1015,1019]
const _ASC = [1007,1008,1019,1021,1023,1025,1027,1030,1032,1033,1058]
const _EXTRA = Array.from({length:216},(_,i)=>{
  const id = i+33; const kyc=_KYC[id%_KYC.length]; const [cid,cn]=_CD[id%_CD.length]
  return { id, name:`${_FN[id%_FN.length]} ${_LN[Math.floor(id/7)%_LN.length]}`, mobile:`987${String(id).padStart(7,'0')}`, email:`cust${id}@email.com`, dob:`${1975+(id%28)}-${String((id%12)+1).padStart(2,'0')}-${String((id%28)+1).padStart(2,'0')}`, gender:id%3===0?'Female':'Male', kyc, policies:kyc==='Verified'?id%3:0, agentId:id%2===0?'a2':'a1', organisationId:_ORG[id%_ORG.length], associationId:_ASC[id%_ASC.length], campaignId:cid, campaignName:cn, engaged:kyc==='Verified'&&id%5!==0 }
})

export const INITIAL_MEMBERS = [
  { id: 1,  name: 'Aarav Sharma',  mobile: '9876543210', email: 'aarav@gmail.com',  dob: '1990-03-15', gender: 'Male',   kyc: 'Verified',  policies: 1, agentId: 'a1', organisationId: 1003, associationId: 1007, campaignId: 11, campaignName: 'BPP Campaign_2026-2027',              engaged: true  },
  { id: 2,  name: 'Rohit Sharma',  mobile: '9812000000', email: 'rohit@gmail.com',  dob: '1990-11-20', gender: 'Male',   kyc: 'Pending',   policies: 0, agentId: 'a2', organisationId: 1005, associationId: 1033, campaignId: 8,  campaignName: 'SBI_STP_Campaign',                    engaged: false },
  { id: 3,  name: 'Divya Nair',    mobile: '9911223344', email: 'divya@gmail.com',  dob: '1978-06-05', gender: 'Female', kyc: 'Verified',  policies: 3, agentId: 'a1', organisationId: 1006, associationId: 1023, campaignId: 5,  campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', engaged: true  },
  { id: 4,  name: 'Vijay Patil',   mobile: '9011223344', email: 'vijay@gmail.com',  dob: '1995-09-30', gender: 'Male',   kyc: 'Rejected',  policies: 0, agentId: 'a2', organisationId: 1005, associationId: 1019, campaignId: 6,  campaignName: 'BPP Campaign',                        engaged: false },
  { id: 5,  name: 'Suresh Kumar',  mobile: '9988001122', email: 'suresh@gmail.com', dob: '1985-03-20', gender: 'Male',   kyc: 'Verified',  policies: 1, agentId: 'a1', organisationId: 1003, associationId: 1025, campaignId: 1,  campaignName: 'Campaign 1',                          engaged: true  },
  { id: 6,  name: 'Vikram Rao',    mobile: '9944556677', email: 'vikram@gmail.com', dob: '1975-08-20', gender: 'Male',   kyc: 'Verified',  policies: 2, agentId: 'a1', organisationId: 1019, associationId: 1021, campaignId: 11, campaignName: 'BPP Campaign_2026-2027',              engaged: true  },
  { id: 7,  name: 'Kavita Pillai', mobile: '9899112233', email: 'kavita@gmail.com', dob: '1993-12-01', gender: 'Female', kyc: 'Verified',  policies: 1, agentId: 'a1', organisationId: 1012, associationId: 1058, campaignId: 8,  campaignName: 'SBI_STP_Campaign',                    engaged: true  },
  { id: 8,  name: 'Arjun Singh',   mobile: '9922334455', email: 'arjun@gmail.com',  dob: '1987-03-22', gender: 'Male',   kyc: 'Verified',  policies: 0, agentId: 'a1', organisationId: 1003, associationId: 1007, campaignId: 5,  campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', engaged: false },
  { id: 9,  name: 'Priya Mehta',   mobile: '9812345678', email: 'priya@gmail.com',  dob: '1992-07-10', gender: 'Female', kyc: 'Verified',  policies: 1, agentId: 'a1', organisationId: 1013, associationId: 1027, campaignId: 11, campaignName: 'BPP Campaign_2026-2027',              engaged: true  },
  { id: 10, name: 'Rahul Gupta',   mobile: '9966778899', email: 'rahul@gmail.com',  dob: '1980-01-05', gender: 'Male',   kyc: 'Verified',  policies: 1, agentId: 'a1', organisationId: 1008, associationId: 1032, campaignId: 1,  campaignName: 'Campaign 1',                          engaged: true  },
  { id: 11, name: 'Ritu Singh',    mobile: '9833221100', email: 'ritu@gmail.com',   dob: '1996-05-18', gender: 'Female', kyc: 'Pending',   policies: 0, agentId: 'a2', organisationId: 1015, associationId: 1008, campaignId: 6,  campaignName: 'BPP Campaign',                        engaged: false },
  { id: 12, name: 'Ajay Iyer',       mobile: '9822110099', email: 'ajay@gmail.com',      dob: '1983-10-30', gender: 'Male',   kyc: 'Rejected', policies: 0, agentId: 'a2', organisationId: 1012, associationId: 1030, campaignId: 12, campaignName: 'Standalone campaign',                      engaged: false },

  // Campaign OPD and DIGIT PAYMENT PROTECTION (campaignId: 5)
  { id: 13, name: 'Meera Pillai',    mobile: '9871234501', email: 'meera.pillai@gmail.com',    dob: '1988-04-12', gender: 'Female', kyc: 'Verified', policies: 2, agentId: 'a1', organisationId: 1006, associationId: 1023, campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', engaged: true  },
  { id: 14, name: 'Karan Malhotra',  mobile: '9871234502', email: 'karan.malhotra@gmail.com',  dob: '1991-07-25', gender: 'Male',   kyc: 'Verified', policies: 1, agentId: 'a1', organisationId: 1008, associationId: 1032, campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', engaged: true  },
  { id: 15, name: 'Ananya Desai',    mobile: '9871234503', email: 'ananya.desai@gmail.com',    dob: '1995-02-18', gender: 'Female', kyc: 'Pending',  policies: 0, agentId: 'a2', organisationId: 1005, associationId: 1033, campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', engaged: false },
  { id: 16, name: 'Sanjay Reddy',    mobile: '9871234504', email: 'sanjay.reddy@gmail.com',    dob: '1979-11-03', gender: 'Male',   kyc: 'Verified', policies: 3, agentId: 'a1', organisationId: 1019, associationId: 1021, campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', engaged: true  },
  { id: 17, name: 'Pooja Krishnan',  mobile: '9871234505', email: 'pooja.krishnan@gmail.com',  dob: '1993-08-30', gender: 'Female', kyc: 'Verified', policies: 1, agentId: 'a1', organisationId: 1013, associationId: 1027, campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', engaged: true  },
  { id: 18, name: 'Rajan Nambiar',   mobile: '9871234506', email: 'rajan.nambiar@gmail.com',   dob: '1985-01-14', gender: 'Male',   kyc: 'Rejected', policies: 0, agentId: 'a2', organisationId: 1015, associationId: 1008, campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', engaged: false },
  { id: 19, name: 'Shreya Agarwal',  mobile: '9871234507', email: 'shreya.agarwal@gmail.com',  dob: '1997-05-22', gender: 'Female', kyc: 'Verified', policies: 1, agentId: 'a1', organisationId: 1003, associationId: 1007, campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', engaged: true  },
  { id: 20, name: 'Manish Tiwari',   mobile: '9871234508', email: 'manish.tiwari@gmail.com',   dob: '1982-09-09', gender: 'Male',   kyc: 'Verified', policies: 2, agentId: 'a2', organisationId: 1012, associationId: 1058, campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', engaged: true  },
  { id: 21, name: 'Deepika Shetty',  mobile: '9871234509', email: 'deepika.shetty@gmail.com',  dob: '1990-12-17', gender: 'Female', kyc: 'Verified', policies: 1, agentId: 'a1', organisationId: 1006, associationId: 1023, campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', engaged: true  },
  { id: 22, name: 'Akash Pandey',    mobile: '9871234510', email: 'akash.pandey@gmail.com',    dob: '1994-03-28', gender: 'Male',   kyc: 'Pending',  policies: 0, agentId: 'a2', organisationId: 1005, associationId: 1019, campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', engaged: false },
  { id: 23, name: 'Neha Joshi',      mobile: '9871234511', email: 'neha.joshi@gmail.com',      dob: '1987-06-11', gender: 'Female', kyc: 'Verified', policies: 2, agentId: 'a1', organisationId: 1008, associationId: 1025, campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', engaged: true  },
  { id: 24, name: 'Vivek Saxena',    mobile: '9871234512', email: 'vivek.saxena@gmail.com',    dob: '1980-10-05', gender: 'Male',   kyc: 'Verified', policies: 1, agentId: 'a1', organisationId: 1019, associationId: 1021, campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', engaged: true  },
  { id: 25, name: 'Priyanka Mishra', mobile: '9871234513', email: 'priyanka.mishra@gmail.com', dob: '1996-02-07', gender: 'Female', kyc: 'Pending',  policies: 0, agentId: 'a2', organisationId: 1015, associationId: 1008, campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', engaged: false },
  { id: 26, name: 'Rohini Iyengar',  mobile: '9871234514', email: 'rohini.iyengar@gmail.com',  dob: '1984-08-19', gender: 'Female', kyc: 'Verified', policies: 3, agentId: 'a1', organisationId: 1013, associationId: 1027, campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', engaged: true  },
  { id: 27, name: 'Sunil Mehta',     mobile: '9871234515', email: 'sunil.mehta@gmail.com',     dob: '1977-04-23', gender: 'Male',   kyc: 'Verified', policies: 2, agentId: 'a2', organisationId: 1003, associationId: 1032, campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', engaged: true  },
  { id: 28, name: 'Kavya Sharma',    mobile: '9871234516', email: 'kavya.sharma@gmail.com',    dob: '1998-11-30', gender: 'Female', kyc: 'Rejected', policies: 0, agentId: 'a2', organisationId: 1012, associationId: 1030, campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', engaged: false },
  { id: 29, name: 'Aditya Kumar',    mobile: '9871234517', email: 'aditya.kumar@gmail.com',    dob: '1992-07-16', gender: 'Male',   kyc: 'Verified', policies: 1, agentId: 'a1', organisationId: 1008, associationId: 1007, campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', engaged: true  },
  { id: 30, name: 'Swati Bose',      mobile: '9871234518', email: 'swati.bose@gmail.com',      dob: '1986-01-08', gender: 'Female', kyc: 'Verified', policies: 2, agentId: 'a1', organisationId: 1006, associationId: 1023, campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', engaged: true  },
  { id: 31, name: 'Harish Rao',      mobile: '9871234519', email: 'harish.rao@gmail.com',      dob: '1975-09-14', gender: 'Male',   kyc: 'Pending',  policies: 0, agentId: 'a2', organisationId: 1019, associationId: 1021, campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', engaged: false },
  { id: 32, name: 'Nandini Gupta',   mobile: '9871234520', email: 'nandini.gupta@gmail.com',   dob: '1989-03-26', gender: 'Female', kyc: 'Verified', policies: 1, agentId: 'a1', organisationId: 1013, associationId: 1058, campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', engaged: true  },
  ..._EXTRA,
]

const MemberContext = createContext(null)

export function MemberProvider({ children }) {
  const [members, setMembers] = useState(INITIAL_MEMBERS)

  const updateKycStatus = (id, status) => {
    setMembers(prev =>
      prev.map(c => c.id === Number(id) ? { ...c, kyc: status } : c)
    )
  }

  const deleteMember = (id) => {
    setMembers(prev => prev.filter(c => c.id !== Number(id)))
  }

  return (
    <MemberContext.Provider value={{ members, updateKycStatus, deleteMember }}>
      {children}
    </MemberContext.Provider>
  )
}

export function useMembers() {
  return useContext(MemberContext)
}
