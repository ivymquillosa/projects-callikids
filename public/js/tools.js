formatPhoneNumber = function (phone_number) {
    if (phone_number) {
      let formatted_number = phone_number.replace(/[^0-9]/g, '')         
      if (formatted_number.length > 2) {
        if (formatted_number.length < 6) {
          return formatted_number
        } else if (formatted_number.length > 5 && formatted_number.length < 10) {
          let first3 = formatted_number.substring(0, 3)
          let next3 = formatted_number.substring(3, 6)
          let nextSet3 = formatted_number.substring(6, formatted_number.length)

          if (formatted_number.length > 0) {
            formatted_number = first3 + next3 +
                (nextSet3 && nextSet3.length === 3 ? (nextSet3) : nextSet3)
          }
        //   return formatted_number
        }

        let first3 = formatted_number.substring(0, 3)
        let next3 = formatted_number.substring(3, 6)
        let next4 = formatted_number.substring(6, formatted_number.length)
        if (formatted_number.length > 0) {
          formatted_number = ('(' + first3 + ((first3.length >= 3) ? ') ' : '') + next3 +
            (((first3 + next3).length >= 6) ? '-' : '') + next4)
        }
        return formatted_number
      }
      console.log('formatted_number', formatted_number)
      return formatted_number
    }

    return phone_number
  }


  const phoneId = document.getElementById("phone_number");

  phoneId.addEventListener ("keyup", function(){

     const theNumber = formatPhoneNumber(this.value.toString());

     this.value = theNumber
  })