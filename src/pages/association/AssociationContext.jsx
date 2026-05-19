import { createContext, useContext, useState } from 'react'
import { ASSOCIATIONS } from '../customer/orgAssocData'

const AssociationContext = createContext(null)

export function AssociationProvider({ children }) {
  const [associations, setAssociations] = useState(ASSOCIATIONS)

  const addAssociation = (data) => {
    const newId = Math.max(...associations.map(a => a.id)) + 1
    setAssociations(prev => [...prev, { ...data, id: newId }])
  }

  const updateAssociation = (id, data) => {
    setAssociations(prev => prev.map(a => a.id === id ? { ...a, ...data } : a))
  }

  return (
    <AssociationContext.Provider value={{ associations, addAssociation, updateAssociation }}>
      {children}
    </AssociationContext.Provider>
  )
}

export function useAssociations() {
  return useContext(AssociationContext)
}
