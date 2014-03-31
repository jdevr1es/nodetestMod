// Companylist data array for filling in info box
var companyListData = [];

// DOM Ready =============================================================
$(document).ready(function () {

    // Populate the company table on initial page load
    populateTable();

    // Companyname link click
    $('#companyList table tbody').on('click', 'td a.linkshowcompany', showCompanyInfo);

    // Add Company button click
    $('#btnAddCompany').on('click', addCompany);

    // Delete Company link click
    $('#companyList table tbody').on('click', 'td a.linkdeletecompany', deleteCompany);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON('/companylist', function (data) {

        // Stick our company data array into a companylist variable in the global object
        companyListData = data;


        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function () {
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowcompany" rel="' + this.companyname + '" title="Show Details">' + this.companyname + '</td>';
            tableContent += '<td>' + this.product + '</td>';
            tableContent += '<td><a href="#" class="linkdeletecompany" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });
        console.log(tableContent);
        // Inject the whole content string into our existing HTML table
        $('#companyList table tbody').html(tableContent);
    });
};

// Show Company Info
function showCompanyInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve companyname from link rel attribute
    var thisCompanyName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = companyListData.map(function (arrayItem) { return arrayItem.companyname; }).indexOf(thisCompanyName);

    // Get our User Object
    var thisCompanyObject = companyListData[arrayPosition];

    //Populate Info Box
    $('#companyInfoName').text(thisCompanyObject.companyname);
    $('#companyInfoYear').text(thisCompanyObject.foundingyear);
    $('#companyInfoLocation').text(thisCompanyObject.location);
    $('#companyInfoProduct').text(thisCompanyObject.product);
    $('#companyContactName').text(thisCompanyObject.fullname);
    $('#companyEmail').text(thisCompanyObject.email);
};

// Add Company
function addCompany(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addCompany input').each(function (index, val) {
        if ($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if (errorCount === 0) {

        // If it is, compile all user info into one object
        var newCompany = {
            'username': $('#addCompany fieldset input#inputUserName').val(),
            'email': $('#addCompany fieldset input#inputUserEmail').val(),
            'fullname': $('#addCompany fieldset input#inputUserFullname').val(),
            'companyname': $('#addCompany fieldset input#inputCompanyName').val(),
            'location': $('#addCompany fieldset input#inputCompanyLocation').val(),
            'foundingyear': $('#addCompany fieldset input#inputCompanyYear').val(),
            'product': $('#addCompany fieldset input#inputCompanyProduct').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newCompany,
            url: '/addcompany',
            dataType: 'JSON'
        }).done(function (response) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addCompany fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete Company
function deleteCompany(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this company?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/deletecompany/' + $(this).attr('rel')
        }).done(function (response) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};