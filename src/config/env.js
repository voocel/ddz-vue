let baseUrl = ''
let routerMode = 'hash'
let baseImgPath

if (process.env.NODE_ENV === 'development') {
  baseUrl = ''
  baseImgPath = '/img/'
} else {
  baseUrl = '//127.0.0.1'
  baseImgPath = '//127.0.0.1/img/'
}

export {
  baseUrl,
  routerMode,
  baseImgPath
}
