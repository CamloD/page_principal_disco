'use client'

import { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from '../contexts/LanguageContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function Checkout({ cart, setCart, onCheckoutComplete }) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    card: '',
    expiry: '',
    cvv: ''
  })

  // Calcular el total del carrito
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price, 0), [cart])

  // Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [id]: value
    }))
  }

  // Manejo del submit del formulario
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.card || !formData.expiry || !formData.cvv) {
      alert(t('completeFields'))
      return
    }

    // Aquí se limpia el carrito
    setCart([])  // Limpiar el carrito después de completar el checkout
    
    // Llamar al callback onCheckoutComplete si se pasa
    alert(t('orderPlaced'))
    if (onCheckoutComplete) {
      onCheckoutComplete()  // Llamada al callback (si existe)
    }

    setIsOpen(false)  // Cerrar el modal de checkout
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mt-4">
          {t('checkout')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('checkout')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">{t('fullName')}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="card">{t('cardNumber')}</Label>
            <Input
              id="card"
              value={formData.card}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-between">
            <div className="w-1/2 pr-2">
              <Label htmlFor="expiry">{t('expiryDate')}</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-1/2 pl-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                value={formData.cvv}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="font-bold text-lg">
            {t('total')}: ${total.toFixed(2)}
          </div>
          <Button type="submit" className="w-full">
            {t('placeOrder')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
