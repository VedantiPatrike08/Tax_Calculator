document.getElementById("taxForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const incomeFields = [
        document.getElementById("grossIncome"),
        document.getElementById("extraIncome"),
        document.getElementById("deductions")
    ];

    let isValidIncome = true;
    let isEmpty = false;

    incomeFields.forEach(function(inputField) {
        if (!inputField.value.trim()) {
            isEmpty = true;
            displayErrorIcon(inputField, 'All Input fields are mandatory');
            inputField.classList.add('error'); // Add error class to input field
        } else if (!isValidNumber(inputField.value.trim())) {
            isValidIncome = false;
            displayErrorIcon(inputField, 'Please enter numbers only');
            inputField.classList.add('error'); // Add error class to input field
        } else {
            removeErrorIcon(inputField);
            inputField.classList.remove('error'); // Remove error class from input field
        }
    });

    if (isValidIncome && !isEmpty) {
        const overallIncome = calculateTax();
        showModal(overallIncome);
        document.getElementById("taxForm").reset();
    }
});

function isValidNumber(input) {
    return !isNaN(input) && isFinite(input);
}

function displayErrorIcon(inputField, errorMessage) {
    removeErrorIcon(inputField);
    const errorIcon = document.createElement('span');
    errorIcon.innerHTML = '&excl;'; // Exclamation mark
    errorIcon.className = 'error-icon error'; // Add 'error' class
    errorIcon.title = errorMessage;
    inputField.parentNode.insertBefore(errorIcon, inputField.nextSibling);
}

function removeErrorIcon(inputField) {
    const errorIcon = inputField.parentNode.querySelector('.error-icon');
    if (errorIcon) {
        errorIcon.parentNode.removeChild(errorIcon);
    }
}

function calculateTax() {
    const grossIncome = parseFloat(document.getElementById("grossIncome").value);
    const extraIncome = parseFloat(document.getElementById("extraIncome").value);
    const ageGroup = document.getElementById("age").value;
    const deductions = parseFloat(document.getElementById("deductions").value) || 0;

    let taxRate;
    switch (ageGroup) {
        case "<40":
            taxRate = 0.3;
            break;
        case ">=40&<60":
            taxRate = 0.4;
            break;
        case ">=60":
            taxRate = 0.1;
            break;
        default:
            taxRate = 0;
    }

    const taxableIncome = (grossIncome + extraIncome - deductions) - 8;
    const taxAmount = taxableIncome > 0 ? taxableIncome * taxRate : 0;
    const overallIncome = grossIncome + extraIncome - deductions - taxAmount;

    return overallIncome;
}

function showModal(overallIncome) {
    const modal = document.getElementById("modal");
    const resultElement = document.getElementById("result");
    resultElement.textContent = ` ${overallIncome} Lakhs`;
    modal.style.display = "block";

    const closeButton = document.querySelector(".close");
    closeButton.addEventListener("click", function() {
        modal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}
