"use client"
import { motion } from "framer-motion"

const Logo = ({ size = "md", showText = true, className = "" }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  }

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <motion.div
          className={`${sizeClasses[size]} bg-indian-saffron rounded-full flex items-center justify-center overflow-hidden`}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 bg-white"
            style={{ clipPath: "polygon(0 33%, 100% 33%, 100% 66%, 0 66%)" }}
          />
          <motion.div
            className="absolute inset-0 bg-indian-green"
            style={{ clipPath: "polygon(0 66%, 100% 66%, 100% 100%, 0 100%)" }}
          />
          <motion.div
            className="absolute"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <svg
              className="h-1/2 w-1/2 text-indian-blue"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="M12 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 12L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>
        </motion.div>
        <motion.div
          className="absolute -top-1 -right-1 bg-white rounded-full h-4 w-4 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <span className="text-indian-saffron font-bold text-xs">₹</span>
        </motion.div>
      </div>
      {showText && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="ml-2"
        >
          <h1 className={`font-bold ${textSizeClasses[size]} text-indian-saffron`}>
            Bharat<span className="text-indian-green">Bank</span>
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400">आपका अपना बैंक</p>
        </motion.div>
      )}
    </div>
  )
}

export default Logo

