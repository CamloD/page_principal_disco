'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from 'app/contexts/LanguageContext'
import { useAuth } from 'app/Auth/auth'

export default function Checkout() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica para procesar el pago
    console.log('Procesando pago...')
    // Después de procesar el pago, redirigir a una página de confirmación
    router.push('/confirmation')
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="container mx-auto p-4 mt-20">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t('checkout')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">{t('cardNumber')}</Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="expiryDate">{t('expiryDate')}</Label>
                <Input
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                  placeholder="MM/YY"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="cvv">{t('cvv')}</Label>
                <Input
                  id="cvv"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  required
                  placeholder="123"
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              {t('payNow')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}