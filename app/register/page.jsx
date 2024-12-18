'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlobeIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from 'next-themes'
import { useAuth } from '../Auth/auth'
import Header from 'app/pages/components/Header'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const { register } = useAuth()
  const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert(t('invalidEmail'))
      return
    }

    if (formData.password.length < 6) {
      alert(t('passwordTooShort'))
      return
    }

    setIsSubmitting(true)

    register({
      ...formData,
      photo: 'default-avatar.png'
    })
    router.push('/home')

    setIsSubmitting(false)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es')
  }

  return (
    <div className="p-4 flex min-h-screen bg-background dark:bg-gray-900 text-foreground dark:text-gray-100 transition-colors duration-300">
      <Header />
      <div className="w-[448px] mx-auto flex justify-center bg-background dark:bg-gray-900 text-foreground dark:text-gray-100 transition-colors duration-300 ">
        <Card className=" w-full max-w-md bg-card/50 backdrop-blur-sm border-primary/10 shadow-lg">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">{t('register')}</CardTitle>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full">
                {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                <span className="sr-only">{theme === 'dark' ? t('lightMode') : t('darkMode')}</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleLanguage} className="rounded-full">
                <GlobeIcon className="h-5 w-5" />
                <span className="sr-only">{t('changeLanguage')}</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('name')}</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder={t('name')}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="rounded-full bg-background/50 backdrop-blur-sm border-2 border-primary/20 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="rounded-full bg-background/50 backdrop-blur-sm border-2 border-primary/20 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    placeholder="password" 
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="rounded-full bg-background/50 backdrop-blur-sm border-2 border-primary/20 focus:border-primary pr-20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-0 top-0 h-full px-3 rounded-r-full"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? t('hide') : t('show')}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
                {isSubmitting ? t('loading') : t('register')}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              {t('haveAccount')}{' '}
            </p>
            <p className="flex text-sm mx-2">
              <Link href="/login" className="hover:underline">
                {t('login')}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}