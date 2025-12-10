'use client'

import {
  ChevronUp,
  ShoppingCart,
  Home,
  User,
  Search as SearchIcon,
  MapPin,
  Phone,
  Mail,

  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Send,
  CreditCard,
  Truck,
  Shield,
  RefreshCcw,
  Headphones,
  Heart,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import useCartStore from '@/hooks/use-cart-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useSettingStore from '@/hooks/use-setting-store'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select'
import { SelectValue } from '@radix-ui/react-select'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { i18n } from '@/i18n-config'
import { useState } from 'react'

export default function Footer() {
  const router = useRouter()
  const pathname = usePathname()
  const { cart } = useCartStore()
  const {
    setting: { site, availableCurrencies, currency },
    setCurrency,
  } = useSettingStore()
  const { locales } = i18n
  const locale = useLocale()
  const t = useTranslations()
  const [email, setEmail] = useState('')

  // Social Media Links
  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:bg-blue-600' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:bg-sky-500' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:bg-pink-600' },
    { name: 'Youtube', icon: Youtube, href: '#', color: 'hover:bg-red-600' },
    { name: 'Linkedin', icon: Linkedin, href: '#', color: 'hover:bg-blue-700' },
  ]

  // Features
  const features = [
    {
      icon: Truck,
      title: t('Footer.Free Shipping'),
      description: t('Footer.On orders over $35'),
    },
    {
      icon: RefreshCcw,
      title: t('Footer.Easy Returns'),
      description: t('Footer.30 days return policy'),
    },
    {
      icon: Shield,
      title: t('Footer.Secure Payment'),
      description: t('Footer.100% secure checkout'),
    },
    {
      icon: Headphones,
      title: t('Footer.24/7 Support'),
      description: t('Footer.Dedicated support'),
    },
  ]

  // Footer Links
  const footerLinks = [
    {
      title: t('Footer.Get to Know Us'),
      links: [
        { name: t('Footer.About Us'), href: '/page/about-us' },
        { name: t('Footer.Careers'), href: '/page/careers' },
        { name: t('Footer.Blog'), href: '/page/blog' },
        { name: t('Footer.Press Center'), href: '#' },
      ],
    },
    {
      title: t('Footer.Make Money with Us'),
      links: [
        { name: t('Footer.Sell on') + ' ' + site.name, href: '/page/sell' },
        { name: t('Footer.Become Affiliate'), href: '/page/become-affiliate' },
        { name: t('Footer.Advertise'), href: '/page/advertise' },
        { name: t('Footer.Partner with Us'), href: '#' },
      ],
    },
    {
      title: t('Footer.Let Us Help You'),
      links: [
        { name: t('Footer.Your Account'), href: '/account' },
        { name: t('Footer.Your Orders'), href: '/account/orders' },
        { name: t('Footer.Shipping'), href: '/page/shipping' },
        { name: t('Footer.Returns Policy'), href: '/page/returns-policy' },
        { name: t('Footer.Help'), href: '/page/help' },
      ],
    },
  ]

  // Payment Methods
  const paymentMethods = [
    { name: 'Visa', src: '/icons/payment/Visa_Logo.png' },
    { name: 'MasterCard', src: '/icons/payment/Mastercard-logo.png' },
    { name: 'Mada', src: '/icons/payment/new-mada-footer.png' },
    { name: 'STC Pay', src: '/icons/payment/stc.png' },
    { name: 'Apple Pay', src: '/icons/payment/apple-pay.png' },
    { name: 'PayPal', src: '/icons/payment/PayPal.png' },
  ]

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email)
    setEmail('')
  }

  return (
    <footer className="bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* ═══════════════════ Back to Top Button ═══════════════════ */}
      <Button
        variant="ghost"
        className="
          w-full h-12 rounded-none
          bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800
          hover:from-gray-700 hover:via-gray-600 hover:to-gray-700
          text-gray-300 hover:text-white
          transition-all duration-300
          group
        "
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ChevronUp className="h-5 w-5 mr-2 group-hover:-translate-y-1 transition-transform duration-300" />
        {t('Footer.Back to top')}
      </Button>

      {/* ═══════════════════ Features Section ═══════════════════ */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="
                  flex flex-col items-center text-center p-4
                  rounded-xl bg-gradient-to-b from-gray-800/50 to-transparent
                  hover:from-gray-800 hover:to-gray-800/50
                  border border-transparent hover:border-gray-700
                  transition-all duration-300 group
                "
              >
                <div
                  className="
                    w-14 h-14 rounded-full mb-3
                    bg-gradient-to-r from-primary/20 to-amber-500/20
                    flex items-center justify-center
                    group-hover:scale-110 group-hover:from-primary/30 group-hover:to-amber-500/30
                    transition-all duration-300
                  "
                >
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                <p className="text-xs text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════ Newsletter Section ═══════════════════ */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-10">
          <div
            className="
              relative overflow-hidden rounded-2xl
              bg-gradient-to-r from-primary/10 via-amber-500/10 to-primary/10
              border border-primary/20
              p-8 md:p-12
            "
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-right">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="text-xl md:text-2xl font-bold text-white">
                    {t('Footer.Subscribe to Newsletter')}
                  </h3>
                </div>
                <p className="text-gray-400 text-sm md:text-base">
                  {t('Footer.Get exclusive offers and updates')}
                </p>
              </div>

              <form
                onSubmit={handleNewsletterSubmit}
                className="flex w-full md:w-auto gap-2"
              >
                <div className="relative flex-1 md:w-80">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder={t('Footer.Enter your email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="
                      h-12 pr-10 pl-4
                      bg-gray-800/50 border-gray-700
                      text-white placeholder:text-gray-500
                      focus:border-primary focus:ring-primary
                      rounded-lg
                    "
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="
                    h-12 px-6
                    bg-gradient-to-r from-primary to-amber-500
                    hover:from-primary/90 hover:to-amber-500/90
                    text-primary-foreground font-semibold
                    rounded-lg
                    shadow-lg shadow-primary/30
                    transition-all duration-300
                    group
                  "
                >
                  <Send className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  {t('Footer.Subscribe')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ Main Footer Content ═══════════════════ */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src={site.logo || '/icons/logo.svg'}
                  fill
                  alt={`${site.name} logo`}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent">
                  {site.name}
                </span>
                <p className="text-xs text-gray-400">{site.slogan}</p>
              </div>
            </Link>

            <p className="text-gray-400 text-sm mb-6 max-w-md">
              {site.description ||
                t('Footer.Your trusted destination for quality products')}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-sm">{site.email}</span>
              </a>

              <a
                href={`tel:${site.phone}`}
                className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-sm">{site.phone}</span>
              </a>

              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm">{site.address}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-white mb-3">
                {t('Footer.Follow Us')}
              </p>
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`
                      w-10 h-10 rounded-lg
                      bg-gray-800 ${social.color}
                      flex items-center justify-center
                      text-gray-400 hover:text-white
                      transition-all duration-300
                      hover:scale-110
                    `}
                    title={social.name}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-gradient-to-b from-primary to-amber-500 rounded-full" />
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="
                        text-gray-400 text-sm
                        hover:text-primary hover:pr-2
                        transition-all duration-200
                        inline-block
                      "
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════ Payment Methods ═══════════════════ */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-white">
                {t('Footer.Payment Methods')}
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.name}
                  className="
                    bg-white rounded-lg p-2 h-10
                    flex items-center justify-center
                    hover:scale-110 transition-transform duration-200
                    shadow-lg
                  "
                >
                  <Image
                    src={method.src}
                    alt={method.name}
                    width={50}
                    height={30}
                    className="object-contain h-6 w-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ Download App Section ═══════════════════ */}
      <div className="border-t border-gray-800 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-right">
              <h4 className="text-lg font-semibold text-white mb-1">
                {t('Footer.Download our app')}
              </h4>
              <p className="text-sm text-gray-400">
                {t('Footer.Shop anytime anywhere')}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#"
                className="
                  bg-black rounded-xl p-0.5
                  hover:scale-105 transition-transform duration-200
                  border border-gray-700 hover:border-gray-600
                "
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  width={140}
                  height={42}
                  className="object-contain"
                />
              </a>
              <a
                href="#"
                className="
                  bg-black rounded-xl p-0.5
                  hover:scale-105 transition-transform duration-200
                  border border-gray-700 hover:border-gray-600
                "
              >
                <Image
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="App Store"
                  width={140}
                  height={42}
                  className="object-contain"
                />
              </a>
              <a
                href="/apk/app-release.apk"
                download
                className="
                  bg-gradient-to-r from-gray-800 to-gray-700
                  rounded-xl px-4 py-2
                  hover:scale-105 transition-transform duration-200
                  border border-gray-600
                  flex items-center gap-2
                "
              >
                <Image
                  src="/icons/macosdownload.png"
                  alt="Download APK"
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <div className="text-right">
                  <p className="text-[10px] text-gray-400">تحميل مباشر</p>
                  <p className="text-sm font-semibold text-white">APK</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ Settings Bar ═══════════════════ */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image
                src={site.logo || '/icons/logo.svg'}
                alt={`${site.name} logo`}
                width={40}
                height={40}
                className="w-10"
              />
              <span className="text-lg font-bold text-white">{site.name}</span>
            </div>

            {/* Language & Currency Selectors */}
            <div className="flex items-center gap-3">
              <Select
                value={locale}
                onValueChange={(value) => {
                  router.push(pathname, { locale: value })
                }}
              >
                <SelectTrigger
                  className="
                    w-[150px] h-10
                    bg-gray-800 border-gray-700
                    text-white
                    hover:bg-gray-700 hover:border-gray-600
                    transition-colors
                  "
                >
                  <SelectValue placeholder={t('Footer.Select a language')} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {locales.map((lang, index) => (
                    <SelectItem
                      key={index}
                      value={lang.code}
                      className="text-white hover:bg-gray-700 focus:bg-gray-700"
                    >
                      <Link
                        className="w-full flex items-center gap-2"
                        href={pathname}
                        locale={lang.code}
                      >
                        <span className="text-lg">{lang.icon}</span>
                        <span>{lang.name}</span>
                      </Link>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={currency}
                onValueChange={(value) => {
                  setCurrency(value)
                  window.scrollTo(0, 0)
                }}
              >
                <SelectTrigger
                  className="
                    w-[140px] h-10
                    bg-gray-800 border-gray-700
                    text-white
                    hover:bg-gray-700 hover:border-gray-600
                    transition-colors
                  "
                >
                  <SelectValue placeholder={t('Footer.Select a currency')} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {availableCurrencies
                    .filter((x) => x.code)
                    .map((curr, index) => (
                      <SelectItem
                        key={index}
                        value={curr.code}
                        className="text-white hover:bg-gray-700 focus:bg-gray-700"
                      >
                        {curr.symbol} {curr.code}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ Copyright ═══════════════════ */}
      <div className="border-t border-gray-800 bg-black/50 pb-24 md:pb-0">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
            {/* Links */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href="/page/conditions-of-use"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                {t('Footer.Conditions of Use')}
              </Link>
              <span className="text-gray-700">|</span>
              <Link
                href="/page/privacy-policy"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                {t('Footer.Privacy Notice')}
              </Link>
              <span className="text-gray-700">|</span>
              <Link
                href="/page/help"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                {t('Footer.Help')}
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-500">
              <p>© {site.copyright}</p>
            </div>
          </div>

          {/* Developer Credit */}
          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <Link
              href="https://mohammed-almalgami.com/"
              className="
                inline-flex items-center gap-2
                text-sm text-gray-500
                hover:text-primary transition-colors
                group
              "
            >
              <span>{t('Footer.Designed and developed by')}</span>
              <span className="text-gray-400 group-hover:text-primary font-medium">
                {t('Footer.Mohammed Almalgami')}
              </span>
              <Heart className="h-3 w-3 text-red-500 group-hover:scale-125 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════════════ Mobile Bottom Navigation ═══════════════════ */}
      <nav
        className="
          md:hidden fixed bottom-0 left-0 right-0 z-50
          bg-gradient-to-t from-gray-900 via-gray-900 to-gray-900/95
          backdrop-blur-lg
          border-t border-gray-800
          shadow-2xl shadow-black/50
        "
      >
        <div className="flex justify-around items-center h-16 px-2">
          {/* Home */}
          <Link
            href="/"
            className="mobile-nav-item group"
          >
            <div className="mobile-nav-icon group-hover:bg-primary/20">
              <Home className="h-5 w-5 text-primary" />
            </div>
            <span className="mobile-nav-label">{t('Footer.Home')}</span>
          </Link>

          {/* Search */}
          <Link
            href="/search"
            className="mobile-nav-item group"
          >
            <div className="mobile-nav-icon group-hover:bg-blue-500/20">
              <SearchIcon className="h-5 w-5 text-blue-400" />
            </div>
            <span className="mobile-nav-label">{t('Footer.Search')}</span>
          </Link>

          {/* Cart - Center & Larger */}
          <Link
            href="/cart"
            className="mobile-nav-item group -mt-6"
          >
            <div
              className="
                relative w-14 h-14 rounded-full
                bg-gradient-to-r from-primary to-amber-500
                flex items-center justify-center
                shadow-lg shadow-primary/40
                group-hover:scale-110 group-hover:shadow-primary/60
                transition-all duration-300
              "
            >
              <ShoppingCart className="h-6 w-6 text-primary-foreground" />
              {cart.items.length > 0 && (
                <span
                  className="
                    absolute -top-1 -right-1
                    w-5 h-5 rounded-full
                    bg-red-500 text-white
                    text-[10px] font-bold
                    flex items-center justify-center
                    animate-pulse
                  "
                >
                  {cart.items.length}
                </span>
              )}
            </div>
            <span className="mobile-nav-label mt-1">{t('Footer.Cart')}</span>
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="mobile-nav-item group"
          >
            <div className="mobile-nav-icon group-hover:bg-red-500/20">
              <Heart className="h-5 w-5 text-red-400" />
            </div>
            <span className="mobile-nav-label">{t('Footer.Wishlist')}</span>
          </Link>

          {/* Account */}
          <Link
            href="/account"
            className="mobile-nav-item group"
          >
            <div className="mobile-nav-icon group-hover:bg-purple-500/20">
              <User className="h-5 w-5 text-purple-400" />
            </div>
            <span className="mobile-nav-label">{t('Footer.Account')}</span>
          </Link>
        </div>
      </nav>
    </footer>
  )
}