'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from '../contexts/LanguageContext'
import { useCart } from '../contexts/cart_context'
import { useAuth } from '../Auth/auth'
import { useCheckout } from '../contexts/checkout_context'
import Header from 'app/pages/components/Header'
import { useTheme } from 'next-themes'
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ImprovedCheckoutPage() {
  const { t } = useLanguage()
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const { isCheckoutActive, cancelCheckout } = useCheckout()
  const router = useRouter()
  const { theme } = useTheme()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!user || !isCheckoutActive) {
      router.push('/')
    }
  }, [user, isCheckoutActive, router])

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  const handleChange = (e) => {
    const { id, value } = e.target
    let formattedValue = value

    if (id === 'expiryDate') {
      formattedValue = formatExpiryDate(value)
    } else if (id === 'cvv') {
      formattedValue = value.slice(0, 3)
    }

    setFormData((prevState) => ({
      ...prevState,
      [id]: formattedValue
    }))

    validateField(id, formattedValue)
  }

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{2})(\d{2})$/)
    if (match) {
      return `${match[1]}/${match[2]}`
    }
    return cleaned
  }

  const validateField = (id, value) => {
    let error = ''
    switch (id) {
      case 'name':
        if (value.trim().length < 2) error = t('nameError')
        break
      case 'email':
        if (!/\S+@\S+\.\S+/.test(value)) error = t('emailError')
        break
      case 'address':
        if (value.trim().length < 5) error = t('addressError')
        break
      case 'city':
      case 'country':
        if (value.trim().length < 2) error = t('cityCountryError')
        break
      case 'zipCode':
        if (!/^\d{5}(-\d{4})?$/.test(value)) error = t('zipCodeError')
        break
      case 'cardNumber':
        if (!/^\d{16}$/.test(value.replace(/\s/g, ''))) error = t('cardNumberError')
        break
      case 'expiryDate':
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) error = t('expiryDateError')
        break
      case 'cvv':
        if (!/^\d{3}$/.test(value)) error = t('cvvError')
        break
      default:
        break
    }
    setErrors(prev => ({ ...prev, [id]: error }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formFields = Object.keys(formData)
    let hasErrors = false

    formFields.forEach(field => {
      validateField(field, formData[field])
      if (formData[field].trim() === '') {
        setErrors(prev => ({ ...prev, [field]: t('requiredField') }))
        hasErrors = true
      }
    })

    if (hasErrors || Object.values(errors).some(error => error !== '')) {
      return
    }

    alert(t('orderPlaced'))
    clearCart()
    cancelCheckout()
    router.push('/home')
  }

  const handleCancel = () => {
    cancelCheckout()
    router.push('/cart')
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{t('checkout')}</CardTitle>
            <CardDescription>{t('completeYourOrder')}</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t('fullName')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby="name-error"
                  />
                  {errors.name && <p id="name-error" className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby="email-error"
                  />
                  {errors.email && <p id="email-error" className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="address">{t('address')}</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    aria-invalid={errors.address ? 'true' : 'false'}
                    aria-describedby="address-error"
                  />
                  {errors.address && <p id="address-error" className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">{t('city')}</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      aria-invalid={errors.city ? 'true' : 'false'}
                      aria-describedby="city-error"
                    />
                    {errors.city && <p id="city-error" className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <Label htmlFor="country">{t('country')}</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      aria-invalid={errors.country ? 'true' : 'false'}
                      aria-describedby="country-error"
                    />
                    {errors.country && <p id="country-error" className="text-red-500 text-sm mt-1">{errors.country}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="zipCode">{t('zipCode')}</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                    aria-invalid={errors.zipCode ? 'true' : 'false'}
                    aria-describedby="zipCode-error"
                  />
                  {errors.zipCode && <p id="zipCode-error" className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                </div>
                <div>
                  <Label htmlFor="cardNumber">{t('cardNumber')}</Label>
                  <Input
                    id="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    required
                    aria-invalid={errors.cardNumber ? 'true' : 'false'}
                    aria-describedby="cardNumber-error"
                  />
                  {errors.cardNumber && <p id="cardNumber-error" className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">{t('expiryDate')}</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      required
                      maxLength={5}
                      aria-invalid={errors.expiryDate ? 'true' : 'false'}
                      aria-describedby="expiryDate-error"
                    />
                    {errors.expiryDate && <p id="expiryDate-error" className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      required
                      maxLength={3}
                      aria-invalid={errors.cvv ? 'true' : 'false'}
                      aria-describedby="cvv-error"
                    />
                    {errors.cvv && <p id="cvv-error" className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                  </div>
                </div>
              </form>
              <Button variant="outline" onClick={handleCancel} className="w-full">
                {t('cancelOrder')}
              </Button>
            </div>
            <div className="space-y-6">
              <Card className="bg-primary/5">
                <CardHeader>
                  <CardTitle>{t('orderSummary')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex space-x-4">
                          <Image src={item.image} alt={item.title} width={60} height={60} className="rounded-md" />
                          <div className="flex-grow">
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                            <p className="font-bold mt-1">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>{t('total')}</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button type="submit" className="w-full mt-4" onClick={handleSubmit}>
                    {t('placeOrder')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
