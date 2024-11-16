'use client'

import { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from '../contexts/LanguageContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function Checkout({ cart, onCheckoutComplete }) {
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

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [id]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.card || !formData.expiry || !formData.cvv) {
      alert(t('completeFields'))
      return
    }

    alert(t('orderPlaced'))
    onCheckoutComplete()
    setIsOpen(false)
  }

  return (
   <></>
  )
}
