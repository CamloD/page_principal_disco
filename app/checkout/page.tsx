'use client'

import { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from '../contexts/LanguageContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface CartItem {
  price: number;
  // Add other properties of cart items if needed
}

interface CheckoutProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onCheckoutComplete?: () => void;
}

export default function Checkout({ cart, setCart, onCheckoutComplete }: CheckoutProps) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    card: '',
    expiry: '',
    cvv: ''
  })

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price, 0), [cart])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [id]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.card || !formData.expiry || !formData.cvv) {
      alert(t('completeFields'))
      return
    }

    setCart([])
    
    alert(t('orderPlaced'))
    if (onCheckoutComplete) {
      onCheckoutComplete()
    }

    setIsOpen(false)
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
            <Label>
              <span>{t('fullName')}</span>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Label>
          </div>
          <div>
            <Label>
              <span>{t('email')}</span>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Label>
          </div>
          <div>
            <Label>
              <span>{t('cardNumber')}</span>
              <Input
                id="card"
                value={formData.card}
                onChange={handleChange}
                required
              />
            </Label>
          </div>
          <div className="flex justify-between">
            <div className="w-1/2 pr-2">
              <Label>
                <span>{t('expiryDate')}</span>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={formData.expiry}
                  onChange={handleChange}
                  required
                />
              </Label>
            </div>
            <div className="w-1/2 pl-2">
              <Label>
                <span>CVV</span>
                <Input
                  id="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  required
                />
              </Label>
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