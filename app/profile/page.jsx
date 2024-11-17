'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from 'app/Auth/auth'
import Cropper from 'react-easy-crop'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Slider } from "@/components/ui/slider"
import Header from 'app/pages/components/Header'
import { useTheme } from 'next-themes'

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new window.Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Canvas is empty')
        return
      }
      resolve(URL.createObjectURL(blob))
    }, 'image/jpeg')
  })
}

export default function UserProfile() {
  const { t } = useLanguage()
  const { user, updateUser, logout } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [photo, setPhoto] = useState('/default-avatar.png')
  const [bio, setBio] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [isCropperOpen, setIsCropperOpen] = useState(false)
  const [tempImage, setTempImage] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const checkUser = async () => {
      if (user) {
        setName(user.name || '')
        setEmail(user.email || '')
        setPhoto(user.photo || '/default-avatar.png')
        setBio(user.bio || '')
        setIsLoading(false)
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (!user) {
          router.push('/login')
        }
      }
    }

    checkUser()
  }, [user, router])

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setTempImage(reader.result)
        setIsCropperOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropSave = async () => {
    try {
      if (croppedAreaPixels) {
        const croppedImage = await getCroppedImg(tempImage, croppedAreaPixels)
        if (croppedImage) {
          setPhoto(croppedImage)
          updateUser({ ...user, photo: croppedImage })
        }
      }
      setIsCropperOpen(false)
    } catch (e) {
      console.error(e)
    }
  }

  const handleRemovePhoto = () => {
    setPhoto('/default-avatar.png')
    updateUser({ ...user, photo: '/default-avatar.png' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateUser({ ...user, name, email, photo, bio })
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmation.toLowerCase() === 'delete account') {
      // Here you would add the logic to delete the account
      logout()
      router.push('/login')
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 text-foreground dark:text-gray-100 transition-colors duration-300">
      <Header />
      <div className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto bg-card dark:bg-gray-800 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{t('userProfile')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-32 h-32">
                  <Image
                    src={photo}
                    alt="User Photo"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
                <div className="flex space-x-2">
                  <Label htmlFor="photo" className="cursor-pointer text-primary hover:underline">
                    {t('changePhoto')}
                  </Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  {photo !== '/default-avatar.png' && (
                    <Button type="button" variant="outline" onClick={handleRemovePhoto}>
                      {t('removePhoto')}
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">{t('name')}</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="bio">{t('bio')}</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="mt-1"
                    placeholder={t('tellUsAboutYourself')}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                {t('saveChanges')}
              </Button>
            </form>
            <div className="mt-6">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">{t('deleteAccount')}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('areYouSure')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      <p>{t('deleteAccountConfirmation')}</p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Input
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder={t('typeDeleteAccountToConfirm')}
                  />
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount}>{t('deleteAccount')}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isCropperOpen} onOpenChange={setIsCropperOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('cropImage')}</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[400px]">
            <Cropper
              image={tempImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="zoom">{t('zoom')}</Label>
            <Slider
              id="zoom"
              min={1}
              max={3}
              step={0.1}
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCropperOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleCropSave}>{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}