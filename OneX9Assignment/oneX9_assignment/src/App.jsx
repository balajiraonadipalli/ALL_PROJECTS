import { useState } from 'react'

function App() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Show/hide visibility states
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Form submission and loading states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [errorCurrent, setErrorCurrent] = useState('')
  const [errorNew, setErrorNew] = useState('')
  const [errorConfirm, setErrorConfirm] = useState('')

  // Validation criteria checks
  const hasMinLength = newPassword.length >= 8
  const hasUppercase = /[A-Z]/.test(newPassword)
  const hasLowercase = /[a-z]/.test(newPassword)
  const hasNumber = /[0-9]/.test(newPassword)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(newPassword)
  const isAllCriteriaMet = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Reset errors
    setErrorCurrent('')
    setErrorNew('')
    setErrorConfirm('')

    let hasErrors = false

    if (!currentPassword) {
      setErrorCurrent('Current password is required')
      hasErrors = true
    }

    if (!newPassword) {
      setErrorNew('New password is required')
      hasErrors = true
    } else if (!isAllCriteriaMet) {
      setErrorNew('Password must meet all complexity requirements')
      hasErrors = true
    }

    if (!confirmPassword) {
      setErrorConfirm('Please confirm your new password')
      hasErrors = true
    } else if (confirmPassword !== newPassword) {
      setErrorConfirm('Passwords do not match')
      hasErrors = true
    }

    if (hasErrors) return

    // Trigger loading spinner
    setIsSubmitting(true)

    // Mock API response after delay
    setTimeout(() => {
      setIsSubmitting(false)
      setShowToast(true)
      
      // Reset form fields
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      // Hide toast after 4 seconds
      setTimeout(() => {
        setShowToast(false)
      }, 4000)
    }, 1500)
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl animate-bounce md:animate-none md:transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          <div>
            <p className="font-semibold text-sm">Success</p>
            <p className="text-xs opacity-90">Password updated successfully!</p>
          </div>
        </div>
      )}

      {/* Main card */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 md:p-10 transition-all duration-300">
        
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Change Password</h1>
          <p className="text-slate-500 text-sm mt-1.5">Update your password to keep your account secure.</p>
        </div>

        {/* Content Layout */}
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8 md:gap-12">
          
          {/* Inputs Section (Left Side) */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Current Password Field */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 text-sm font-semibold flex items-center">
                Current Password <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  disabled={isSubmitting}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value)
                    if (e.target.value) setErrorCurrent('')
                  }}
                  className={`w-full pr-12 pl-4 py-3 bg-slate-50/50 border ${
                    errorCurrent ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100'
                  } rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all disabled:opacity-50`}
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  tabIndex="-1"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-slate-600"
                >
                  {showCurrent ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
              {errorCurrent && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                  {errorCurrent}
                </p>
              )}
            </div>

            {/* New Password Field */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 text-sm font-semibold flex items-center">
                New Password <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  disabled={isSubmitting}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                    if (e.target.value) setErrorNew('')
                  }}
                  className={`w-full pr-12 pl-4 py-3 bg-slate-50/50 border ${
                    errorNew ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100'
                  } rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all disabled:opacity-50`}
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  tabIndex="-1"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-slate-600"
                >
                  {showNew ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
              {errorNew && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                  {errorNew}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 text-sm font-semibold flex items-center">
                Confirm New Password <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  disabled={isSubmitting}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (e.target.value) setErrorConfirm('')
                  }}
                  className={`w-full pr-12 pl-4 py-3 bg-slate-50/50 border ${
                    errorConfirm ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100'
                  } rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all disabled:opacity-50`}
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  tabIndex="-1"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-slate-600"
                >
                  {showConfirm ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
              {errorConfirm && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                  {errorConfirm}
                </p>
              )}
            </div>

            {/* Submit Button (Aligns under inputs) */}
            <div className="mt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-8 py-3 bg-[#0d4cf9] hover:bg-[#0835cc] text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </div>

          </div>

          {/* Checklist Card Section (Right Side) */}
          <div className="w-full md:w-80 p-6 bg-slate-50/50 border border-slate-100 rounded-xl self-start">
            <h3 className="text-slate-800 text-sm font-bold mb-4">Password must contain:</h3>
            
            <ul className="flex flex-col gap-3.5">
              {/* Rule 1: Min 8 Chars */}
              <li className={`flex items-start gap-2.5 text-sm transition-colors duration-200 ${hasMinLength ? 'text-emerald-700' : 'text-slate-500'}`}>
                <span className={`flex-shrink-0 mt-0.5 p-0.5 rounded-full transition-all duration-300 ${
                  hasMinLength ? 'text-emerald-600 bg-emerald-50 scale-110' : 'text-slate-300'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={hasMinLength ? 3 : 2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span>At least 8 characters</span>
              </li>

              {/* Rule 2: Upper Case */}
              <li className={`flex items-start gap-2.5 text-sm transition-colors duration-200 ${hasUppercase ? 'text-emerald-700' : 'text-slate-500'}`}>
                <span className={`flex-shrink-0 mt-0.5 p-0.5 rounded-full transition-all duration-300 ${
                  hasUppercase ? 'text-emerald-600 bg-emerald-50 scale-110' : 'text-slate-300'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={hasUppercase ? 3 : 2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span>One uppercase letter</span>
              </li>

              {/* Rule 3: Lower Case */}
              <li className={`flex items-start gap-2.5 text-sm transition-colors duration-200 ${hasLowercase ? 'text-emerald-700' : 'text-slate-500'}`}>
                <span className={`flex-shrink-0 mt-0.5 p-0.5 rounded-full transition-all duration-300 ${
                  hasLowercase ? 'text-emerald-600 bg-emerald-50 scale-110' : 'text-slate-300'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={hasLowercase ? 3 : 2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span>One lowercase letter</span>
              </li>

              {/* Rule 4: Number */}
              <li className={`flex items-start gap-2.5 text-sm transition-colors duration-200 ${hasNumber ? 'text-emerald-700' : 'text-slate-500'}`}>
                <span className={`flex-shrink-0 mt-0.5 p-0.5 rounded-full transition-all duration-300 ${
                  hasNumber ? 'text-emerald-600 bg-emerald-50 scale-110' : 'text-slate-300'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={hasNumber ? 3 : 2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span>One number</span>
              </li>

              {/* Rule 5: Special Char */}
              <li className={`flex items-start gap-2.5 text-sm transition-colors duration-200 ${hasSpecialChar ? 'text-emerald-700' : 'text-slate-500'}`}>
                <span className={`flex-shrink-0 mt-0.5 p-0.5 rounded-full transition-all duration-300 ${
                  hasSpecialChar ? 'text-emerald-600 bg-emerald-50 scale-110' : 'text-slate-300'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={hasSpecialChar ? 3 : 2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span>One special character</span>
              </li>
            </ul>
          </div>

        </form>

      </div>
    </div>
  )
}

export default App
