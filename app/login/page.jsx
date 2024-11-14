'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlobeIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from 'next-themes'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme } = useTheme()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Inicio de sesión con:', { email, password })
  }

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es')
  }

  return (
    <div >
      <Card className="w-full max-w-md bg-card dark:bg-gray-800 shadow-lg">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">{t('login')}</CardTitle>
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
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-full bg-background dark:bg-gray-700 border-2 border-primary/20 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-full bg-background dark:bg-gray-700 border-2 border-primary/20 focus:border-primary"
              />
            </div>
            <Button type="submit" className="w-full rounded-full">{t('login')}</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {t('noAccount')}{' '}
            <Link href="/register" className="text-primary hover:underline">
              {t('register')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}