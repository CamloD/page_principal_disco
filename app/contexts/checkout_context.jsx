'use client'

import { createContext, useContext, useState } from 'react'

const CheckoutContext = createContext()

export function useCheckout() {
  return useContext(CheckoutContext)
}

export function CheckoutProvider({ children }) {
  const [isCheckoutActive, setIsCheckoutActive] = useState(false)

  const startCheckout = () => setIsCheckoutActive(true) // Activa el flujo de checkout
  const cancelCheckout = () => setIsCheckoutActive(false) // Cancela el flujo de checkout

  return (
    <CheckoutContext.Provider value={{ isCheckoutActive, startCheckout, cancelCheckout }}>
      {children}
    </CheckoutContext.Provider>
  )
}
