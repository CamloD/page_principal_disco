'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'es'
    setLanguage(savedLanguage)
  }, [])

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  const t = (key) => {
    const translations = {
      es: {
        title: 'Bienvenido a TravelEase',
        findYourNextAdventure: 'Encuentra tu próxima aventura',
        location: 'Ubicación',
        whereTo: '¿A dónde vas?',
        dates: 'Fechas',
        addDates: 'Añadir fechas',
        guests: 'Huéspedes',
        guest: 'huésped',
        addGuests: 'Añadir huéspedes',
        search: 'Buscar',
        login: 'Iniciar sesión',
        register: 'Registrarse',
        email: 'Correo electrónico',
        password: 'Contraseña',
        name: 'Nombre',
        noAccount: '¿No tienes una cuenta?',
        haveAccount: '¿Ya tienes una cuenta?',
        loading: 'Cargando...',
        invalidEmail: 'Por favor, introduce un correo electrónico válido',
        passwordTooShort: 'La contraseña debe tener al menos 6 caracteres',
        lightMode: 'Modo claro',
        darkMode: 'Modo oscuro',
        changeLanguage: 'Cambiar idioma',
        viewDetails: 'Ver detalles',
        todo: 'Todo',
        hoteles: 'Hoteles',
        vehiculos: 'Vehículos',
        playas: 'Playas',
        discotecas: 'Discotecas',
        vuelos: 'Vuelos',
        restaurantes: 'Restaurantes',
        eventos: 'Eventos',
        compras: 'Compras',
        servicios: 'Servicios',
        show: 'Mostrar',
        hide: 'Ocultar',
        date: 'Fecha',
        category: 'Categoría',
        selectCategory: 'Seleccionar categoría',
        price: 'Precio',
      },
      en: {
        title: 'Welcome to TravelEase',
        findYourNextAdventure: 'Find your next adventure',
        location: 'Location',
        whereTo: 'Where are you going?',
        dates: 'Dates',
        addDates: 'Add dates',
        guests: 'Guests',
        guest: 'guest',
        addGuests: 'Add guests',
        search: 'Search',
        login: 'Log in',
        register: 'Sign up',
        email: 'Email',
        password: 'Password',
        name: 'Name',
        noAccount: "Don't have an account?",
        haveAccount: 'Already have an account?',
        loading: 'Loading...',
        invalidEmail: 'Please enter a valid email address',
        passwordTooShort: 'Password must be at least 6 characters long',
        lightMode: 'Light mode',
        darkMode: 'Dark mode',
        changeLanguage: 'Change language',
        viewDetails: 'View details',
        todo: 'All',
        hoteles: 'Hotels',
        vehiculos: 'Vehicles',
        playas: 'Beaches',
        discotecas: 'Nightclubs',
        vuelos: 'Flights',
        restaurantes: 'Restaurants',
        eventos: 'Events',
        compras: 'Shopping',
        servicios: 'Services',
        show: 'Show',
        hide: 'Hide',
        date: 'Date',
        category: 'Category',
        selectCategory: 'Select category',
        price: 'Price',
      },
    }

    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)

  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }

  return context
}