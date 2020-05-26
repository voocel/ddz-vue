import {
  Message
} from 'element-ui'
const obj = {
  getCurTime(type = 0) {
    const myDate = new Date()
    const year = myDate.getFullYear()
    let month = myDate.getMonth() + 1
    let date = myDate.getDate()
    let hour = myDate.getHours()
    let minute = myDate.getMinutes()
    let s = myDate.getSeconds()
    if (date < 10) date = '0' + date
    if (month < 10) month = '0' + month
    if (hour < 10) hour = '0' + hour
    if (minute < 10) minute = '0' + minute
    if (s < 10) s = '0' + s
    if (type === 1) {
      return month + '/' + date
    }
    return (
      year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + s
    )
  },
  tip(msg = 'ok', type = 'success', duration = 3000) {
    Message({
      showClose: true,
      message: msg,
      duration: duration,
      type: type
    })
  },
  /**
     * 获取时间
     * @param intervalDays ：间隔天数
     * @param bolPastTime  ：Boolean,判断在参数date之前，还是之后，
     */
  getDateRange(intervalDays, bolPastTime = true) {
    const dateNow = new Date()
    const oneDayTime = 24 * 60 * 60 * 1000
    const list = []
    let lastDay

    if (bolPastTime === true) {
      lastDay = new Date(dateNow.getTime() - intervalDays * oneDayTime)
      list.push(this.formateDate(lastDay))
      list.push(this.formateDate(dateNow))
    } else {
      lastDay = new Date(dateNow.getTime() + intervalDays * oneDayTime)
      list.push(this.formateDate(dateNow))
      list.push(this.formateDate(lastDay))
    }
    return list
  },
  formateDate(time) {
    const year = time.getFullYear()
    let month = time.getMonth() + 1
    let day = time.getDate()

    if (month < 10) {
      month = '0' + month
    }

    if (day < 10) {
      day = '0' + day
    }

    return year + '-' + month + '-' + day + ''
  }

}
export default obj
