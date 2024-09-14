export const REGEX = {
  orgEmailOnly:
    /^([\w.-]+)@(\[(\d{1,3}\.){3}|(?!googlemail|gmx|zoho|icloud|mac|me|ymail|bluewin|protonmail|t-online|web\.|online\.|aol\.|live\.)(([a-zA-Z\d-]+\.)+))([a-zA-Z]{2,63}|\d{1,3})(\]?)$/,
  noWhiteSpace: /^\s*\S+\s*$/,
  oneLowercase: /[a-z]/,
  oneUppercase: /[A-Z]/,
  oneNumber: /[0-9]/,
  oneSymbol: /(?=.*\W)/
}

export const getPlainPhoneNumber = (value: string) => {
  return value ? (value.startsWith('62') ? value.replace('62', '') : value) : null
}

export const getFilenameFromContentDisposition = (contentDisposition: string): string | null => {
  if (!contentDisposition) return null
  const matches = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
  if (!matches) return null
  return matches[1].replace(/['"]/g, '')
}