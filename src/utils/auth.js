const TokenKey = 'ddz_token'

function getToken() {
  return true
  // return sessionStorage.getItem(TokenKey)
}

function setToken(token) {
  return sessionStorage.setItem(TokenKey, token)
}

function removeToken() {
  return sessionStorage.removeItem(TokenKey)
}

function refreshToken(token) {
  sessionStorage.removeItem(TokenKey)
  return sessionStorage.setItem(TokenKey, token)
}

function getTokenByUid(uid) {
  const seatMap = JSON.parse(sessionStorage.seat_map)
  for (const key in seatMap) {
    if (seatMap[key] === uid) {
      return key
    }
  }
}

export default {
  getToken,
  setToken,
  removeToken,
  refreshToken,
  getTokenByUid
}
