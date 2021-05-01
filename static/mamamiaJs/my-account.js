$(document).ready(function(){
    $.ajax({
        url:'/getOrders',
        type:'GET',
        datatype: 'JSON',
        success: function(response) {
            var order_history = JSON.parse(response);
            var orders = order_history['orders'];
            var i;
            if(orders.length != 0){
                for(i=0;i<orders.length;i++){
                    var address = orders[i]['address']['address_1'] + " " +orders[i]['address']['address_2'] + ", \n" +
                    orders[i]['address']['city'] + " " + orders[i]['address']['state'] +" "+ orders[i]['address']['zip'] +"\n"+ orders[i]['address']['country']
                    var orderTableRow = `<tr>
                    <th scope="row">`+ (i+1) +`</th>
                    <td><button class="viewOrderDetails" id="order-`+i+`" type="button" data-toggle="modal" data-target="#exampleModal">View Order</button></td>
                    <td>`+ orders[i]['date'] +`</td>
                    <td><p>`+ address +`</p></td>
                  </tr>`
                  $('#orderTable').append(orderTableRow);
                }
            }
            else {
                // console.log("No Order Placed");
                var noTable = '<h2>No Orders Placed</h2>'
                $('#orderTable').append(noTable);
            }

            $('.viewOrderDetails').click(function(){
                var viewOrderButton = $(this).attr('id');
                var id = parseInt(viewOrderButton.split("-")[1]);
                var cart = orders[id]['cart'];
                var items = cart['items'];
                var subtotal = cart['subtotal'];
                var tax = cart['tax'];
                var grandtotal = cart['total'];
                var str = "";
                for(i=0;i<items.length;i++){
                    // console.log(items[i]);
                    var item_id = items[i].id;
                    // var image = items[i].image;
                    var item_name = items[i].name;
                    var price = items[i].price;
                    var quantity = items[i].quantity;
                    total = (parseFloat(price).toFixed(2)*parseInt(quantity)).toString();
                    // console.log(total);
                    
                    var data = "<tr class=\"cartItem\" id=row-"+i+">" +
                        "<td >" +
                            "<p>"+(i+1)+"</p>" +
                        "</td>"+
                        "<td class=\"name-pr\">"+
                            "<p>"+
                                item_name
                            + "</p>"+
                        "</td>"+
                        "<td class=\"price-pr\">"+
                            "<p>"+ price+"</p>"+
                        "</td>"+
                        "<td class=\"quantity-box\"><p>"+quantity+"</p></td>"+
                        "<td class=\"total-pr\">"+
                            "<p>"+total+"</p>"+
                        "</td>"+
                    "</tr>";
                    str+=data;
                }
            $("#order-table-body").html(str);

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
                '<div class="ml-auto h5"> $'+ grandtotal +'</div>'+
            '</div>'+
            '<hr>';
            $('.order-box').html(cart_summary);
            });
        },
        error: function(error) {
            console.log(error);
        }
    });
});