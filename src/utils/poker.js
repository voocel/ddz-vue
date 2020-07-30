function analyseSameNum(cards, len) {
  const res = {
    'singleCount': 0,
    'doubleCount': 0,
    'threeCount': 0,
    'fourCount': 0,
    'singleData': [],
    'doubleData': [],
    'threeData': [],
    'fourData': []
  }
  for (let i = 0; i < len; i++) {
    let cbSameCount = 1
    const base = cards[i]
    for (let j = i + 1; j < len; j++) {
      if (cards[j] !== base) break
      cbSameCount++
    }
    switch (cbSameCount) {
      case 1:
        res.singleCount = res.singleCount + 1
        res.singleData.push(cards[i])
        break
      case 2:
        res.doubleCount = res.doubleCount + 1
        res.doubleData.push(cards[i])
        break
      case 3:
        res.threeCount = res.threeCount + 1
        res.threeData.push(cards[i])
        break
      case 4:
        res.fourCount = res.fourCount + 1
        res.fourData.push(cards[i])
        break
    }
    i += cbSameCount - 1
  }
  return res
}

function checkType(cards) {
  const len = cards.length
  const analyseRes = analyseSameNum(cards, len)
  if (len >= 5) {
    if (_checkSingleLine(cards, len)) {
      return 'single_line'
    } else if (!analyseRes.threeCount && !analyseRes.fourCount && _checkDoubleLine(cards, len)) {
      return 'double_line'
    }
  }
  if (analyseRes.threeCount >= 2) {
    if (analyseRes.threeCount * 3 === len && _checkThreeLine(cards, len)) {
      return 'three_line'
    } else if (_checkSingleLine(analyseRes.threeData, analyseRes.threeCount) && (len - analyseRes.threeCount * 3 === analyseRes.threeCount)) {
      return 'plane_with_wing'
    }
  }
  switch (len) {
    case 1:
      return 'single'
    case 2:
      if (cards[0] === '0' && cards[1] === '0') {
        return 'joker_bomb'
      } else if (analyseRes.doubleCount === 1) {
        return 'double'
      }
      return false
    case 3:
      if (analyseRes.threeCount === 1) {
        return 'three'
      }
      return false
    case 4:
      if (analyseRes.fourCount === 1) {
        return 'bomb_card'
      } else if (analyseRes.threeCount === 1 && analyseRes.singleCount === 1) {
        return 'three_take_one'
      }
      return false
    case 5:
      if (analyseRes.threeCount === 1 && analyseRes.doubleCount === 1) {
        return 'three_take_two'
      }
      return false
    case 6:
      if (analyseRes.fourCount === 1 && analyseRes.singleCount === 2) {
        return 'four_take_two'
      } else if (analyseRes.threeCount === 2) {
        return 'three_line'
      }
      return false
    case 8:
      if (analyseRes.threeCount === 2 && analyseRes.singleCount === 2) {
        return 'plane_with_wing'
      }
      return false
    case 10:
      if (analyseRes.threeCount === 2 && analyseRes.doubleCount === 2) {
        return 'plane_with_wing'
      }
      return false

    default:
      return false
  }
}

function sortCrad(cards) {
  return cards.sort((a, b) => {
    const arr = ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '1', '2', '0']
    const x = arr.findIndex(n => n === a.label)
    const y = arr.findIndex(n => n === b.label)
    if (x < y) {
      return 1
    } else if (x > y) {
      return -1
    } else {
      return 0
    }
  })
}

function card2num(cards) {
  const res = []
  cards.forEach(h => {
    res.push(h.label)
  })
  return res
}

function str2num(str, types) {
  for (const index in types) {
    if (types[index] === str) {
      return index
    }
  }
}

function _checkSingleLine(cards, len) {
  let base = cards[0]
  const res = [base]
  for (let i = 0; i < len; i++) {
    if (cards[i] - base === 1) {
      base = cards[i]
      res.push(cards[i])
    }
  }
  return res.length === len
}

function _checkDoubleLine(cards, len) {
  if (len < 6) return false
  const tmp = []
  tmp.push(...new Set(cards))
  if (len === tmp.length * 2) {
    return _checkSingleLine(tmp, tmp.length)
  }
  return false
}

function _checkThreeLine(cards, len) {
  if (len < 6) return false
  const tmp = []
  tmp.push(...new Set(cards))
  if (len === tmp.length * 3) {
    console.log(tmp)
    return _checkSingleLine(tmp, tmp.length)
  }
  return false
}

export default {
  checkType,
  card2num,
  str2num,
  sortCrad
}
