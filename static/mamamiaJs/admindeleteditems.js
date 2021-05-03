$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: '/menuShowDeletedItems',
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
                    url: '/menuShowDeletedItems',
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
                                                    <li><button id="btnDelete` + currId + `" class="btn delete-menu-item-btn" type="button" data-toggle="tooltip" 
                                                        data-target="#deletePopup" data-placement="right" title="Delete">Restore Item</button></li>
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
                                                            <li><button id="btnDelete` + currId + `" class="btn delete-menu-item-btn" type="button" data-toggle="tooltip" 
                                                                data-target="#deletePopup" data-placement="right" title="Delete">Restore Item</button></li>
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
        url: '/searchAndFilterDeletedItems',
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
                    url: '/searchAndFilterDeletedItems',
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

function performAdminOperations() {

    $('.delete-menu-item-btn').click(function () {
        var selId = $(this).attr('id');
        selId = selId.substring(9)
        bootbox.confirm({
            message: "Are you sure you want to restore the menu item?",
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
                    formData.append("isAvailable", true)
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