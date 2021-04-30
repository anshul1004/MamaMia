$(document).ready(function () {
    // $.ajax({
    //     type: 'GET',
    //     url: '/menu',
    //     contentType: "application/json",
    //     dataType: "json",
    //     data: {
    //         page: 1
    //     },
    //     success: function (data) {
    //         var totalPages = data['totalItems'] / data['pageSize']
    //         if (data['totalItems'] % data['pageSize'] != 0) {
    //             totalPages += 1
    //         }
    //         for (var i = 1; i <= totalPages; i++) {
    //             var currPageHtml = `<button id="btnPage` + i + `" class="btn hvr-hover curr-page-number" type="submit">` + i + `</button>`
    //             $(".pagination-links").append(currPageHtml);
    //         }

    //         populateMenuItems(data)

    //         $('.curr-page-number').click(function () {
    //             var selId = $(this).attr('id')
    //             selId = parseInt(selId.substring(7))
    //             $.ajax({
    //                 type: 'GET',
    //                 url: '/menu',
    //                 contentType: "application/json",
    //                 dataType: "json",
    //                 data: {
    //                     page: selId
    //                 },
    //                 success: function (data) {
    //                     populateMenuItems(data)

    //                     $(".cart").click(function(){
    //                         console.log($(this).attr('id'))
    //                         var itemId = $(this).attr('id').split('-')[1];
    //                         $.ajax({
    //                             url: '/addtocart',
    //                             type: 'POST',
    //                             contentType:"application/json",
    //                             dataType: "json",
    //                             data: JSON.stringify({
    //                                 id: itemId
    //                             }),
    //                             success: function (response) {
    //                                 console.log(response)
    //                             },
    //                             error: function (error) {
    //                                 console.log(error)
    //                             }
    //                         });
    //                     });
    //                 },
    //                 error: function (error) {
    //                     console.log(error)
    //                 }
    //             });
    //         });

    //         $(".cart").click(function(){
    //             console.log($(this).attr('id'))
    //             var itemId = $(this).attr('id').split('-')[1];
    //             $.ajax({
    //                 url: '/addtocart',
    //                 type: 'POST',
    //                 contentType:"application/json",
    //                 dataType: "json",
    //                 data: JSON.stringify({
    //                     id: itemId
    //                 }),
    //                 success: function (response) {
    //                     console.log(response)
    //                 },
    //                 error: function (error) {
    //                     console.log(error)
    //                 }
    //             });
    //         });
    //     },
    //     error: function (error) {
    //         console.log(error)
    //     }
    // });

    $('#btnSearch').click(function() {
        $.ajax({
            url: '/searchInMenu',
            data: $('#searchForm').serialize(),
            type: 'POST',
            success: function(data) {
                $("#menu-items-grid-view").empty();
                $("#menu-items-list-view").empty();
                
                $.each(JSON.parse(data), function(i, item) {
                    var currDescription = item['description']
                    var currImage = item['image']
                    var currName = item['name']
                    var currPrice = item['price']
                    var currId = item['_id']

                    var currHtmlGridView = `<div class="col-sm-6 col-md-6 col-lg-4 col-xl-4">
                                                <div class="products-single fix">
                                                    <div class="box-img-hover">
                                                        <img src="../static/mamamiaImages/` + currImage + `" class="img-fluid" alt="` + currName + ` title="` + currName + `">
                                                        <div class="mask-icon">
                                                            <button class="cart" type="button" id="btnAddToCart-`+ currId +`">Add to Cart</button>
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
                                                            <img src="../static/mamamiaImages/` + currImage +  `" class="img-fluid" alt="` + currName + ` title="` + currName + `">
                                                                <div class="mask-icon">
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-6 col-md-6 col-lg-8 col-xl-8">
                                                        <div class="why-text full-width">
                                                            <h4>` + currName + `</h4>
                                                            <h5> $ ` + currPrice + `</h5>
                                                            <p>` + currDescription + `</p>
                                                            <button class="btn hvr-hover cart" type="button" id=btnAddToCart-`+ currId +`>Add to Cart</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>`
                    $("#menu-items-list-view").append(currHtmlListView);
                });
            },
            error: function (error) {
                console.log(error)
            }
                    
        });
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
                                                <button class="cart" type="button" id="btnAddToCart-`+ currId +`">Add to Cart</button>
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
                                                <img src="../static/mamamiaImages/` + currImage + `?=` + new Date().valueOf() + `" class="img-fluid" alt="` + currName + ` title="` + currName + `">
                                            </div>
                                        </div>
                                        <div class="col-sm-6 col-md-6 col-lg-8 col-xl-8">
                                            <div class="why-text full-width">
                                                <h4>` + currName + `</h4>
                                                <h5> $ ` + currPrice + `</h5>
                                                <p>` + currDescription + `</p>
                                                <button class="btn hvr-hover cart" type="button" id=btnAddToCart-`+ currId +`>Add to Cart</button>
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
    currPage.classList.add("curr-page-number-active");
}
