"use client"

import { useState, useEffect } from "react"
import { Outlet, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import Logo from "../components/Logo"

const MainLayout = () => {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLanguageOptions, setShowLanguageOptions] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("English")
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी" },
    { code: "ta", name: "தமிழ்" },
    { code: "te", name: "తెలుగు" },
    { code: "bn", name: "বাংলা" },
  ]

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language)
    setShowLanguageOptions(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/90 dark:bg-dark-800/90 backdrop-blur-md shadow-md" : "bg-white dark:bg-dark-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center">
                  <Logo />
                </Link>
              </div>
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className="border-transparent text-gray-500 dark:text-gray-300 hover:border-indian-saffron hover:text-indian-saffron dark:hover:text-indian-saffron inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="border-transparent text-gray-500 dark:text-gray-300 hover:border-indian-saffron hover:text-indian-saffron dark:hover:text-indian-saffron inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                >
                  About
                </Link>
                <Link
                  to="/services"
                  className="border-transparent text-gray-500 dark:text-gray-300 hover:border-indian-saffron hover:text-indian-saffron dark:hover:text-indian-saffron inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                >
                  Services
                </Link>
                <Link
                  to="/contact"
                  className="border-transparent text-gray-500 dark:text-gray-300 hover:border-indian-saffron hover:text-indian-saffron dark:hover:text-indian-saffron inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                >
                  Contact
                </Link>
              </nav>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              {/* Language Selector */}
              <div className="language-selector">
                <button
                  onClick={() => setShowLanguageOptions(!showLanguageOptions)}
                  className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-indian-saffron dark:hover:text-indian-saffron"
                >
                  <span>{currentLanguage}</span>
                  <svg
                    className={`ml-1 h-4 w-4 transition-transform ${showLanguageOptions ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {showLanguageOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="language-options bg-white dark:bg-dark-700 shadow-lg rounded-md py-1 mt-1"
                    >
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          onClick={() => handleLanguageChange(language.name)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600"
                        >
                          {language.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to={`/${user.role}/dashboard`} className="btn-indian-primary">
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="btn-outline border-indian-saffron text-indian-saffron hover:bg-indian-saffron/10"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="btn-indian-primary">
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-outline border-indian-saffron text-indian-saffron hover:bg-indian-saffron/10"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indian-saffron"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden"
            >
              <div className="pt-2 pb-3 space-y-1">
                <Link
                  to="/"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-indian-saffron hover:text-indian-saffron"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-indian-saffron hover:text-indian-saffron"
                >
                  About
                </Link>
                <Link
                  to="/services"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-indian-saffron hover:text-indian-saffron"
                >
                  Services
                </Link>
                <Link
                  to="/contact"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-indian-saffron hover:text-indian-saffron"
                >
                  Contact
                </Link>
              </div>
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-dark-600">
                {user ? (
                  <div className="space-y-1">
                    <Link
                      to={`/${user.role}/dashboard`}
                      className="block pl-3 pr-4 py-2 border-l-4 border-indian-saffron text-base font-medium text-indian-saffron bg-indian-saffron/10"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-indian-saffron hover:text-indian-saffron"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link
                      to="/login"
                      className="block pl-3 pr-4 py-2 border-l-4 border-indian-saffron text-base font-medium text-indian-saffron bg-indian-saffron/10"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-indian-saffron hover:text-indian-saffron"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}

                {/* Mobile Language Selector */}
                <div className="mt-3 px-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Language</span>
                    <select
                      value={currentLanguage}
                      onChange={(e) => setCurrentLanguage(e.target.value)}
                      className="block w-24 py-1 px-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-indian-saffron focus:border-indian-saffron"
                    >
                      {languages.map((language) => (
                        <option key={language.code} value={language.name}>
                          {language.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-dark-700 shadow-inner">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Logo size="lg" />
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Bharat Bank - Serving the nation since 1947. Your trusted partner for all banking needs.
              </p>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-indian-saffron">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-indian-saffron">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-indian-saffron">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-indian-saffron">
                  <span className="sr-only">YouTube</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Products
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-indian-saffron">
                    Savings Account
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-indian-saffron">
                    Current Account
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-indian-saffron">
                    Fixed Deposits
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-indian-saffron">
                    Recurring Deposits
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-indian-saffron">
                    Personal Loans
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-indian-saffron">
                    Home Loans
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Support
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-indian-saffron">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-indian-saffron">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-indian-saffron">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-indian-saffron">
                    ATM Locator
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-indian-saffron">
                    Branch Locator
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-indian-saffron">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-indian-saffron">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-indian-saffron">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-indian-saffron">
                    GDPR Compliance
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-indian-saffron">
                    RBI Guidelines
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-dark-600">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Bharat Bank. All rights reserved.
              </p>
              <p className="mt-2 md:mt-0 text-sm text-gray-500 dark:text-gray-400">
                RBI Authorized • DICGC Insured • ISO 27001 Certified
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout

