'use client'

import React, { createContext, useContext, useState } from 'react'
import datas from 'app/data/data.json'

const SearchContext = createContext()

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState(datas.listings)

  const searchListings = (query) => {
    const filteredListings = datas.listings.filter(listing =>
      listing.title.toLowerCase().includes(query.toLowerCase()) ||
      listing.description.toLowerCase().includes(query.toLowerCase()) ||
      listing.category.toLowerCase().includes(query.toLowerCase())
    )
    setSearchResults(filteredListings)
  }

  return (
    <SearchContext.Provider value={{ searchResults, searchListings }}>
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}