/**
 * Validates email address format
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  return emailRegex.test(email.trim())
}

/**
 * Validates phone number (standard 10-digit mobile number)
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  if (!phone) return true // optional
  const cleaned = String(phone).replace(/\D/g, '')
  return cleaned.length === 10
}

/**
 * Evaluates password strength and returns score, criteria status, and human-readable feedback
 * @param {string} password
 * @returns {object}
 */
export const checkPasswordStrength = (password) => {
  const pwd = password || ''
  const criteria = {
    minLength: pwd.length >= 8,
    hasUppercase: /[A-Z]/.test(pwd),
    hasLowercase: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSpecial: /[^A-Za-z0-9]/.test(pwd)
  }

  let score = 0
  if (criteria.minLength) score += 1
  if (criteria.hasUppercase && criteria.hasLowercase) score += 1
  if (criteria.hasNumber) score += 1
  if (criteria.hasSpecial) score += 1

  const feedback = []
  if (!criteria.minLength) feedback.push('At least 8 characters')
  if (!criteria.hasUppercase) feedback.push('An uppercase letter (A-Z)')
  if (!criteria.hasLowercase) feedback.push('A lowercase letter (a-z)')
  if (!criteria.hasNumber) feedback.push('A number (0-9)')
  if (!criteria.hasSpecial) feedback.push('A special symbol (!@#$%^&*)')

  let label = 'Too Weak'
  let color = 'bg-gray-200'

  if (pwd.length === 0) {
    score = 0
    label = 'Too Weak'
    color = 'bg-gray-200'
  } else if (score === 1) {
    label = 'Weak'
    color = 'bg-red-500'
  } else if (score === 2) {
    label = 'Fair'
    color = 'bg-amber-500'
  } else if (score === 3) {
    label = 'Good'
    color = 'bg-blue-500'
  } else if (score >= 4) {
    label = 'Strong'
    color = 'bg-emerald-500'
  }

  return {
    score,
    label,
    color,
    feedback,
    criteria
  }
}

/**
 * Validates the entire sign up form
 * @param {object} form
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export const validateSignUpForm = (form) => {
  const errors = {}

  if (!form.name || !form.name.trim()) {
    errors.name = 'Full name is required'
  } else if (form.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long'
  }

  if (!form.email || !form.email.trim()) {
    errors.email = 'Email address is required'
  } else if (!isValidEmail(form.email)) {
    errors.email = 'Please enter a valid email address'
  }

  if (form.phone && !isValidPhone(form.phone)) {
    errors.phone = 'Please enter a valid 10-digit phone number'
  }

  if (!form.password) {
    errors.password = 'Password is required'
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  }

  if (form.confirmPassword !== undefined) {
    if (!form.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
  }

  if (form.agreeTerms !== undefined && !form.agreeTerms) {
    errors.agreeTerms = 'You must agree to the Terms and Privacy Policy'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
