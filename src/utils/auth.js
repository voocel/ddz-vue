const TokenKey = 'ddz_token'

export function getToken() {
  return sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
  return sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return sessionStorage.removeItem(TokenKey)
}

export function refreshToken(token) {
  sessionStorage.removeItem(TokenKey)
  return sessionStorage.setItem(TokenKey, token)
}

export function getDirection(uid) {
  const seatMap = JSON.parse(sessionStorage.seat_map)
  for (const key in seatMap) {
    if (seatMap[key] === uid) {
      return key
    }
  }
}

export function setUserInfo(userInfo) {
  return sessionStorage.setItem('ddz_user_info', userInfo)
}

export function getUserInfo() {
  return JSON.parse(sessionStorage.getItem('ddz_user_info'))
}

export function removeUserInfo() {
  return sessionStorage.removeItem('ddz_user_info')
}
