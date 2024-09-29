import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { getErrorMessage } from "../utils/error"
import { requestWhatsappOTP } from "../services/profile"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"
import { getPlainE164PhoneNumber } from "../utils/common"

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
        await requestWhatsappOTP({ whatsapp: getPlainE164PhoneNumber(phone_number || '') || '', recaptcha })
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