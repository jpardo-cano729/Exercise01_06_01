/*
      Exercise 01_06_01

      Form Validation functions for snoot.html
      Author: Jonathan Pardo-Cano
      Date: 08.06.18

      Filename: Snoot.js
*/

"use strict";

var twentyNine = document.createDocumentFragment();
var thirty = document.createDocumentFragment();
var thirtyOne = document.createDocumentFragment();
var formValidity = true;

// Function to turn off select list defaults
function removeSelectDefaults() {
    var emptyBoxes = document.getElementsByTagName("select");
   for (var i = 0; i < emptyBoxes.length; i++) {
       emptyBoxes[i].selectedIndex = -1;
   }
}

// funtion to set up document fragments for days of month
function setUpDays () {
    // get the days option tags
    var dates = document.getElementById("delivDy").getElementsByTagName("option");
    twentyNine.appendChild(dates[28].cloneNode(true));
    thirty.appendChild(dates[28].cloneNode(true));
    thirty.appendChild(dates[29].cloneNode(true));
    thirtyOne.appendChild(dates[28].cloneNode(true));
    thirtyOne.appendChild(dates[29].cloneNode(true));
    thirtyOne.appendChild(dates[30].cloneNode(true));
}

// function to update the days select list
function updateDays () {
    var deliveryDay = document.getElementById("delivDy");
    var dates = deliveryDay.getElementsByTagName("option");
    var deliveryMonth = document.getElementById("delivMo");
    var deliveryYear = document.getElementById("delivYr");
    if (deliveryMonth.selectedIndex === -1) {
        return;
    }
    var selectedMonth = deliveryMonth.options[deliveryMonth.selectedIndex].value;
    while (dates[28]) {
        deliveryDay.removeChild(dates[28])
    }
    if (deliveryYear.selectedIndex === -1) {
        deliveryYear.selectedIndex = 0;
    }
    // If Feb and 2020 - leap year twentyNine 
    if (selectedMonth === "2" && deliveryYear.options[deliveryYear.selectedIndex].value === "2020") {
        deliveryDay.appendChild(twentyNine.cloneNode(true));
    } 
    // Else 30 day - thirty
    else if (selectedMonth === "4" || selectedMonth === "6" || selectedMonth === "9" || selectedMonth === "11") {
        deliveryDay.appendChild(thirty.cloneNode(true));
    }
    // else 31 month - thirtyOne
    else if (selectedMonth === "1" || selectedMonth === "3" || selectedMonth === "5" || selectedMonth === "7" || selectedMonth === "8" || selectedMonth === "10" || selectedMonth === "12") {
        deliveryDay.appendChild(thirtyOne.cloneNode(true));
    }
}

// funtction to see if custom message is checked
function autoCheckCustom () {
    var messageBox = document.getElementById("customText");
    if (messageBox.value !== "" && messageBox.value !== messageBox.placeholder) { //textarea actually has something in it
        document.getElementById("custom").checked = "checked";
    }
    else{ // textarea has nothing
        document.getElementById("custom").checked = "";
    }
}

//function to copy delivery to billing adress
function copyBillngAddress() {
    var billingInputElements = document.querySelectorAll("#billingAddress input");
    var deliveryInputElements = document.querySelectorAll("#deliveryAddress input");
    // if checkbox checked - copy all fields
    if (document.getElementById("sameAddr").checked) {
        for(var i = 0; i < billingInputElements.length; i++){
            deliveryInputElements[i+1].value = billingInputElements[i].value;
        }
        document.querySelector("#deliveryAddress select").value = document.querySelector("#billingAddress select").value;
    }
    //else erase all fields
    else {
        for(var i = 0; i < billingInputElements.length; i++){
            deliveryInputElements[i+1].value = "";
        }
        document.querySelector("#deliveryAddress select").selectedIndex = -1;
    }
    
}

// Functions to run on the page load
function setUpPage () {
    removeSelectDefaults();
    setUpDays();
    createEventListeners(); 
}

