$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: '/menu',
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            console.log(data)
            for (var i = 0; i < data.length; i++) {
                var currCategory = data[i]['category']
                var currDescription = data[i]['description']
                var currImage = data[i]['image']
                var currName = data[i]['name']
                var currPrice = data[i]['price']
                var currId = data[i]['_id']

                var curr_html = `<div class="col-sm-6 col-md-6 col-lg-4 col-xl-4">
                                    <div class="products-single fix">
                                        <div class="box-img-hover">
                                            <img src="../static/images/img-pro-01.jpg" class="img-fluid" alt="Image">
                                            <div class="mask-icon">
                                                <ul>
                                                    <li><button id="btnView'` + currId + `'" class="btn view-btn" type="button" data-toggle="tooltip" 
                                                        data-target="#view" data-placement="right" title="View"><i class="far fa-eye"></i></button></li>
                                                    <li><button id="btnEdit'` + currId + `'" class="btn edit-btn" type="button" data-toggle="tooltip" 
                                                        data-target="#editPopup" data-placement="right" title="Edit"><i class="far fa-edit"></i></button></li>
                                                    <li><button id="btnDelete'` + currId + `'" class="btn delete-btn" type="button" data-toggle="tooltip" 
                                                        data-target="#deletePopup" data-placement="right" title="Delete"><i class="far fa-trash-alt"></i></button></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="why-text">
                                            <h4>` + currName + `</h4>
                                            <h5> $ ` + currPrice + `</h5>
                                        </div>
                                    </div>
                                </div>`
                $("#menu-items-grid-view").append(curr_html);
            }

            $('.new-menu-item').click(function () {
                $('#newMenuItemPopup').modal('show');
            });

            $('#newMenuItemSaveChanges').click(function () {
                var newMenuItemNameId = document.getElementById("newMenuItemName");
                var newMenuItemPriceId = document.getElementById("newMenuItemPrice");

                var flag = true

                if (newMenuItemNameId.value == null || newMenuItemNameId.value == "") {
                    $("#newMenuItemNameError").removeClass("helper-text-invisible")
                        .addClass("helper-text-visible")
                    newMenuItemNameId.classList.add("input-border-color");
                    flag = false;
                } else {
                    $("#newMenuItemNameError").removeClass("helper-text-visible")
                        .addClass("helper-text-invisible");
                    newMenuItemNameId.classList.remove("input-border-color")
                }

                if (newMenuItemPriceId.value == null || newMenuItemPriceId.value == "" || isNaN(newMenuItemPriceId.value)) {
                    $("#newMenuItemPriceError").removeClass("helper-text-invisible")
                        .addClass("helper-text-visible")
                    newMenuItemPriceId.classList.add("input-border-color");
                    flag = false;
                } else {
                    $("#newMenuItemPriceError").removeClass("helper-text-visible")
                        .addClass("helper-text-invisible");
                    newMenuItemPriceId.classList.remove("input-border-color")
                }

                if (flag) {
                    var newMenuItemName = $('#newMenuItemName').val()
                    var newMenuItemCategory = $('#newMenuItemCategory').val()
                    var newMenuItemDescription = $('#newMenuItemDescription').val()
                    var newMenuItemPrice = $('#newMenuItemPrice').val()
                    newMenuItemPrice = parseFloat(newMenuItemPrice)
                    var newMenuItemImage = $('#newMenuItemImage').val()
                    var dict = { "name": newMenuItemName, "category": newMenuItemCategory, "description": newMenuItemDescription, "price": newMenuItemPrice, "image": newMenuItemImage };

                    $.ajax({
                        type: 'POST',
                        url: '/menu',
                        contentType: "application/json",
                        dataType: "json",
                        data: JSON.stringify(dict),
                        success: function (data) {
                            $('#newMenuItemPopup').modal('hide');
                            location.reload();
                        },
                        error: function (error) {
                            console.log(error)
                        }
                    });
                }
            });
        },
        error: function (error) {
            console.log(error)
        }
    });

});