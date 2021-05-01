$(document).ready(function(){
    
    $.ajax({
        url:'/cart',
        type:'GET',
        datatype:'JSON',
        success: function(response) {
            // console.log(response);
            var cart_details = JSON.parse(response);
            var cart_items;
            var subtotal;
            var tax;
            var total;
            var itemsInCart = false;
            if(cart_details['items'].length == 0) {
                itemsInCart = false;
            }
            else {
                itemsInCart = true;
            }
            cart_items = cart_details.items;
            subtotal = cart_details.subtotal;
            tax = cart_details.tax;
            total = cart_details.total;
            var order_box = `<div class="title-left">
                                <h3>Your order</h3>
                            </div>
                            <div class="d-flex">
                                <h4>Sub Total</h4>
                                <div class="ml-auto font-weight-bold"> $`+ subtotal + ` </div>
                            </div>
                            <hr class="my-1">
                            <div class="d-flex">
                                <h4>Tax</h4>
                                <div class="ml-auto font-weight-bold"> $`+ tax + ` </div>
                            </div>
                            <hr>
                            <div class="d-flex gr-total">
                                <h5>Grand Total</h5>
                                <div class="ml-auto h5"> $`+ total + ` </div>
                            </div>
                            <hr>`
            $('.order-box').append(order_box);
            console.log(itemsInCart);
            $("#placeOrder").click(function(){
                console.log(itemsInCart);
                if(!itemsInCart){
                    alert("Nothing in the Cart. Order can't be placed");
                }
                else {
                    var address = document.getElementById("address").value
                    var address2 = document.getElementById("address2").value
                    var city = document.getElementById("city").value;
                    var country = document.getElementById("country").value
                    var state =  document.getElementById("state").value
                    var zip = document.getElementById("zip").value
                    if(address == "" || city == "" || country == "" || state=="" || zip == ""){
                        alert("All required fields should be filled");
                    } else {
                        var order_info = {
                            cart: cart_details,
                            shipping_address: {
                                address_1: address,
                                address_2: address2,
                                city: city,
                                state: state,
                                country: country,
                                zip: zip
                            }
                        }
                        console.log(cart_details)
                        $.ajax({
                            url:'/placeOrder',
                            data: JSON.stringify(order_info),
                            type:'POST',
                            datatype:'JSON',
                            success: function(response) {
                                console.log(response)
                                window.location.href = "/dashboard";
                            },
                            error: function(error) {
                                console.log(error);
                            }

                        });
                    }
                }
            });
            
        },
        error: function(error) {
            console.log(error);
        } 
    });
    

    function validateAddress(){

    }
});