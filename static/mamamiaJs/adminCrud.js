$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: '/menu',
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            console.log(data)
            counter = 1;
            for (var i = 0; i < data.length; i++) {
                var curr_id = data[i][0]
                var curr_title = data[i][1]
                var curr_description = data[i][2]
                var curr_status = data[i][3] == 0 ? 'Incomplete' : 'Completed';
                var curr_row_html2 = '<tr><td>' + counter + '</td><td>' + curr_title + '</td><td>' + curr_description + '</td><td>' + curr_status
                    + '</td><td><button id="btnEdit' + curr_id + '" class="btn edit-btn" type="button" data-toggle="modal" data-target="#editPopup"><span class="material-icons">edit</span></button></td>'
                    + '<td><button id="btnDelete' + curr_id + '" class="btn delete-btn" type="button"><span class="material-icons">delete</span></button></td></tr>';
                //$("#todo-table").append(curr_row_html2);

                var curr_row_html = `<div class="col-sm-6 col-md-6 col-lg-4 col-xl-4">
                                            <div class="products-single fix">
                                                <div class="box-img-hover">
                                                    <img src="../static/images/img-pro-01.jpg" class="img-fluid"
                                                        alt="Image">
                                                    <div class="mask-icon">
                                                        <ul>
                                                            <li><a href="#" data-toggle="tooltip" data-placement="right"
                                                                    title="View"><i class="fas fa-eye"></i></a></li>
                                                            <li><a href="#" data-toggle="tooltip" data-placement="right"
                                                                    title="Compare"><i class="fas fa-sync-alt"></i></a>
                                                            </li>
                                                            <li><a href="#" data-toggle="tooltip" data-placement="right"
                                                                    title="Add to Wishlist"><i
                                                                        class="far fa-heart"></i></a></li>
                                                        </ul>
                                                        <a class="cart" href="#">Edit Menu Item</a>
                                                        <a class="cart" href="#">Delete Menu Item</a>
                                                    </div>
                                                </div>
                                                <div class="why-text">
                                                    <h4>Lorem ipsum dolor sit amet</h4>
                                                    <h5> $9.79</h5>
                                                </div>
                                            </div>
                                        </div>`
                $("#todo-table").append(curr_row_html);

                counter++;
            }

            $('.new-menu-item').click(function () {
                $('#newMenuItemPopup').modal('show');
            });

            // $('.edit-btn').click(function () {
            //     var sel_id = $(this).attr('id');
            //     sel_id = sel_id.substring(7)
            //     var dict = {"id": sel_id};
            //     $.ajax({
            //         type: 'POST',
            //         url: '/editTodo',
            //         contentType: "application/json",
            //         dataType: "json",
            //         data : JSON.stringify(dict),
            //         success: function (data) {
            //             $('#editId').val(data[0][0])
            //             $('#editTitle').val(data[0][1])
            //             $('#editDescription').val(data[0][2])
            //             var isComplete;
            //             if(data[0][3] == 0) {
            //                 isComplete = "incomplete";
            //             } else {
            //                 isComplete = "complete";
            //             }
            //             $('#editMarkCompleted').val(isComplete)
            //             $('#editPopup').modal('show');
            //         },
            //         error: function (error) {
            //             console.log(error)
            //         }
            //     });
            // });

            $('#newMenuItemSaveChanges').click(function () {
                // var spanNewMenuItemNameError = document.createElement("span");
                // var spanNewMenuItemNameString = "<span> Please enter name! </span>";
                // spanNewMenuItemNameError.innerHTML = spanNewMenuItemNameString;
                // spanNewMenuItemNameError.style.display = "none";
                // var newMenuItemName = document.getElementById("newMenuItemName");
                // newMenuItemName.parentNode.appendChild(spanNewMenuItemNameError);

                // newMenuItemName.onfocus = function () {
                //     spanNewMenuItemNameError.style.display = "none";
                //     newMenuItemName.classList.remove("new-menu-item-error");
                // }

                // var newMenuItemForm = document.getElementById("formNewMenuItem");
                // newMenuItemForm.onsubmit = function (e) {
                //     var newMenuItemNameVal = newMenuItemName.value;
                //     if (newMenuItemNameVal == null || newMenuItemNameVal == "") {
                //         spanNewMenuItemNameError.style.display = "block";
                //         newMenuItemName.classList.add("new-menu-item-error");
                //         e.preventDefault();
                //     }
                //     console.log("Success")
                // }

                var newMenuItemName = $('#newMenuItemName').val()
                var newMenuItemCategory = $('#newMenuItemCategory').val()
                var newMenuItemDescription = $('#newMenuItemDescription').val()
                var newMenuItemPrice = $('#newMenuItemPrice').val()
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
            });

            $('.delete-btn').click(function () {
                var sel_id = $(this).attr('id');
                sel_id = sel_id.substring(9)
                var dict = { "id": sel_id };
                $.ajax({
                    type: 'POST',
                    url: '/deleteTodo',
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(dict),
                    success: function (data) {
                        location.reload();
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

});