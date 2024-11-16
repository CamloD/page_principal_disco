'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from '../contexts/LanguageContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function Checkout({ cart, onCheckoutComplete }) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const total = cart.reduce((sum, item) => sum + item.price, 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(t('orderPlaced'))
    onCheckoutComplete()
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
            <Label htmlFor="name">{t('fullName')}</Label>
            <Input id="name" required />
          </div>
          <div>
            <Label htmlFor="email">{t('email')}</Label>
            <Input id="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="card">{t('cardNumber')}</Label>
            <Input id="card" required />
          </div>
          <div className="flex justify-between">
            <div className="w-1/2 pr-2">
              <Label htmlFor="expiry">{t('expiryDate')}</Label>
              <Input id="expiry" placeholder="MM/YY" required />
            </div>
            <div className="w-1/2 pl-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input id="cvv" required />
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
