export const REGEX = {
  orgEmailOnly:
    /^([\w.-]+)@(\[(\d{1,3}\.){3}|(?!googlemail|gmx|zoho|icloud|mac|me|ymail|bluewin|protonmail|t-online|web\.|online\.|aol\.|live\.)(([a-zA-Z\d-]+\.)+))([a-zA-Z]{2,63}|\d{1,3})(\]?)$/,
  noWhiteSpace: /^\s*\S+\s*$/,
  oneLowercase: /[a-z]/,
  oneUppercase: /[A-Z]/,
  oneNumber: /[0-9]/,
  oneSymbol: /(?=.*\W)/
}