'use client'

import { useState } from 'react'
import { useCart } from 'app/contexts/cart_context'
import { useLanguage } from 'app/contexts/LanguageContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function CartPage() {
  const { cart, removeFromCart } = useCart()
  const { t } = useLanguage()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{t('shoppingCart')}</h1>
      {cart.length === 0 ? (
        <p>{t('cartEmpty')}</p>
      ) : (
        <>
          {cart.map((item) => (
            <Card key={item.id} className="mb-4">
              <CardContent className="flex items-center p-4">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={100}
                  height={100}
                  className="object-cover rounded-lg mr-4"
                />
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <p className="text-lg font-bold mt-2">${item.price}</p>
                </div>
                <Button variant="destructive" onClick={() => removeFromCart(item.id)}>
                  {t('remove')}
                </Button>
              </CardContent>
            </Card>
          ))}
          <div className="mt-4 text-xl font-bold">
            {t('total')}: ${total.toFixed(2)}
          </div>
          <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4">{t('proceedToCheckout')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('checkout')}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <p>{t('checkoutInstructions')}</p>
                {/* Add your checkout form or process here */}
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
      <Link href="/">
        <Button variant="outline" className="mt-4">{t('continueShopping')}</Button>
      </Link>
    </div>
  )
}