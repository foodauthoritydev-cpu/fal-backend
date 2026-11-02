// Sends transactional email through the EmailJS REST API.
// Requires EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID and EMAILJS_PUBLIC_KEY in .env
// (EMAILJS_PRIVATE_KEY as well if the EmailJS account has non-browser apps disabled).

const generateVerificationCode = () => String(Math.floor(100000 + Math.random() * 900000))

const sendVerificationEmail = async ({ email, name, code }) => {
  const { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY } = process.env
  if (!email || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.warn('EmailJS is not configured — verification email not sent to', email)
    return false
  }
  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY || undefined,
        template_params: {
          to_email: email,
          to_name: name || email,
          verification_code: code,
          message: `Your Food Authority verification code is ${code}. It expires in 10 minutes.`
        }
      })
    })
    if (!res.ok) {
      console.error('EmailJS send failed:', res.status, await res.text().catch(() => ''))
      return false
    }
    return true
  } catch (error) {
    console.error('EmailJS send error:', error.message)
    return false
  }
}

const setVerificationCode = (user) => {
  const code = generateVerificationCode()
  user.verificationCode = code
  user.verificationExpires = new Date(Date.now() + 10 * 60 * 1000)
  return code
}

module.exports = { generateVerificationCode, sendVerificationEmail, setVerificationCode }
