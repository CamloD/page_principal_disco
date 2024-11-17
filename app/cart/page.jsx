'use client'

import { useState } from 'react'
import { useCart } from 'app/contexts/cart_context'
import { useLanguage } from 'app/contexts/LanguageContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'
import Link from 'next/link'
import Header from 'app/pages/components/Header'

export default function CartPage() {
  const { cart, removeFromCart } = useCart()
  const { t } = useLanguage()

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 text-foreground dark:text-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">{t('shoppingCart')}</h1>
        {cart.length === 0 ? (
          <p>{t('cartEmpty')}</p>
        ) : (
          <>
            {cart.map((item) => (
              <Card key={item.id} className="mb-4">
                <CardContent className="flex flex-col sm:flex-row items-center p-4">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={100}
                    height={100}
                    className="object-cover rounded-lg mr-4 mb-4 sm:mb-0"
                  />
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold">{item.title}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-none">{item.description}</p>
                    <p className="text-lg font-bold mt-2">${item.price}</p>
                  </div>
                  <Button variant="destructive" onClick={() => removeFromCart(item.id)} className="mt-4 sm:mt-0">
                    {t('remove')}
                  </Button>
                </CardContent>
              </Card>
            ))}
            <div className="mt-4 text-xl font-bold">
              {t('total')}: ${total.toFixed(2)}
            </div>
            <Link href="/checkout">
              <Button className="mt-4">{t('proceedToCheckout')}</Button>
            </Link>
          </>
        )}
        <Link href="/">
          <Button variant="outline" className="mt-4">{t('continueShopping')}</Button>
        </Link>
      </div>
    </div>
  )
}