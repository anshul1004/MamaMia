$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: '/menu',
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var currCategory = data[i]['category']
                var currDescription = data[i]['description']
                var currImage = data[i]['image']
                var currName = data[i]['name']
                var currPrice = data[i]['price']
                var currId = data[i]['_id']

                var currHtmlGridView = `<div class="col-sm-6 col-md-6 col-lg-4 col-xl-4">
                                            <div class="products-single fix">
                                                <div class="box-img-hover">
                                                    <img src="../static/mamamiaImages/` + currImage + `?=` + new Date().valueOf() + `" class="img-fluid" alt="` + currName + ` title="` + currName + `">
                                                    <div class="mask-icon">
                                                        <ul>
                                                            <li><button id="btnView` + currId + `" class="btn view-menu-item-btn" type="button" data-toggle="tooltip" 
                                                                data-target="#view" data-placement="right" title="View"><i class="far fa-eye"></i></button></li>
                                                            <li><button id="btnEdit` + currId + `" class="btn edit-menu-item-btn" type="button" data-toggle="tooltip" 
                                                                data-target="#editPopup" data-placement="right" title="Edit"><i class="far fa-edit"></i></button></li>
                                                            <li><button id="btnDelete` + currId + `" class="btn delete-menu-item-btn" type="button" data-toggle="tooltip" 
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
                $("#menu-items-grid-view").append(currHtmlGridView);

                var currHtmlListView = `<div class="list-view-box">
                                            <div class="row">
                                                <div class="col-sm-6 col-md-6 col-lg-4 col-xl-4">
                                                    <div class="products-single fix">
                                                        <div class="box-img-hover">
                                                        <img src="../static/mamamiaImages/` + currImage + `?=` + new Date().valueOf() + `" class="img-fluid" alt="` + currName + ` title="` + currName + `">
                                                            <div class="mask-icon">
                                                                <ul>
                                                                    <li><button id="btnView` + currId + `" class="btn view-menu-item-btn" type="button" data-toggle="tooltip" 
                                                                        data-target="#view" data-placement="right" title="View"><i class="far fa-eye"></i></button></li>
                                                                    <li><button id="btnEdit` + currId + `" class="btn edit-menu-item-btn" type="button" data-toggle="tooltip" 
                                                                        data-target="#editPopup" data-placement="right" title="Edit"><i class="far fa-edit"></i></button></li>
                                                                    <li><button id="btnDelete` + currId + `" class="btn delete-menu-item-btn" type="button" data-toggle="tooltip" 
                                                                        data-target="#deletePopup" data-placement="right" title="Delete"><i class="far fa-trash-alt"></i></button></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6 col-md-6 col-lg-8 col-xl-8">
                                                    <div class="why-text full-width">
                                                        <h4>` + currName + `</h4>
                                                        <h5> $ ` + currPrice + `</h5>
                                                        <p>` + currDescription + `</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`
                $("#menu-items-list-view").append(currHtmlListView);
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
                    var newMenuItemImage = $('#newMenuItemImage')[0].files[0];

                    var formData = new FormData();
                    formData.append("name", newMenuItemName)
                    formData.append("category", newMenuItemCategory)
                    formData.append("description", newMenuItemDescription)
                    formData.append("price", newMenuItemPrice)
                    formData.append("image", newMenuItemImage)

                    $.ajax({
                        type: 'POST',
                        url: '/menu',
                        enctype: 'multipart/form-data',
                        contentType: false,
                        dataType: "json",
                        processData: false,
                        async: false,
                        cache: false,
                        data: formData,
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

            $('.edit-menu-item-btn').click(function () {
                var selId = $(this).attr('id')
                selId = selId.substring(7)
                var dict = { "_id": selId };
                $.ajax({
                    type: 'GET',
                    url: '/menu/' + selId,
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(dict),
                    success: function (data) {
                        $('#editMenuItemId').val(data['_id'])
                        $('#editMenuItemName').val(data['name'])
                        $('#editMenuItemCategory').val(data['category'])
                        $('#editMenuItemDescription').val(data['description'])
                        $('#editMenuItemPrice').val(data['price'])
                        $('#editMenuItemPopup').modal('show');
                    },
                    error: function (error) {
                        console.log(error)
                    }
                });
            });

            $('#editMenuItemSaveChanges').click(function () {
                var editMenuItemNameId = document.getElementById("editMenuItemName");
                var editMenuItemPriceId = document.getElementById("editMenuItemPrice");

                var flag = true

                if (editMenuItemNameId.value == null || editMenuItemNameId.value == "") {
                    $("#editMenuItemNameError").removeClass("helper-text-invisible")
                        .addClass("helper-text-visible")
                    editMenuItemNameId.classList.add("input-border-color");
                    flag = false;
                } else {
                    $("#editMenuItemNameError").removeClass("helper-text-visible")
                        .addClass("helper-text-invisible");
                    editMenuItemNameId.classList.remove("input-border-color")
                }

                if (editMenuItemPriceId.value == null || editMenuItemPriceId.value == "" || isNaN(editMenuItemPriceId.value)) {
                    $("#editMenuItemPriceError").removeClass("helper-text-invisible")
                        .addClass("helper-text-visible")
                    editMenuItemPriceId.classList.add("input-border-color");
                    flag = false;
                } else {
                    $("#editMenuItemPriceError").removeClass("helper-text-visible")
                        .addClass("helper-text-invisible");
                    editMenuItemPriceId.classList.remove("input-border-color")
                }

                if (flag) {
                    var editMenuItemId = $('#editMenuItemId').val()
                    var editMenuItemName = $('#editMenuItemName').val()
                    var editMenuItemCategory = $('#editMenuItemCategory').val()
                    var editMenuItemDescription = $('#editMenuItemDescription').val()
                    var editMenuItemPrice = $('#editMenuItemPrice').val()
                    editMenuItemPrice = parseFloat(editMenuItemPrice)
                    var editMenuItemImage = $('#editMenuItemImage')[0].files[0];

                    var formData = new FormData();
                    formData.append("_id", editMenuItemId)
                    formData.append("name", editMenuItemName)
                    formData.append("category", editMenuItemCategory)
                    formData.append("description", editMenuItemDescription)
                    formData.append("price", editMenuItemPrice)
                    formData.append("image", editMenuItemImage)

                    $.ajax({
                        type: 'PUT',
                        url: '/menu/' + editMenuItemId,
                        enctype: 'multipart/form-data',
                        contentType: false,
                        dataType: "json",
                        processData: false,
                        async: false,
                        cache: false,
                        data: formData,
                        success: function (data) {
                            $('#editMenuItemPopup').modal('hide');
                            location.reload();
                        },
                        error: function (error) {
                            console.log(error)
                        }
                    });
                }
            });

            $('.delete-menu-item-btn').click(function () {
                var selId = $(this).attr('id');
                selId = selId.substring(9)
                bootbox.confirm({
                    message: "Are you sure you want to delete the menu item?",
                    buttons: {
                        cancel: {
                            label: 'No',
                            className: 'hvr-hover delete-menu-item-no'
                        },
                        confirm: {
                            label: 'Yes',
                            className: 'hvr-hover delete-menu-item-yes'
                        }
                    },
                    callback: function (result) {
                        if (result) {
                            var formData = new FormData();
                            formData.append("isAvailable", false)
                            $.ajax({
                                type: 'PUT',
                                url: '/menu/' + selId,
                                enctype: 'multipart/form-data',
                                contentType: false,
                                dataType: "json",
                                processData: false,
                                async: false,
                                cache: false,
                                data: formData,
                                success: function (data) {
                                    location.reload();
                                },
                                error: function (error) {
                                    console.log(error)
                                }
                            });
                        }
                    }
                });
            });

            $('#deleteMenuItemSaveChanges').click(function () {
                var selId = $(this).attr('id');
                selId = selId.substring(9)
                var dict = { "_id": selId };
                console.log(selId)
                // $.ajax({
                //     type: 'POST',
                //     url: '/deleteTodo',
                //     contentType: "application/json",
                //     dataType: "json",
                //     data : JSON.stringify(dict),
                //     success: function (data) {
                //         location.reload();
                //     },
                //     error: function (error) {
                //         console.log(error)
                //     }
                // });
            });
        },
        error: function (error) {
            console.log(error)
        }
    });

});