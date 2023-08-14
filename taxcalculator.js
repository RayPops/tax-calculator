// Constants
const CONSTANTS = {
    MAX_PENSION_CONTRIBUTION: 20000,
    PERSONAL_RELIEF: 2400,
    MAX_INSURANCE_RELIEF: 5000,
    MAX_NSSF_CONTRIBUTION: 1080,
};

// Helper function to calculate NSSF contribution
function calculateNSSF(salary) {
    if (salary <= 6000) {
        return salary * 0.06;
    } else if (salary <= 18000) {
        return 360 + (salary - 6000) * 0.06;
    } else {
        return CONSTANTS.MAX_NSSF_CONTRIBUTION;
    }
}

// Helper function to calculate NHIF contribution
function calculateNHIF(salary) {
    let brackets = [6000, 8000, 12000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 60000, 70000, 80000, 90000, 100000];
    let contributions = [150, 300, 400, 500, 600, 750, 850, 900, 950, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700];

    for(let i = 0; i < brackets.length; i++){
        if(salary < brackets[i]) return contributions[i];
    }

    return contributions[contributions.length-1];
}

// Helper function to calculate Housing Levy
function calculateHousingLevy(salary) {
    return salary * 0.015;
}

// Helper function to calculate taxable amount
function calculateTaxable(chargeablePay) {
    //if chargeable is less than 24000, tax is 10% of chargeable
    if (chargeablePay <= 24000) {
        return chargeablePay * 0.10;
    }
    //if chargeable is between 24001 and 32333, tax is 10% of 24000 + 25% of the amount above 24000
    else if (chargeablePay > 24000 && chargeablePay <= 32333) {
        return (24000 * 0.10) + ((chargeablePay - 24000) * 0.25);
    }
    //if chargeable is between 32334 and 500,000, tax is 10% of 24000 + 25% of 8333 + 30% of the amount above 32333
    else if (chargeablePay > 32333 && chargeablePay <= 500000) {
        return ((24000 * 0.10) + (8333 * 0.25)) + ((chargeablePay - 32333) * 0.3);
    }
        //if chargeable is between 500,001 and 800,000, tax is 10% of 24000 + 25% of 8333 + 30% of 467,667 + 33% of the amount above 500,000
    else if (chargeablePay > 500000 && chargeablePay <= 800000) {
        return ((24000 * 0.10) + (8333 * 0.25) + (467667 * 0.3)) + ((chargeablePay - 467667) * 0.325);
    }
    //if chargeable is above 800,000, tax is 10% of 24000 + 25% of 8333 + 30% of 467,667 + 33% of 300,000 + 35% of the amount above 800,000
    else {
        return ((24000 * 0.10) + (8333 * 0.25) + (467667 * 0.3) + (300000 * 0.325)) + ((chargeablePay - 800000) * 0.35);
    }
}

// Function to calculate the PAYE (Pay As You Earn) tax
// Function to calculate the PAYE (Pay As You Earn) tax
function calculatePAYE(salary, otherTaxAllowableDeductions, pension, otherInsuranceContributions) {
    let nssfContribution = calculateNSSF(salary);
    let nhifContribution = calculateNHIF(salary);
    let housingLevy = calculateHousingLevy(salary);

    let totalInsuranceContribution = Math.min(nhifContribution + otherInsuranceContributions, CONSTANTS.MAX_INSURANCE_RELIEF);
    let insuranceRelief = totalInsuranceContribution * 0.15;
    let taxablePay = salary - Math.min(nssfContribution + otherTaxAllowableDeductions + pension, CONSTANTS.MAX_PENSION_CONTRIBUTION);
    let totalPAYE = calculateTaxable(taxablePay);
    totalPAYE -= (insuranceRelief + CONSTANTS.PERSONAL_RELIEF);
    let totalDeductions = Math.max(totalPAYE, 0) + nssfContribution + nhifContribution + otherInsuranceContributions + housingLevy;

    return {
        grossPay: salary.toFixed(2),
        payePayable: totalPAYE > 0 ? totalPAYE.toFixed(2) : 0.00,
        nssfContribution: nssfContribution,
        housingLevy: housingLevy,
        nhifContribution: nhifContribution,
        otherInsuranceContributions: otherInsuranceContributions.toFixed(2),
        totalDeductions: totalDeductions.toFixed(2),
        netPay: (salary - totalDeductions).toFixed(2),
        taxablePay: taxablePay.toFixed(2),
        totalDeductionsForPaye: (otherTaxAllowableDeductions + nssfContribution + otherInsuranceContributions).toFixed(2)
    };
}


// JavaScript code
document.getElementById('calculate').addEventListener('click', function() {
    let salary = parseFloat(document.getElementById('salary').value) || 0;
    let deductions = parseFloat(document.getElementById('deductions').value) || 0;
    let pension = parseFloat(document.getElementById('pension').value) || 0;
    let insurance = parseFloat(document.getElementById('insurance').value) || 0;

    // Check for negative values
    if(salary < 0 || deductions < 0 || pension < 0 || insurance < 0) {
        alert("Please enter positive values.");
        return;
    }

    let results = calculatePAYE(salary, deductions, pension, insurance);

    document.getElementById('result-gross-pay').textContent = results.grossPay;
    document.getElementById('result-paye-payable').textContent = results.payePayable;
    document.getElementById('result-nssf').textContent = results.nssfContribution.toFixed(2);
    document.getElementById('result-nhif').textContent = results.nhifContribution.toFixed(2);
    document.getElementById('result-housing-levy').textContent = results.housingLevy.toFixed(2);
    document.getElementById('result-insurance').textContent = results.otherInsuranceContributions;
    document.getElementById('result-total-deductions').textContent = results.totalDeductions;
    document.getElementById('result-net-pay').textContent = results.netPay;

    document.getElementById('paye-gross-pay').textContent = results.grossPay;
    document.getElementById('paye-allowable-deductions').textContent = results.totalDeductionsForPaye;
    document.getElementById('paye-taxable-pay').textContent = results.taxablePay;
});