'use strict';

document.addEventListener('DOMContentLoaded', function() {
    // Function to check the user's login status
    function checkLogin() {
        // Implement your login check logic here
    }
    
    // Function to check document visibility
    function checkDocumentVisibility(callback) {
        if (document.visibilityState === 'visible') {
            callback();
        }
    }
    
    // Function to get earnings for a specific year
    function getEarnings(year) {
        var yearToFetch = year || '';
        
        $.ajax({
            type: 'GET',
            url: appRoot + "dashboard/earningsGraph/" + yearToFetch,
            dataType: "html"
        }).done(function(data) {
            var response = jQuery.parseJSON(data);
            
            // Handle response data and update earnings graph
        }).fail(function() {
            console.log('Failed to fetch earnings data');
        });
    }
    
    // Function to load payment method pie charts
    function loadPaymentMethodChart(year) {
        var yearToGet = year ? year : "";
        
        $.ajax({
            type: 'GET',
            url: appRoot + "dashboard/paymentmethodchart/" + yearToGet,
            dataType: "html",
            success: function(data) {
                var response = jQuery.parseJSON(data);
                
                // Handle response data and update payment method chart
            },
            error: function() {
                console.log('Failed to load payment method data');
            }
        });
    }
    
    // Event listener for the "year" dropdown change
    $("#earningAndExpenseYear").change(function() {
        var year = $(this).val();
        
        if (year) {
            $("#yearAccountLoading").html("<i class='" + spinnerClass + "'></i> Loading...");
            
            // Get earnings for the selected year
            getEarnings(year);
            
            // Load payment method chart for the selected year
            loadPaymentMethodChart(year);
        }
    });
    
    // Function to initialize the dashboard on document ready
    function initDashboard() {
        checkDocumentVisibility(checkLogin);
        getEarnings(); // Get earnings for the current year on page load
        loadPaymentMethodChart(); // Load payment method pie charts
    }
    
    // Initialize the dashboard when the document is ready
    $(document).ready(function() {
        initDashboard();
    });
});
