'use client'

import React, { createContext, useContext, useState } from 'react'

const SelectedListingContext = createContext()

export function SelectedListingProvider({ children }) {
  const [selectedListing, setSelectedListing] = useState(null)

  return (
    <SelectedListingContext.Provider value={{ selectedListing, setSelectedListing }}>
      {children}
    </SelectedListingContext.Provider>
  )
}

export function useSelectedListing() {
  const context = useContext(SelectedListingContext)
  if (!context) {
    throw new Error('useSelectedListing must be used within a SelectedListingProvider')
  }
  return context
}