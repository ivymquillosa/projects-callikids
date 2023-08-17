$(document).ready(function(){

    $(this).on('keyup', function(e){
       
        let mod = $(".pop_modal")
        if(e.key == "Escape"){
            console.log(mod.attr('style'));
            if(mod.attr('style').includes('display: block')){
                $(".pop_modal").fadeOut()
            }
        }
    })

    $("#contact_form").submit(function(e){
        
        const dta = $("#g-recaptcha-response").val()
        if(dta == "" || dta == undefined){
            e.preventDefault()
            $("#rcaptcha").addClass("hasError")
            $(".captcha_err").show()
        }else{
            $("#rcaptcha").removeClass("hasError")
            $(".captcha_err").hide()
        }
        
    })

    let win_width = $(window).width()

    $("#pop_up_btn").click(function(e){
        if(win_width > 425){
            e.preventDefault()
            $(".pop_modal").fadeIn()
        }        
    })
    $(".close_modal").click(function(){
        $(".pop_modal").fadeOut()
    })

    $(window).resize(function(){
        win_width = $(window).width()

        if(win_width <= 425){
            $(".pop_modal").fadeOut()
        }   
    })

})