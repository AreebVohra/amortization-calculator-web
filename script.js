"use strict";

getValues();
setDate();

function getValues() {
    setDate();

    //button click gets values from inputs
    var balance = parseFloat(document.getElementById("loan-amount").value);
    var interestRate = parseFloat(document.getElementById("interest-rate").value / 100);
    var terms = parseInt(document.getElementById("loan-length").value * 12);
    var additionalMonthlyPayment = parseInt(document.getElementById("additional-monthly-payment").value);


    //set the div string
    var div = document.getElementById("Result");

    //in case of a re-calc, clear out the div!
    div.innerHTML = "";

    //validate inputs - display error if invalid, otherwise, display table
    var balVal = validateInputs(balance);
    var intrVal = validateInputs(interestRate);

    if (balVal && intrVal) {
        //Returns div string if inputs are valid
        div.innerHTML += amort(balance, interestRate, terms, additionalMonthlyPayment);
    }
    else {
        //returns error if inputs are invalid
        div.innerHTML += "Please Check your inputs and retry - invalid values.";
    }
}


/**
 * Amort function:
 * Calculates the necessary elements of the loan using the supplied user input
 * and then displays each months updated amortization schedule on the page
*/
function amort(balance, interestRate, terms, additionalMonthlyPayment) {
    //Calculate the per month interest rate
    var monthlyRate = interestRate / 12;
    //Calculate the payment
    var payment = balance * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -terms)));
    var additionalPayment = payment + additionalMonthlyPayment;
    var initialPayment = payment;
    var totalPrincipal = balance;
    var totalSavings = 0;
    var totalInterest = 0;
    var totalPayments = 0;

    document.getElementById("standard-payment").innerHTML = payment.toFixed(2);
    document.getElementById("payment-with-additional-principal").innerHTML = additionalPayment.toFixed(2);


    //add header row for table to return string
    var result = "<table>";

    result += "<tr align='center'>";
    result += "<th>Months</th>";
    result += "<th>Date</th>";
    result += "<th>Payment</th>";
    result += "<th>Interest</th>";
    result += "<th>Principal</th>";
    result += "<th>Extra Principal</th>";
    result += "<th>Ending Balance</th>";
    result += "</tr>";
    result += "<tr align='center'>";
    result += "<td>0</td>";
    result += "<td colspan='5'></td>";
    result += "<td>$" + balance + "</td>";
    result += "</tr>";

    /**
     * Loop that calculates the monthly Loan amortization amounts then adds 
     * them to the return string 
     */

    var month = (document.getElementById("start-date").value).slice(0, 2);
    var year = (document.getElementById("start-date").value).slice(5, 7);

    for (var count = 0; count < terms; ++count) {

        var actualTerm;

        //in-loop interest amount holder
        if (balance < payment && count != 0) {
            payment = balance;
            result += `<tr align='center'>`;
            result += `<td>${count + 1}</td>`;

            actualTerm = terms - (count + 1);

            result += "<td>" + month + "/" + year + "</td>";
            result += `<td>${(balance + balance * monthlyRate).toFixed(2)}</td>`;
            result += `<td>${(balance * monthlyRate).toFixed(2)}</td>`;
            result += `<td>${balance.toFixed(2)}</td>`;
            result += `<td>$0</td>`;
            result += `<td>$0</td>`;
            result += `</tr>`;
            break;
        } else if ((balance - monthlyPrincipal - additionalMonthlyPayment < 0) && count != 0) {
            result += `<tr align='center'>`;
            result += `<td>${count + 1}</td>`;

            actualTerm = terms - count;

            result += "<td>" + month + "/" + year + "</td>";
            result += `<td>${payment.toFixed(2)}</td>`;
            result += `<td>${(balance * monthlyRate).toFixed(2)}</td>`;
            result += `<td>${(payment - (balance * monthlyRate)).toFixed(2)}</td>`;
            result += `<td>${(balance - (payment - (balance * monthlyRate))).toFixed(2)}</td>`;
            result += `<td>$0</td>`;
            result += `</tr>`;
            break;
        }

        var interest = 0;

        //in-loop monthly principal amount holder
        var monthlyPrincipal = 0;
        //start a new table row on each loop iteration
        result += "<tr align='center'>";

        //display the month number in col 1 using the loop count variable
        result += "<td>" + (count + 1) + "</td>";

        if (month == 13) {
            month = 1;
            year++;
        }
        result += "<td>" + month + "/" + year + "</td>";
        month++;
        //display the payment per month
        result += "<td>$" + payment.toFixed(2) + "</td>";

        //calc the in-loop interest amount and display
        interest = balance * monthlyRate;
        totalInterest += interest;
        result += "<td>$" + interest.toFixed(2) + "</td>";

        //calc the in-loop monthly principal and display
        monthlyPrincipal = payment - interest;
        result += "<td>$" + monthlyPrincipal.toFixed(2) + "</td>";

        //==========================================
        result += "<td>$" + additionalMonthlyPayment + "</td>";

        //code for displaying in loop balance
        balance = balance - (monthlyPrincipal + additionalMonthlyPayment);
        result += "<td> $" + balance.toFixed(2) + "</td>";

        //end the table row on each iteration of the loop	
        result += "</tr>";
    }

    totalPayments = totalInterest + totalPrincipal;
    var v1 = (terms * initialPayment) - totalPrincipal;
    var v2 = totalPayments - totalPrincipal;
    totalSavings = v1 - v2;


    document.getElementById("total-savings").innerHTML = Math.round(totalSavings);

    var x = actualTerm, months = x % 12, years = (x - months) / 12;

    var payoffSchedule = years + " years and " + months + " months.";
    var statement = "Paying an additional $" + additionalMonthlyPayment + " a month will save you $" + Math.round(totalSavings) + " with an earlier payoff schedule of " + payoffSchedule;
    document.getElementById("statement").innerHTML = statement;
    document.getElementById("payoff-schedule").innerHTML = payoffSchedule + "earlier.";


    //Final piece added to return string before returning it - closes the table
    result += "</table>";

    //returns the concatenated string to the page
    return result;

}

function setAddStartDate() {
    document.getElementById("additional-payment-start-date").value = document.getElementById("start-date").value;
}

function setDate() {
    var date = new Date();
    let month = date.getMonth() + 2;
    let year = date.getFullYear();

    if (month == 13) {
        month = 1;
        year++;
    }
    var currentDate = month + "/" + year;
    document.getElementById("start-date").value = currentDate;
    document.getElementById("additional-payment-start-date").value = currentDate;
}

function validateInputs(value) {
    //some code here to validate inputs
    if ((value == null) || (value == "")) {
        return false;
    }
    else {
        return true;
    }
}