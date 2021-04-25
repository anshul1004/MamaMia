$(document).ready(function(){

    $('#btnSignUp').click(function() {
        let email = document.getElementById("inputEmail");
        let password = document.getElementById("inputPassword");
        let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(email.value == null || email.value == "" || !re.test(String(email.value).toLowerCase())){
            $("#helper-text-email").removeClass("helper-text-invisible")
            .addClass("helper-text-visible")

            email.classList.add("input-border-color");
        }else{
            $("#helper-text-email").removeClass("helper-text-visible")
            .addClass("helper-text-invisible");

            email.classList.remove("input-border-color")
        }
        if(password.value == null || password.value == "" || password.value.length<8 || !strongPassword.test(password.value)) {
            $("#helper-text-password").removeClass("helper-text-invisible")
            .addClass("helper-text-visible")
            password.classList.add("input-border-color");
        }else{
            $("#helper-text-password").removeClass("helper-text-visible")
            .addClass("helper-text-invisible");

            password.classList.remove("input-border-color")
        }
        $.ajax({
            url: '/signUp',
            data: $('form').serialize(),
            type: 'POST',
            success: function(response) {
                console.log(response)
                    var message = JSON.parse(response);
                    if(message.error == "User already exists")
                        alert("User already esists");
                    else if(message.error == "Invalid Credentials")
                        {
                            console.log("Invalid Credentials: Backend Check");
                            alert("Email or Password wrong");
                        }
                    else 
                        window.location.href = "/userLandingPage";
            },
            error: function(error) {
                console.log(error);
            }
      });
  });
    
});

