$("#contact_form").validate({
    messages : {
        first_name: {
            required: "First Name is required"
        },
        last_name: {
            required: "Last Name is required"
        },
        phone_number: {
            required: "Phone number is required"
        },
        email_address: {
            required: "Email is required",
            email:'Incorrect email address'
        }
    },
    rules: {
        first_name: {
            required: true,
        },
        last_name: {
            required: true,
        },
        phone_number: {
            required: true,
        },
        email_address: {
            required: true,
            email: true
        },
    }
})




// $("#contact_form").submit(function(e){
//     e.preventDefault()



//     var response = grecaptcha.getResponse();
//     //recaptcha failed validation

//     $.ajax({
//         url: "/validate_captcha",
//         method: "POST",
//         data: {
//            api_key:'test123'
//         }
//      }).done((msg) => {
//          console.log("MSG", msg);
//      } )

//     console.log("RESPOnSE ", response);
//     // if (response.length == 0) {
//     //   $('#recaptcha-error').show();
//     //   return false;
//     // }
//     //   //recaptcha passed validation
//     // else {
//     //   $('#recaptcha-error').hide();
//     //   return true;
//     // }
// })