// function to validate address
function validateAddress (fieldsetId) {
    var inputElements = document.querySelectorAll("#" + fieldsetId + " input");
    var errorDiv = document.querySelectorAll("#" + fieldsetId + " .errorMessage")[0];
    var fieldsetValidity = true;
    var elementCount = inputElements.length;
    var currentElement = null;
    try{
        // loop required iput elements
        for (var i = 0; i < elementCount; i++){
            currentElement = inputElements[i];
            // test for blank
            if (currentElement.value === "") {
                currentElement.style.background = "rgb(255,233,233)";
                fieldsetValidity = false;
            }
            else{
                 currentElement.style.background = "white";
            }
        }
        // validate select listeners
        currentElement = document.querySelectorAll("#" + fieldsetId + " select")[0];
        // blank
        if (currentElement.selectedIndex === -1) {
            currentElement.style.border = "1px solid red";
            fieldsetValidity = false;
        }
        // valid
        else{
            currentElement.style.border = "white";
        }
        if (fieldsetValidity === false) {
            if(fieldsetId === "billingAddress") {
                throw "Please complete all billing address information";
                
            }
            else{
                throw "Please complete all Delivery address information";
            }
            
        }
        else{
                errorDiv.style.display = "none";
                errorDiv.innerHTML = "";
            }
    }
    catch(msg) {
        errorDiv.style.display = "block";
        errorDiv.innerHTML = msg;
        formValidity = false;
        }
}

//fucntion to validate delivery date
function validateDeliveryDate () {
    var selectElements = document.querySelectorAll("#deliveryDate"  + " select");
    var errorDiv = document.querySelectorAll("#deliveryDate"  + " .errorMessage")[0];
    var fieldsetValidity = true;
    var elementCount = selectElements.length;
    var currentElement = null;
    try{
        // loop required select elements
        for (var i = 0; i < elementCount; i++){
            currentElement = selectElements[i];
            // test for blank
            if (currentElement.selectedIndex === -1) {
                currentElement.style.border = "1px solid red";
                fieldsetValidity = false;
            }
            else{
                 currentElement.style.border = "";
            }
        }
        if (fieldsetValidity === false) {
            throw "Please specify the delivery date";
        }
        else{
            errorDiv.style.display = "none";
            errorDiv.innerHTML = "";
            }
        }
    catch(msg) {
        errorDiv.style.display = "block";
        errorDiv.innerHTML = msg;
        formValidity = false;
        }
}

// function to validate entire form
function validateForm(evt) {
    if (evt.preventDefault) {
        evt.preventDefault();
    }
    else {
        evt.returnValue = false;
    }
    validateAddress("billingAddress");
    validateAddress("deliveryAddress");
    validateDeliveryDate();
    
    if (formValidity === true) {
        document.getElementById("errorText").innerHTML = "";
        document.getElementById("errorText").style.display = "none";
        document.getElementsByTagName("form")[0].submit();
    }
    else {
        document.getElementById("errorText").innerHTML = "Please fix the indicated problems and then resubmit your order.";
        document.getElementById("errorText").style.display = "block";
        scroll(0,0);
    }
}


// function to create our event listeners
function createEventListeners () {
     var deliveryMonth = document.getElementById("delivMo");
        if(deliveryMonth.addEventListener) {
            deliveryMonth.addEventListener("change",updateDays, false);
        }else if (deliveryMonth.attachEvent) {
            deliveryMonth.attachEvent("change", updateDays);
        }
    var deliveryYear = document.getElementById("delivYr");
        if(deliveryYear.addEventListener) {
            deliveryYear.addEventListener("change",updateDays, false);
        }else if (deliveryYear.attachEvent) {
            deliveryYear.attachEvent("onChange", updateDays);
        }
    var messageBox = document.getElementById("customText");
        if(messageBox.addEventListener) {
            messageBox.addEventListener("change", autoCheckCustom, false);
        }else if (messageBox.attachEvent) {
            messageBox.attachEvent("onChange", autoCheckCustom);
        }
     var same = document.getElementById("sameAddr");
        if(same.addEventListener) {
            same.addEventListener("change", copyBillngAddress, false);
        }else if (same.attachEvent) {
            same.attachEvent("onChange", copyBillngAddress);
        }   
    var form = document.getElementsByTagName("form")[0];
        if(form.addEventListener) {
            form.addEventListener("submit", validateForm, false);
        }else if (form.attachEvent) {
            form.attachEvent("onsubmit", validateForm);
        }
}
//Enable load event handlers
if(window.addEventListener) {
    window.addEventListener("load",setUpPage, false);
}else if (window.attachEvent) {
    window.attachEvent("onload", setUpPage);
}