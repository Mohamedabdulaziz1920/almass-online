// context/sidebar-context.tsx
'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface SidebarContextType {
  isOpen: boolean
  isMobile: boolean
  toggle: () => void
  open: () => void
  close: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // التحقق من حجم الشاشة
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      // إغلاق السايدبار عند التبديل للموبايل
      if (mobile) {
        setIsOpen(false)
      }
    }

    // التحقق عند التحميل
    checkMobile()
    
    // التحقق عند تغيير حجم النافذة
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <SidebarContext.Provider value={{ isOpen, isMobile, toggle, open, close }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}