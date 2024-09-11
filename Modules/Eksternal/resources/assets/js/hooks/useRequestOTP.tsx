import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { getErrorMessage } from "../utils/error"
import { requestWhatsappOTP } from "../services/profile"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"

export default () => {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [requesting, setRequesting] = useState<boolean>(false)
  const [isRequested, setIsRequested] = useState<boolean>(false)

  const getWhatsappOTP = useCallback(
    async (phone_number: string) => {
      if (!executeRecaptcha || !phone_number) return
      try {
        setRequesting(true)
        const recaptcha = await executeRecaptcha()
        await requestWhatsappOTP({ whatsapp: `62${phone_number}`, recaptcha })
        setIsRequested(true)
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setRequesting(false)
      }
    },
    [executeRecaptcha]
  )

  return {
    requesting,
    isRequested,
    getWhatsappOTP
  }
}