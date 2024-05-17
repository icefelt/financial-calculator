function calculate() {
    const paymentsPerYear = parseFloat(document.getElementById('paymentsPerYear').value) || NaN;
    const loanAmount = parseFloat(document.getElementById('loanAmount').value) || NaN;
    const periodicPayment = parseFloat(document.getElementById('periodicPayment').value) || NaN;
    const annualInterestRate = parseFloat(document.getElementById('annualInterestRate').value) || NaN;
    const numberOfPayments = parseFloat(document.getElementById('numberOfPayments').value) || NaN;

    let missingField;
    let result;

    if (isNaN(loanAmount)) {
        missingField = 'loanAmount';
        result = calculateLoanAmount(paymentsPerYear, periodicPayment, annualInterestRate, numberOfPayments);
    } else if (isNaN(periodicPayment)) {
        missingField = 'periodicPayment';
        result = calculatePeriodicPayment(paymentsPerYear, loanAmount, annualInterestRate, numberOfPayments);
    } else if (isNaN(annualInterestRate)) {
        missingField = 'annualInterestRate';
        result = calculateAnnualInterestRate(paymentsPerYear, loanAmount, periodicPayment, numberOfPayments);
    } else if (isNaN(numberOfPayments)) {
        missingField = 'numberOfPayments';
        result = calculateNumberOfPayments(paymentsPerYear, loanAmount, periodicPayment, annualInterestRate);
    } else {
        document.getElementById('result').innerHTML = "Please leave one field empty to calculate.";
        return;
    }

    if (isNaN(result)) {
        document.getElementById('result').innerHTML = "Calculation error. Please check your inputs.";
    } else {
        document.getElementById('result').innerHTML = `Calculated ${missingField}: ${result.toFixed(2)}`;
        document.getElementById(missingField).value = result.toFixed(2);
    }
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
