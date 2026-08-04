import { createContext, useContext, useState } from 'react'
import { ASSOCIATIONS } from '../member/orgAssocData'

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

  const deleteAssociation = (id) => {
    setAssociations(prev => prev.filter(a => a.id !== id))
  }

  return (
    <AssociationContext.Provider value={{ associations, addAssociation, updateAssociation, deleteAssociation }}>
      {children}
    </AssociationContext.Provider>
  )
}

export function useAssociations() {
  return useContext(AssociationContext)
}
