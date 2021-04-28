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
                                                        <a class="cart" href="#">Add to Cart</a>
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
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6 col-md-6 col-lg-8 col-xl-8">
                                                    <div class="why-text full-width">
                                                        <h4>` + currName + `</h4>
                                                        <h5> $ ` + currPrice + `</h5>
                                                        <p>` + currDescription + `</p>
                                                        <a class="btn hvr-hover" href="#">Add to Cart</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`
                $("#menu-items-list-view").append(currHtmlListView);
            }

        },
        error: function (error) {
            console.log(error)
        }
    });
// $(function(){
    $('#btnSearch').click(function() {
        $.ajax({
            url: '/searchInMenu',
            data: $('#searchForm').serialize(),
            type: 'POST',
            success: function(data) {
                $("#menu-items-grid-view").hide();
                $("#menu-items-list-view").hide();
                
                $.each(JSON.parse(data), function(i, item) {
                    var currDescription = item['description']
                    var currImage = item['image']
                    var currName = item['name']
                    var currPrice = item['price']
                    
                    var currHtmlGridView = `<div class="col-sm-6 col-md-6 col-lg-4 col-xl-4">
                                                <div class="products-single fix">
                                                    <div class="box-img-hover">
                                                        <img src="../static/mamamiaImages/` + currImage + `" class="img-fluid" alt="` + currName + ` title="` + currName + `">
                                                        <div class="mask-icon">
                                                            <a class="cart" href="#">Add to Cart</a>
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
                                                            <a class="btn hvr-hover" href="#">Add to Cart</a>
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
