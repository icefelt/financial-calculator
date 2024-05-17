# scripts.js
function calculate() {
    const paymentsPerYear = parseFloat(document.getElementById('paymentsPerYear').value);
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const periodicPayment = parseFloat(document.getElementById('periodicPayment').value);
    const annualInterestRate = parseFloat(document.getElementById('annualInterestRate').value);
    const numberOfPayments = parseFloat(document.getElementById('numberOfPayments').value);

    let missingField;
    let result;

    if (!loanAmount) {
        missingField = 'loanAmount';
        result = calculateLoanAmount(paymentsPerYear, periodicPayment, annualInterestRate, numberOfPayments);
    } else if (!periodicPayment) {
        missingField = 'periodicPayment';
        result = calculatePeriodicPayment(paymentsPerYear, loanAmount, annualInterestRate, numberOfPayments);
    } else if (!annualInterestRate) {
        missingField = 'annualInterestRate';
        result = calculateAnnualInterestRate(paymentsPerYear, loanAmount, periodicPayment, numberOfPayments);
    } else if (!numberOfPayments) {
        missingField = 'numberOfPayments';
        result = calculateNumberOfPayments(paymentsPerYear, loanAmount, periodicPayment, annualInterestRate);
    } else {
        document.getElementById('result').innerHTML = "Please leave one field empty to calculate.";
        return;
    }

    document.getElementById('result').innerHTML = `Calculated ${missingField}: ${result.toFixed(2)}`;
}

function calculateLoanAmount(paymentsPerYear, periodicPayment, annualInterestRate, numberOfPayments) {
    const r = (annualInterestRate / 100) / paymentsPerYear;
    return periodicPayment * (1 - Math.pow(1 + r, -numberOfPayments)) / r;
}

function calculatePeriodicPayment(paymentsPerYear, loanAmount, annualInterestRate, numberOfPayments) {
    const r = (annualInterestRate / 100) / paymentsPerYear;
    return loanAmount * r / (1 - Math.pow(1 + r, -numberOfPayments));
}

function calculateAnnualInterestRate(paymentsPerYear, loanAmount, periodicPayment, numberOfPayments) {
    const tolerance = 1e-6;
    let low = 0;
    let high = 100;
    let guess = (low + high) / 2;
    let calcPayment;

    while (high - low > tolerance) {
        calcPayment = loanAmount * (guess / 100 / paymentsPerYear) / (1 - Math.pow(1 + guess / 100 / paymentsPerYear, -numberOfPayments));
        if (calcPayment > periodicPayment) {
            high = guess;
        } else {
            low = guess;
        }
        guess = (low + high) / 2;
    }
    return guess;
}

function calculateNumberOfPayments(paymentsPerYear, loanAmount, periodicPayment, annualInterestRate) {
    const r = (annualInterestRate / 100) / paymentsPerYear;
    return Math.log(periodicPayment / (periodicPayment - loanAmount * r)) / Math.log(1 + r);
}
