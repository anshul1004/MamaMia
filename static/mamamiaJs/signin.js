$(document).ready(function(){

    $('#btnSignIn').click(function() {
        let email = document.getElementById("inputUsername");
        let password = document.getElementById("inputPassword");
        console.log(email)
        console.log(password)
        $.ajax({
            url: '/signIn',
            data: $('form').serialize(),
            type: 'POST',
            success: function(response) {
                console.log(response)
                    var res = JSON.parse(response);
                    if(res.message == "Username doesnt exist")
                        {
                            $("#helper-text-signin-email").removeClass("helper-text-invisible")
                            .addClass("helper-text-visible")

                            email.classList.add("input-border-color");
                        }
                    else {
                        $("#helper-text-signin-email").removeClass("helper-text-visible")
                        .addClass("helper-text-invisible");
            
                        email.classList.remove("input-border-color")
                        }
                    if(res.message == "Password incorrect!")
                        {
                            $("#helper-text-signin-password").removeClass("helper-text-invisible")
                            .addClass("helper-text-visible")

                            password.classList.add("input-border-color");
                        }
                    else {
                            $("#helper-text-signin-password").removeClass("helper-text-visible")
                            .addClass("helper-text-invisible");

                            password.classList.remove("input-border-color")
                        }
                    if(res.message == "user verified!") 
                        window.location.href = "/dashboard";
            },
            error: function(error) {
                console.log(error);
            }
      });
  });
    
});

