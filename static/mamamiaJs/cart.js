$(document).ready(function(){
    
    $.ajax({
        url: '/cart',
        type: 'GET',
        datatype:'JSON',
        success: function(response) {
            var i;
            var cart = JSON.parse(response);
            console.log(cart)
            var total = 0
            var items = cart.items;
            var cartId = cart._id;
            var email = cart.email;
            if (items != undefined) {
                for(i=0;i<items.length;i++){
                    console.log(items[i]);
                    var item_id = items[i].id;
                    // var image = items[i].image;
                    var item_name = items[i].name;
                    var price = items[i].price;
                    var quantity = items[i].quantity;
                    total = (parseFloat(price).toFixed(2)*parseInt(quantity)).toString();
                    console.log(total);
                    var data = ' <tr class="cartItem" id=row-'+ i +'>' +
                        '<td >' +
                            '<p>'+(i+1)+'</p>' +
                        '</td>'+
                        '<td class="name-pr">'+
                            '<p>'+
                                item_name
                            + '</p>'+
                        '</td>'+
                        '<td class="price-pr">'+
                            '<p>'+ price+'</p>'+
                        '</td>'+
                        '<td class="quantity-box"><input type="number" size="4" value="'+quantity+'" min="0" step="1"'+
                                'class="c-input-text qty text"></td>'+
                        '<td class="total-pr">'+
                            '<p>'+total+'</p>'+
                        '</td>'+
                        '<td class="remove-pr">'+
                            '<button class="deleteButton" type="button" id=deletebutton-'+i+'>'+
                                '<i class="fas fa-times"></i>'+
                            '</button>'+
                        '</td>'+
                    '</tr>';
                    $("#cart-table-body").append(data);
                }
            }
            var subtotal = 0;
                
            $('.cartItem').each(function(){
                subtotal += parseFloat($(this).children('.total-pr').text());
            });

            var tax = (subtotal*0.15).toFixed(2);
            var total = (parseFloat(subtotal)+parseFloat(tax)).toFixed(2);

            
            var cart_summary = '<h3>Order summary</h3>'+
            '<div class="d-flex">'+
                '<h4>Sub Total</h4>'+
                '<div class="ml-auto font-weight-bold"> $'+ subtotal +'</div>'+
            '</div>'+
            '<div class="d-flex">'+
                '<h4>Tax</h4>'+
                '<div class="ml-auto font-weight-bold"> $'+ tax +'</div>'+
            '</div>'+
            '<hr>'+
            '<div class="d-flex gr-total">'+
                '<h5>Grand Total</h5>'+
                '<div class="ml-auto h5"> $'+ total +'</div>'+
            '</div>'+
            '<hr>';
            $('.order-box').append(cart_summary);
            cart['total'] = total;
            cart['tax'] = tax;
            cart['subtotal'] = subtotal;

            $(function () {
                $('.deleteButton').on('click', function () {
                    var editButtonid = $(this).attr('id');
                    var id = editButtonid.split("-");
                    // remove this item from cart 
                    var itemRow = $(this).parent().parent();
                    itemRow.remove();
                    cart.items.splice(id[1],1);
                    recalculateCart();
                });
            });
            

            $(function () {
                $('.quantity-box input').change(function () {
                    var productRow = $(this).parent().parent();
                    var productIdInCart = productRow.attr('id');
                    var id = productIdInCart.split("-");
                    var itemPrice = parseFloat(productRow.children('.price-pr').text());
                    var quantity = $(this).val();
                    cart.items[id[1]].quantity = quantity;
                    var item_total = (itemPrice * parseInt(quantity)).toFixed(2);
                    // productRow.children('.quantity-box').children().setAttribute("value", quantity);
                    productRow.children('.total-pr').text(item_total);
                    recalculateCart();
                });
            });

            function recalculateCart() {
                subtotal = 0;
                
                $('.cartItem').each(function(){
                    subtotal += parseFloat($(this).children('.total-pr').text());
                });

                tax = (subtotal*0.15).toFixed(2);
                total = (parseFloat(subtotal)+parseFloat(tax));

                
                cart_summary = '<h3>Order summary</h3>'+
                '<div class="d-flex">'+
                    '<h4>Sub Total</h4>'+
                    '<div class="ml-auto font-weight-bold"> $'+ subtotal +'</div>'+
                '</div>'+
                '<div class="d-flex">'+
                    '<h4>Tax</h4>'+
                    '<div class="ml-auto font-weight-bold"> $'+ tax +'</div>'+
                '</div>'+
                '<hr>'+
                '<div class="d-flex gr-total">'+
                    '<h5>Grand Total</h5>'+
                    '<div class="ml-auto h5"> $'+ total +'</div>'+
                '</div>'+
                '<hr>';
                $('.order-box').children().remove();
                $('.order-box').append(cart_summary);
                cart['total'] = total;
                cart['tax'] = tax;
                cart['subtotal'] = subtotal;
            }

            $(function () {
                $('#updateCartButton').on('click', function () {
                    console.log("Update Cart called");
                    console.log(cart);
                    $.ajax({
                            url:'/cart',
                            data: JSON.stringify(cart),
                            type: 'PUT',
                            datatype:'JSON',
                            contentType: 'application/json',
                            success: function(response) {
                                console.log("Update Successful!!");
                                window.location.reload();
                            },
                            error: function(error) {
                                console.log(error);
                            }
                    });
                });
            });

            

                $(function () {
                    $('#checkoutButton').on('click', function () {
                        console.log("Checkout");
                        if(items != undefined){
                            $.ajax({
                                    url:'/cart',
                                    data: JSON.stringify(cart),
                                    type: 'PUT',
                                    datatype:'JSON',
                                    contentType: 'application/json',
                                    success: function(response) {
                                        console.log("Checking out and updating the cart!!");
                                        window.location.href="/checkout";
                                    },
                                    error: function(error) {
                                        console.log(error);
                                    }
                            });
                        }else{
                            alert("Nothing to checkout!! Cart is Empty");
                        }
                    });
                });

        },
        error: function(error) {
            console.log(error);
        } 
    });
});