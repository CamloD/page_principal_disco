'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext(null)

const translations = {
  es: {
    title: 'Bienvenido a TravelEase',
    findYourNextAdventure: 'Encuentra tu próxima aventura',
    location: 'Ubicación',
    whereTo: '¿A dónde vas?',
    dates: 'Fechas',
    addDates: 'Añadir fechas',
    selectDates: 'Seleccionar fechas',
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
    changePhoto: 'Cambiar foto',
    userProfile: 'Perfil de usuario',
    saveChanges: 'Guardar cambios',
    userPhoto: 'Foto de usuario',
    deleteAccount: "Eliminar cuenta",
    areYouSure: "¿Estás seguro?",
    deleteAccountConfirmation: "Esta acción no se puede deshacer. Por favor, escribe 'eliminar cuenta' para confirmar.",
    typeDeleteAccountToConfirm: "Escribe 'eliminar cuenta' para confirmar",
    cancel: "Cancelar",
    checkout: "Pago",
    cardNumber: "Número de Tarjeta",
    expiryDate: "Fecha de Vencimiento",
    cvv: "CVV",
    payNow: "Pagar Ahora",
    translate: "Traducir",
    profile: "Perfil",
    logout: "Cerrar sesión",
    cart: "Carrito",
    gridView: "Vista de cuadrícula",
    listView: "Vista de lista",
    addToCart: "Añadir al carrito",
    remove: "Eliminar",
    total: "Total",
    proceedToCheckout: "Proceder al pago",
    shoppingCart: "Carrito de compras",
    cropImage: "Recortar imagen",
    zoom: "Zoom",
    save: "Guardar",
    tellUsAboutYourself: "Cuéntanos sobre ti",
    bio: "Biografía",
    removePhoto: "Eliminar foto",
    selectDates: 'Seleccionar fechas',
    lightMode: 'Modo claro',
    darkMode: 'Modo oscuro',
    translate: 'Traducir',
    cartEmpty: 'El carrito está vacío',
    continueShopping: 'Continuar comprando',
    selectDates: 'Seleccionar fechas',
    lightMode: 'Modo claro',
    darkMode: 'Modo oscuro',
    translate: 'Traducir',
    googleTranslate: 'Traductor de Google',
    es: 'Español',
    en: 'Inglés',
    fullName: 'Nombre completo',
    address: 'Dirección',
    city: 'Ciudad',
    country: 'País',
    zipCode: 'Código postal',
    placeOrder: 'Realizar pedido',
    orderPlaced: 'Pedido realizado',
  },
  en: {
    title: 'Welcome to TravelEase',
    findYourNextAdventure: 'Find your next adventure',
    location: 'Location',
    whereTo: 'Where are you going?',
    dates: 'Dates',
    addDates: 'Add dates',
    selectDates: 'Select dates',
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
    changePhoto: 'Change photo',
    userProfile: 'User profile',
    saveChanges: 'Save changes',
    userPhoto: 'User photo',
    deleteAccount: "Delete account",
    areYouSure: "Are you sure?",
    deleteAccountConfirmation: "This action cannot be undone. Please type 'delete account' to confirm.",
    typeDeleteAccountToConfirm: "Type 'delete account' to confirm",
    cancel: "Cancel",
    checkout: "Checkout",
    cardNumber: "Card Number",
    expiryDate: "Expiry Date",
    cvv: "CVV",
    payNow: "Pay Now",
    translate: "Translate",
    profile: "Profile",
    logout: "Log out",
    cart: "Cart",
    gridView: "Grid view",
    listView: "List view",
    addToCart: "Add to cart",
    remove: "Remove",
    total: "Total",
    proceedToCheckout: "Proceed to checkout",
    shoppingCart: "Shopping Cart",
    cropImage: "Crop Image",
    zoom: "Zoom",
    save: "Save",
    tellUsAboutYourself: "Tell us about yourself",
    bio: "Bio",
    removePhoto: "Remove photo",
    selectDates: 'Select dates',
    lightMode: 'Light mode',
    darkMode: 'Dark mode',
    translate: 'Translate',
    cartEmpity: 'Your cart is empty',
    continueShopping: 'Continue shopping',
    selectDates: 'Select dates',
    lightMode: 'Light mode',
    darkMode: 'Dark mode',
    translate: 'Translate',
    googleTranslate: 'Google Translate',
    es: 'Spanish',
    en: 'English',
    fullName: 'Full name',
    address: 'Address',
    city: 'City',
    country: 'Country',
    zipCode: 'Zip code',
    placeOrder: 'Place order',
    orderPlaced: 'Order placed',
  },
  
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'es'
    setLanguage(savedLanguage)
  }, [])

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage)
      localStorage.setItem('language', newLanguage)
    } else {
      console.error(`Language ${newLanguage} is not supported.`)
    }
  }

  const t = (key) => {
    if (!translations[language]) {
      console.error(`Language ${language} is not supported.`)
      return key
    }
    return translations[language][key] || key
  }

  const availableLanguages = Object.keys(translations)

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t, availableLanguages }}>
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