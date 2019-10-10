function getToken() {
    return true
    // if(localStorage.token){
    //     let token=JSON.parse(localStorage.token)
    
    //     if(token.expires < Date.parse(new Date())){
    //       return false
    //     }
    
    //     return token.token
    //   }else{
    //     return false
    //   }
}

function getTokenByUid (uid){
    let seatMap = JSON.parse(sessionStorage.seat_map)
    for(let key in seatMap){
      if(seatMap[key] === uid){
        return key
      }
    }
}

export default {
    getToken,
    getTokenByUid
}