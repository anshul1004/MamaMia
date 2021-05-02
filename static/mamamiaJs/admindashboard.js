$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: '/menu',
        contentType: "application/json",
        dataType: "json",
        data: {
            page: 1
        },
        success: function (data) {
            var totalPages = data['totalItems'] / data['pageSize']
            if (data['totalItems'] % data['pageSize'] != 0) {
                totalPages += 1
            }
            for (var i = 1; i <= totalPages; i++) {
                var currPageHtml = `<button id="btnPage` + i + `" class="btn hvr-hover curr-page-number" type="submit">` + i + `</button>`
                $(".pagination-links").append(currPageHtml);
            }

            populateMenuItems(data)

            $('.curr-page-number').click(function () {
                var selId = $(this).attr('id')
                selId = parseInt(selId.substring(7))
                $.ajax({
                    type: 'GET',
                    url: '/menu',
                    contentType: "application/json",
                    dataType: "json",
                    data: {
                        page: selId
                    },
                    success: function (data) {
                        populateMenuItems(data)
                        performAdminOperations()
                    },
                    error: function (error) {
                        console.log(error)
                    }
                });
            });

            $('#searchForm').submit(function () {
                computeSearchAndFilter()
            });

            $('#categorySelect').change(function () {
                computeSearchAndFilter()
            });

            createNewMenuItem()
            performAdminOperations()
        },
        error: function (error) {
            console.log(error)
        }
    });

});

function populateMenuItems(data) {

    $("#menu-items-grid-view").html('');
    $("#menu-items-list-view").html('');

    for (var i = 0; i < data['items'].length; i++) {
        var currCategory = data['items'][i]['category']
        var currDescription = data['items'][i]['description']
        var currImage = data['items'][i]['image']
        var currName = data['items'][i]['name']
        var currPrice = data['items'][i]['price']
        var currId = data['items'][i]['_id']

        var currHtmlGridView = `<div class="col-sm-6 col-md-6 col-lg-4 col-xl-4">
                                    <div class="products-single fix">
                                        <div class="box-img-hover">
                                            <img src="../static/mamamiaImages/` + currImage + `?=` + new Date().valueOf() + `" class="img-fluid" alt="` + currName + ` title="` + currName + `">
                                            <div class="mask-icon">
                                                <ul>
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

    var pageNumber = data['pageNumber']
    var currPageId = 'btnPage' + pageNumber
    var currPage = document.getElementById(currPageId)
    $(".curr-page-number").removeClass("curr-page-number-active");
    $(".curr-page-number-sf").removeClass("curr-page-number-active");
    if (currPage) {
        currPage.classList.add("curr-page-number-active");
    }
}

function pageLinksSearchFilter(data) {
    $(".pagination-links").html('');
    var totalPages = data['totalItems'] / data['pageSize']
    if (data['totalItems'] % data['pageSize'] != 0) {
        totalPages += 1
    }
    for (var i = 1; i <= totalPages; i++) {
        var currPageHtml = `<button id="btnPage` + i + `" class="btn hvr-hover curr-page-number-sf" type="submit">` + i + `</button>`
        $(".pagination-links").append(currPageHtml);
    }
}

function computeSearchAndFilter() {
    search_string = $('#searchForm').serialize().split("=")[1]
    category = $('#categorySelect').val()
    if (search_string == "" && category == "All") {
        location.reload()
    }
    $.ajax({
        url: '/searchAndFilter',
        data: { 'search': search_string, 'category': category, 'page': 1 },
        contentType: "application/json",
        dataType: "json",
        type: 'GET',
        success: function (data) {
            pageLinksSearchFilter(data)
            populateMenuItems(data)
            performAdminOperations()
            $('.curr-page-number-sf').click(function () {
                var selId = $(this).attr('id')
                selId = parseInt(selId.substring(7))
                search_string = $('#searchForm').serialize().split("=")[1]
                category = $('#categorySelect').val()
                if (search_string == "" && category == "All") {
                    location.reload()
                }
                $.ajax({
                    type: 'GET',
                    url: '/searchAndFilter',
                    contentType: "application/json",
                    dataType: "json",
                    data: { 'search': search_string, 'category': category, 'page': selId },
                    success: function (data) {
                        populateMenuItems(data)
                        performAdminOperations()
                    },
                    error: function (error) {
                        console.log(error)
                    }
                });
            });
        },
        error: function (error) {
            console.log(error)
        }

    });
}

function createNewMenuItem() {

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
}

function performAdminOperations() {

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
}