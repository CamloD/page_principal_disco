/* eslint-disable react/no-unescaped-entities */
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
import { useAuth } from '../Auth/auth'
import Cropper from 'react-easy-crop'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Slider } from "@/components/ui/slider"

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

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
      const croppedImage = await getCroppedImg(tempImage, croppedAreaPixels)
      setPhoto(croppedImage)
      updateUser({ ...user, photo: croppedImage })
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
    <div className="container mx-auto p-4 mt-20">
      <Card className="max-w-2xl mx-auto bg-background dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Image
                src={photo}
                alt="User Photo"
                width={120}
                height={120}
                className="rounded-full object-cover"
              />
              <div className="flex space-x-2">
                <Label htmlFor="photo" className="cursor-pointer text-primary hover:underline">
                  Change Photo
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
                    Remove Photo
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
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
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="mt-1"
                  placeholder="Tell us about yourself"
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
          <div className="mt-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    <p>This action cannot be undone. Please type 'delete account' to confirm.</p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Input
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Type 'delete account' to confirm"
                />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount}>Delete Account</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCropperOpen} onOpenChange={setIsCropperOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
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
            <Label htmlFor="zoom">Zoom</Label>
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
              Cancel
            </Button>
            <Button onClick={handleCropSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}