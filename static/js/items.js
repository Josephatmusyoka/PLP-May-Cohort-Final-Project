'use strict';

$(document).ready(function(){
    checkDocumentVisibility(checkLogin);//check document visibility in order to confirm user's log in status
	
    //load all items once the page is ready
    lilt();
    
    
    
    //WHEN USE BARCODE SCANNER IS CLICKED
    $("#useBarcodeScanner").click(function(e){
        e.preventDefault();
        
        $("#itemCode").focus();
    });
    
    /**
     * Toggle the form to add a new item
     */
    $("#createItem").click(function(){
        $("#itemsListDiv").toggleClass("col-sm-8", "col-sm-12");
        $("#createNewItemDiv").toggleClass('hidden');
        $("#itemName").focus();
    });
    
    
    $(".cancelAddItem").click(function(){
        //reset and hide the form
        document.getElementById("addNewItemForm").reset();//reset the form
        $("#createNewItemDiv").addClass('hidden');//hide the form
        $("#itemsListDiv").attr('class', "col-sm-12");//make the table span the whole div
    });
    

    //execute when 'auto-generate' checkbox is clicked while trying to add a new item
    $("#gen4me").click(function(){
        //if checked, generate a unique item code for user. Else, clear field
        if($("#gen4me").prop("checked")){
            var codeExist = false;
            
            do{
                //generate random string, reduce the length to 10 and convert to uppercase
                var rand = Math.random().toString(36).slice(2).substring(0, 10).toUpperCase();
                $("#itemCode").val(rand);//paste the code in input
                $("#itemCodeErr").text('');//remove the error message being displayed (if any)
                
                //check whether code exist for another item
                $.ajax({
                    type: 'get',
                    url: appRoot+"items/gettablecol/id/code/"+rand,
                    success: function(returnedData){
                        codeExist = returnedData.status;//returnedData.status could be either 1 or 0
                    }
                });
            }
            
            while(codeExist);
            
        }
        
        else{
            $("#itemCode").val("");
        }
    });
    
    $("#addNewItem").click(function(e) {
        e.preventDefault();
    
        // Clear previous error messages
        changeInnerHTML(['productNameErr', 'categoryErr', 'costPriceErr', 'wholesalePriceErr', 'supplierIDErr', 'descriptionErr', 'stockQuantityErr', 'reorderLevelErr', 'addCustErrMsg'], "");
    
        // Retrieve input values
        var productID = parseInt($("#productID").val());
        var productName = $("#productName").val();
        var category = $("#category").val();
        var costPrice = parseFloat($("#costPrice").val().replace(",", ""));
        var wholesalePrice = parseFloat($("#wholesalePrice").val().replace(",", ""));
        var supplierID = parseInt($("#supplierID").val());
        var description = $("#description").val();
        var stockQuantity = parseInt($("#stockQuantity").val());
        var reorderLevel = parseInt($("#reorderLevel").val());
    
        // Validate required fields
        if (!productName || !category || isNaN(costPrice) || isNaN(wholesalePrice) || isNaN(supplierID) || isNaN(stockQuantity) || isNaN(reorderLevel)) {
            !productName ? $("#productNameErr").text("Product name is required") : "";
            !category ? $("#categoryErr").text("Category is required") : "";
            isNaN(costPrice) ? $("#costPriceErr").text("Valid cost price is required") : "";
            isNaN(wholesalePrice) ? $("#wholesalePriceErr").text("Valid wholesale price is required") : "";
            isNaN(supplierID) ? $("#supplierIDErr").text("Valid supplier ID is required") : "";
            isNaN(stockQuantity) ? $("#stockQuantityErr").text("Valid stock quantity is required") : "";
            isNaN(reorderLevel) ? $("#reorderLevelErr").text("Valid reorder level is required") : "";
    
            $("#addCustErrMsg").text("One or more required fields are empty");
            return;
        }
    
        // Display loading message
        displayFlashMsg("Adding Item '" + productName + "'", "fa fa-spinner faa-spin animated", '', '');
    
        // AJAX request to add item
        $.ajax({
            type: "POST",
            url: appRoot + "items/add",
            data: {
                productID: productID,
                productName: productName,
                category: category,
                costPrice: costPrice,
                wholesalePrice: wholesalePrice,
                supplierID: supplierID,
                description: description,
                stockQuantity: stockQuantity,
                reorderLevel: reorderLevel
            },
            success: function(returnedData) {
                if (returnedData.status === 1) {
                    changeFlashMsgContent(returnedData.msg, "text-success", '', 1500);
                    document.getElementById("addNewItemForm").reset();
                    lilt();
                    $("#productID").focus(); // Return focus to product ID input
                } else {
                    hideFlashMsg();
                    $("#productNameErr").text(returnedData.productName);
                    $("#categoryErr").text(returnedData.category);
                    $("#costPriceErr").text(returnedData.costPrice);
                    $("#wholesalePriceErr").text(returnedData.wholesalePrice);
                    $("#supplierIDErr").text(returnedData.supplierID);
                    $("#stockQuantityErr").text(returnedData.stockQuantity);
                    $("#reorderLevelErr").text(returnedData.reorderLevel);
                    $("#addCustErrMsg").text(returnedData.msg);
                }
            },
            error: function() {
                if (!navigator.onLine) {
                    changeFlashMsgContent("You appear to be offline. Please reconnect to the internet and try again", "", "red", "");
                } else {
                    changeFlashMsgContent("Unable to process your request at this time. Please try again later!", "", "red", "");
                }
            }
        });
    });
    
    
    //reload items list table when events occur
    $("#itemsListPerPage, #itemsListSortBy").change(function(){
        displayFlashMsg("Please wait...", spinnerClass, "", "");
        lilt();
    });
    
    
    $("#itemSearch").keyup(function(){
        var value = $(this).val();
        
        if(value){
            $.ajax({
                url: appRoot+"search/itemsearch",
                type: "get",
                data: {v:value},
                success: function(returnedData){
                    $("#itemsListTable").html(returnedData.itemsListTable);
                }
            });
        }
        
        else{
            //reload the table if all text in search box has been cleared
            displayFlashMsg("Loading page...", spinnerClass, "", "");
            lilt();
        }
    });
    
    
    
    // Triggers when an item's "edit" icon is clicked
    $("#itemsListTable").on('click', ".editItem", function(e) {
        e.preventDefault();

        // Get item info
        var itemId = $(this).attr('id').split("-")[1];
        var itemName = $("#itemName-" + itemId).text();
        var itemCode = $("#itemCode-" + itemId).text();
        var itemPrice = parseFloat($("#itemPrice-" + itemId).text().replace(/[^0-9.]+/g, ""));
        var itemDescription = $("#itemDescription-" + itemId).text();
        var itemCategory = $("#itemCategory-" + itemId).text();
        var itemSupplierID = parseInt($("#itemSupplierID-" + itemId).text());
        var itemStockQuantity = parseInt($("#itemStockQuantity-" + itemId).text());
        var itemReorderLevel = parseInt($("#itemReorderLevel-" + itemId).text());

        // Prefill form with info
        $("#itemIdEdit").val(itemId);
        $("#itemNameEdit").val(itemName);
        $("#itemCodeEdit").val(itemCode);
        $("#itemPriceEdit").val(itemPrice);
        $("#itemDescriptionEdit").val(itemDescription);
        $("#itemCategoryEdit").val(itemCategory);
        $("#itemSupplierIDEdit").val(itemSupplierID);
        $("#itemStockQuantityEdit").val(itemStockQuantity);
        $("#itemReorderLevelEdit").val(itemReorderLevel);

        // Remove all error messages that might exist
        $("#editItemFMsg").html("");
        $("#itemNameEditErr").html("");
        $("#itemCodeEditErr").html("");
        $("#itemPriceEditErr").html("");
        $("#itemDescriptionEditErr").html("");
        $("#itemCategoryEditErr").html("");
        $("#itemSupplierIDEditErr").html("");
        $("#itemStockQuantityEditErr").html("");
        $("#itemReorderLevelEditErr").html("");

        // Launch modal
        $("#editItemModal").modal('show');
    });

    
    $("#editItemSubmit").click(function() {
        var productName = $("#productNameEdit").val();
        var category = $("#categoryEdit").val();
        var costPrice = $("#costPriceEdit").val();
        var wholesalePrice = $("#wholesalePriceEdit").val();
        var supplierID = $("#supplierIDEdit").val();
        var description = $("#descriptionEdit").val();
        var stockQuantity = $("#stockQuantityEdit").val();
        var reorderLevel = $("#reorderLevelEdit").val();
        var productID = $("#productIDEdit").val();
        
        if (!productName || !costPrice || !stockQuantity || !productID) {
            !productName ? $("#productNameEditErr").html("Product name cannot be empty") : "";
            !costPrice ? $("#costPriceEditErr").html("Cost price cannot be empty") : "";
            !stockQuantity ? $("#stockQuantityEditErr").html("Stock quantity cannot be empty") : "";
            !productID ? $("#editItemFMsg").html("Unknown product") : "";
            return;
        }
        
        $("#editItemFMsg").css('color', 'black').html("<i class='"+spinnerClass+"'></i> Processing your request....");
        
        $.ajax({
            method: "POST",
            url: appRoot + "items/edit",
            data: {
                ProductID: productID,
                ProductName: productName,
                Category: category,
                Cost_Price: costPrice,
                Wholesale_Price: wholesalePrice,
                SupplierID: supplierID,
                Description: description,
                Stock_Quantity: stockQuantity,
                Reorder_Level: reorderLevel
            }
        }).done(function(returnedData) {
            if (returnedData.status === 1) {
                $("#editItemFMsg").css('color', 'green').html("Product successfully updated");
                
                setTimeout(function() {
                    $("#editItemModal").modal('hide');
                }, 1000);
                
                // Refresh item list
                lilt();
            } else {
                $("#editItemFMsg").css('color', 'red').html("One or more required fields are empty or not properly filled");
                
                $("#productNameEditErr").html(returnedData.ProductName);
                $("#costPriceEditErr").html(returnedData.Cost_Price);
                $("#stockQuantityEditErr").html(returnedData.Stock_Quantity);
            }
        }).fail(function() {
            $("#editItemFMsg").css('color', 'red').html("Unable to process your request at this time. Please check your internet connection and try again");
        });
    });
    
    
    $("#itemsListTable").on('click', '.updateStock', function() {
        var productId = $(this).attr('id').split("-")[1];
        var productName = $("#productName-" + productId).html();
        var currentStockQuantity = $("#stockQuantity-" + productId).html();
        var productCode = $("#itemCode-" + productId).html();
        
        $("#stockUpdateProductId").val(productId);
        $("#stockUpdateProductName").val(productName);
        $("#stockUpdateProductCode").val(productCode);
        $("#stockUpdateCurrentStock").val(currentStockQuantity);
        
        $("#updateStockModal").modal('show');
    });
    
    $("#stockUpdateType").on('change', function() {
        var updateType = $("#stockUpdateType").val();
        
        if (updateType && (updateType === 'newStock')) {
            $("#stockUpdateDescription").val("New items were purchased");
        } else {
            $("#stockUpdateDescription").val("");
        }
    });
    
    $("#stockUpdateSubmit").click(function() {
        var updateType = $("#stockUpdateType").val();
        var stockUpdateQuantity = $("#stockUpdateQuantity").val();
        var stockUpdateDescription = $("#stockUpdateDescription").val();
        var productId = $("#stockUpdateProductId").val();
        
        if (!updateType || !stockUpdateQuantity || !stockUpdateDescription || !productId) {
            !updateType ? $("#stockUpdateTypeErr").html("Required") : "";
            !stockUpdateQuantity ? $("#stockUpdateQuantityErr").html("Required") : "";
            !stockUpdateDescription ? $("#stockUpdateDescriptionErr").html("Required") : "";
            !productId ? $("#stockUpdateProductIdErr").html("Required") : "";
            return;
        }
        
        $("#stockUpdateFMsg").html("<i class='"+spinnerClass+"'></i> Updating Stock.....");
        
        $.ajax({
            method: "POST",
            url: appRoot + "items/updatestock",
            data: {
                ProductID: productId,
                UpdateType: updateType,
                Quantity: stockUpdateQuantity,
                Description: stockUpdateDescription
            }
        }).done(function(returnedData) {
            if (returnedData.status === 1) {
                $("#stockUpdateFMsg").html(returnedData.msg);
                
                // Refresh items' list
                lilt();
                
                // Reset form
                document.getElementById("updateStockForm").reset();
                
                // Dismiss modal after some seconds
                setTimeout(function() {
                    $("#updateStockModal").modal('hide');
                    $("#stockUpdateFMsg").html("");
                }, 1000);
            } else {
                $("#stockUpdateFMsg").html(returnedData.msg);
                
                $("#stockUpdateTypeErr").html(returnedData.UpdateType);
                $("#stockUpdateQuantityErr").html(returnedData.Quantity);
                $("#stockUpdateDescriptionErr").html(returnedData.Description);
            }
        }).fail(function() {
            $("#stockUpdateFMsg").html("Unable to process your request at this time. Please check your internet connection and try again");
        });
    });
    
    //PREVENT AUTO-SUBMISSION BY THE BARCODE SCANNER
    $("#itemCode").keypress(function(e){
        if(e.which === 13){
            e.preventDefault();
            
            //change to next input by triggering the tab keyboard
            $("#itemName").focus();
        }
    });
    
    
    
    //TO DELETE AN ITEM (The item will be marked as "deleted" instead of removing it totally from the db)
    $("#itemsListTable").on('click', '.delItem', function(e){
        e.preventDefault();
        
        //get the item id
        var itemId = $(this).parents('tr').find('.curItemId').val();
        var itemRow = $(this).closest('tr');//to be used in removing the currently deleted row
        
        if(itemId){
            var confirm = window.confirm("Are you sure you want to delete item? This cannot be undone.");
            
            if(confirm){
                displayFlashMsg('Please wait...', spinnerClass, 'black');
                
                $.ajax({
                    url: appRoot+"items/delete",
                    method: "POST",
                    data: {i:itemId}
                }).done(function(rd){
                    if(rd.status === 1){
                        //remove item from list, update items' SN, display success msg
                        $(itemRow).remove();

                        //update the SN
                        resetItemSN();

                        //display success message
                        changeFlashMsgContent('Item deleted', '', 'green', 1000);
                    }

                    else{

                    }
                }).fail(function(){
                    console.log('Req Failed');
                });
            }
        }
    });
});



/**
 * "lilt" = "load Items List Table"
 * @param {type} url
 * @returns {undefined}
 */
function lilt(url){
    var orderBy = $("#itemsListSortBy").val().split("-")[0];
    var orderFormat = $("#itemsListSortBy").val().split("-")[1];
    var limit = $("#itemsListPerPage").val();
    
    
    $.ajax({
        type:'get',
        url: url ? url : appRoot+"items/lilt/",
        data: {orderBy:orderBy, orderFormat:orderFormat, limit:limit},
        
        success: function(returnedData){
            hideFlashMsg();
            $("#itemsListTable").html(returnedData.itemsListTable);
        },
        
        error: function(){
            
        }
    });
    
    return false;
}


/**
 * "vittrhist" = "View item's transaction history"
 * @param {type} itemId
 * @returns {Boolean}
 */
function vittrhist(itemId){
    if(itemId){
        
    }
    
    return false;
}



function resetItemSN(){
    $(".itemSN").each(function(i){
        $(this).html(parseInt(i)+1);
    });
}