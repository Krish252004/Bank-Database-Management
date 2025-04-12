"use client"

import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import Logo from "../components/Logo"

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const controls = useAnimation()
  const bankingIconsRef = useRef(null)
  const [currentFeature, setCurrentFeature] = useState(0)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const features = [
    {
      title: "Secure Banking",
      description: "State-of-the-art security measures to protect your financial information and transactions.",
      icon: (
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    },
    {
      title: "UPI Payments",
      description: "Make instant payments using UPI to anyone, anywhere in India with zero transaction fees.",
      icon: (
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Account Management",
      description: "Create and manage multiple accounts with ease. Track balances and transactions in real-time.",
      icon: (
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Loan Applications",
      description: "Apply for loans online and track your application status and repayment schedule.",
      icon: (
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
  ]

  const testimonials = [
    {
      name: "Rajesh Sharma",
      role: "Small Business Owner",
      image: "/placeholder.svg?height=100&width=100",
      quote:
        "Bharat Bank has transformed how I manage my business finances. Their mobile banking is intuitive and their customer service is exceptional.",
    },
    {
      name: "Priya Patel",
      role: "Software Engineer",
      image: "/placeholder.svg?height=100&width=100",
      quote:
        "I've been using Bharat Bank for 5 years now. Their UPI integration and instant transfers make my daily transactions seamless.",
    },
    {
      name: "Amit Kumar",
      role: "Doctor",
      image: "/placeholder.svg?height=100&width=100",
      quote:
        "The home loan process with Bharat Bank was surprisingly easy. Their representatives guided me through every step with patience and expertise.",
    },
  ]

  useEffect(() => {
    setIsLoaded(true)
    controls.start({ opacity: 1, y: 0 })

    // Animate banking icons
    const interval = setInterval(() => {
      if (bankingIconsRef.current) {
        const icons = bankingIconsRef.current.querySelectorAll(".banking-icon")
        icons.forEach((icon, index) => {
          setTimeout(() => {
            icon.classList.add("animate-bounce")
            setTimeout(() => {
              icon.classList.remove("animate-bounce")
            }, 1000)
          }, index * 200)
        })
      }
    }, 5000)

    // Rotate through features
    const featureInterval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 4000)

    // Rotate through testimonials
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 6000)

    return () => {
      clearInterval(interval)
      clearInterval(featureInterval)
      clearInterval(testimonialInterval)
    }
  }, [controls, features.length, testimonials.length])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.95 },
  }

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  }

  return (
    <div className="bg-white dark:bg-dark-800 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indian-saffron/10 to-indian-green/10 dark:from-dark-800 dark:to-indian-saffron/20">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <motion.main
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              variants={containerVariants}
              className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28"
            >
              <div className="sm:text-center lg:text-left">
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl"
                >
                  <span className="block xl:inline">Welcome to</span>{" "}
                  <motion.span
                    className="block text-indian-saffron dark:text-indian-saffron xl:inline"
                    animate={{
                      scale: [1, 1.05, 1],
                      color: ["#FF9933", "#FF8C00", "#FF9933"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  >
                    Bharat Bank
                  </motion.span>
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                >
                  Experience seamless banking with our state-of-the-art platform. Manage accounts, transfer funds, and
                  apply for loans all in one place. Secure, reliable, and designed for the modern Indian banking needs.
                </motion.p>
                <motion.div variants={itemVariants} className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" className="rounded-md shadow">
                    <Link
                      to="/signup"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indian-saffron hover:bg-indian-saffron/90 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started
                    </Link>
                  </motion.div>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="mt-3 sm:mt-0 sm:ml-3"
                  >
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indian-saffron bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                    >
                      Log In
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.main>
          </div>
        </div>

        {/* Banking Icons Animation */}
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center relative"
            ref={bankingIconsRef}
          >
            <div className="absolute w-full h-full">
              <motion.div
                className="banking-icon absolute top-1/4 left-1/4 bg-white dark:bg-indian-saffron/20 p-3 rounded-full shadow-lg"
                initial={{ y: 0 }}
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", repeatDelay: 2 }}
              >
                <svg className="h-8 w-8 text-indian-saffron" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path
                    fillRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>

              <motion.div
                className="banking-icon absolute top-1/3 right-1/4 bg-white dark:bg-indian-green/20 p-3 rounded-full shadow-lg"
                initial={{ y: 0 }}
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  repeatDelay: 3,
                  delay: 0.5,
                }}
              >
                <svg className="h-8 w-8 text-indian-green" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>

              <motion.div
                className="banking-icon absolute bottom-1/3 left-1/3 bg-white dark:bg-indian-saffron/20 p-3 rounded-full shadow-lg"
                initial={{ y: 0 }}
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  repeatDelay: 4,
                  delay: 1,
                }}
              >
                <svg className="h-8 w-8 text-indian-saffron" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>

              <motion.div
                className="banking-icon absolute bottom-1/4 right-1/3 bg-white dark:bg-indian-green/20 p-3 rounded-full shadow-lg"
                initial={{ y: 0 }}
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  repeatDelay: 3.5,
                  delay: 1.5,
                }}
              >
                <svg className="h-8 w-8 text-indian-green" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>

              <motion.div
                className="banking-icon absolute top-1/2 left-1/2 bg-white dark:bg-indian-blue/20 p-3 rounded-full shadow-lg"
                initial={{ y: 0 }}
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  repeatDelay: 5,
                  delay: 2,
                }}
              >
                <svg className="h-8 w-8 text-indian-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>
            </div>

            {/* Central Bank Logo */}
            <motion.div
              className="relative z-10 bg-white dark:bg-dark-800 p-6 rounded-full shadow-xl"
              animate={{
                rotate: 360,
                boxShadow: [
                  "0px 0px 10px rgba(0,0,0,0.1)",
                  "0px 0px 20px rgba(0,0,0,0.2)",
                  "0px 0px 10px rgba(0,0,0,0.1)",
                ],
              }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Logo size="xl" showText={false} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Animated Feature Highlight */}
      <div className="py-12 bg-white dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base text-indian-saffron dark:text-indian-saffron font-semibold tracking-wide uppercase"
            >
              Key Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
            >
              Everything you need for modern banking
            </motion.p>
          </div>

          <div className="mt-10 flex flex-col items-center">
            <div className="relative h-64 w-full max-w-3xl mx-auto overflow-hidden rounded-xl shadow-lg bg-gradient-to-r from-indian-saffron/10 to-indian-green/10 dark:from-indian-saffron/20 dark:to-indian-green/20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeature}
                  variants={featureVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute inset-0 flex items-center justify-center p-8"
                >
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <div className="bg-white dark:bg-indian-saffron/20 p-4 rounded-full shadow-lg">
                      {features[currentFeature].icon}
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {features[currentFeature].title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">{features[currentFeature].description}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Feature Indicators */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeature(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentFeature === index ? "w-8 bg-indian-saffron" : "w-2 bg-indian-saffron/30"
                    }`}
                    aria-label={`View feature ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="py-12 bg-gray-50 dark:bg-dark-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indian-saffron dark:text-indian-saffron font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              A better way to bank
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
              Our bank management system provides everything you need to manage your finances efficiently.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="flex"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indian-saffron text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="mt-2 text-base text-gray-500 dark:text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="py-12 bg-white dark:bg-dark-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-indian-saffron dark:text-indian-saffron font-semibold tracking-wide uppercase">
              Testimonials
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              What our customers say
            </p>
          </div>

          <div className="mt-10">
            <div className="relative h-64 max-w-3xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <div className="bg-gray-50 dark:bg-dark-700 p-8 rounded-lg shadow-lg h-full flex flex-col justify-center">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-indian-saffron/20 flex items-center justify-center">
                        <span className="text-indian-saffron text-lg font-bold">
                          {testimonials[currentTestimonial].name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {testimonials[currentTestimonial].name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonials[currentTestimonial].role}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 italic">
                      "{testimonials[currentTestimonial].quote}"
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Testimonial Navigation */}
              <div className="absolute -bottom-10 left-0 right-0 flex justify-center space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentTestimonial === index ? "w-8 bg-indian-saffron" : "w-2 bg-indian-saffron/30"
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Banking Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="py-12 bg-gray-50 dark:bg-dark-700 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h2 className="text-base text-indian-saffron dark:text-indian-saffron font-semibold tracking-wide uppercase">
                Mobile Banking
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Banking at your fingertips
              </p>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                Access your accounts, make transactions, and manage your finances anytime, anywhere with our secure
                mobile banking app.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indian-saffron text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Secure Authentication</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Multi-factor authentication and biometric login options to keep your account secure.
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indian-green text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Instant Transfers</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Send money instantly to anyone, anywhere using UPI, IMPS, or NEFT.
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indian-blue text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Bill Payments</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Pay utility bills, recharge mobile, and make other payments directly from the app.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indian-saffron hover:bg-indian-saffron/90"
                >
                  Download App
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2 h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.a>
              </div>
            </div>

            <div className="mt-10 lg:mt-0 flex justify-center">
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="relative"
              >
                <div className="relative h-[600px] w-[300px] rounded-[40px] border-8 border-gray-800 bg-gray-800 shadow-xl overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 z-10"></div>
                  <div className="absolute bottom-0 inset-x-0 h-6 bg-gray-800 z-10"></div>
                  <div className="h-full w-full bg-white overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-b from-indian-saffron/10 to-indian-green/10 p-4">
                      <div className="flex justify-between items-center mb-6">
                        <Logo size="sm" />
                        <div className="h-8 w-8 rounded-full bg-indian-saffron/20 flex items-center justify-center">
                          <span className="text-indian-saffron text-sm font-bold">A</span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <p className="text-xs text-gray-500">Welcome back,</p>
                        <h3 className="text-lg font-bold text-gray-900">Amit Kumar</h3>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs text-gray-500">Total Balance</p>
                          <div className="flex items-center">
                            <span className="text-xs font-medium text-indian-saffron">View All</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 ml-1 text-indian-saffron"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">₹1,24,500.00</h2>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-sm font-medium text-gray-900">Quick Actions</p>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="flex flex-col items-center">
                            <div className="h-10 w-10 rounded-full bg-indian-saffron/10 flex items-center justify-center mb-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-indian-saffron"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                              </svg>
                            </div>
                            <p className="text-xs text-gray-600">Transfer</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-10 w-10 rounded-full bg-indian-green/10 flex items-center justify-center mb-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-indian-green"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <p className="text-xs text-gray-600">Pay Bills</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-blue-600"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                              </svg>
                            </div>
                            <p className="text-xs text-gray-600">Invest</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mb-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-purple-600"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <p className="text-xs text-gray-600">More</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-4">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-sm font-medium text-gray-900">Recent Transactions</p>
                          <div className="flex items-center">
                            <span className="text-xs font-medium text-indian-saffron">View All</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 ml-1 text-indian-saffron"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-red-600"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">Amazon</p>
                              <p className="text-xs text-gray-500">Today, 2:34 PM</p>
                            </div>
                            <div className="ml-auto">
                              <p className="text-sm font-medium text-red-600">-₹2,500</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-green-600"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">Salary</p>
                              <p className="text-xs text-gray-500">Yesterday</p>
                            </div>
                            <div className="ml-auto">
                              <p className="text-sm font-medium text-green-600">+₹45,000</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-gray-800 rounded-b-lg"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="bg-indian-saffron"
      >
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Create an account today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indian-saffron-100 text-opacity-90">
            Join thousands of satisfied customers who trust Bharat Bank for their financial needs.
          </p>
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Link
              to="/signup"
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indian-saffron bg-white hover:bg-gray-50 sm:w-auto"
            >
              Sign up for free
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Home

