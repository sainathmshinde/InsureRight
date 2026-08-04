import { createContext, useContext, useState } from 'react'
import { ORGANISATIONS } from '../member/orgAssocData'

const OrganisationContext = createContext(null)

export function OrganisationProvider({ children }) {
  const [organisations, setOrganisations] = useState(ORGANISATIONS)

  const addOrganisation = (data) => {
    const newId = Math.max(...organisations.map(o => o.id)) + 1
    setOrganisations(prev => [...prev, { ...data, id: newId }])
  }

  const updateOrganisation = (id, data) => {
    setOrganisations(prev => prev.map(o => o.id === id ? { ...o, ...data } : o))
  }

  const deleteOrganisation = (id) => {
    setOrganisations(prev => prev.filter(o => o.id !== id))
  }

  return (
    <OrganisationContext.Provider value={{ organisations, addOrganisation, updateOrganisation, deleteOrganisation }}>
      {children}
    </OrganisationContext.Provider>
  )
}

export function useOrganisations() {
  return useContext(OrganisationContext)
}
