'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser({
        ...parsedUser,
        photo: parsedUser.photo || '/default-avatar.png'
      })
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    const userWithPhoto = {
      ...userData,
      photo: userData.photo || '/default-avatar.png'
    }
    setUser(userWithPhoto)
    localStorage.setItem('user', JSON.stringify(userWithPhoto))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const register = (userData) => {
    const newUser = {
      ...userData,
      photo: userData.photo || '/default-avatar.png'
    }
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    login(newUser)
  }

  const updateUser = (updatedUserData) => {
    const newUserData = {
      ...updatedUserData,
      photo: updatedUserData.photo || '/default-avatar.png'
    }
    setUser(newUserData)
    localStorage.setItem('user', JSON.stringify(newUserData))
    
    // Update user in the users array
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const updatedUsers = users.map(u => u.email === newUserData.email ? newUserData : u)
    localStorage.setItem('users', JSON.stringify(updatedUsers))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)