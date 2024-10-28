function showTab(tab) {
    document.getElementById("sip-calculator").style.display = tab === 'sip' ? 'flex' : 'none';
    document.getElementById("lumpsum-calculator").style.display = tab === 'lumpsum' ? 'flex' : 'none';

    document.getElementById("sip-tab").classList.toggle("active-tab", tab === 'sip');
    document.getElementById("lumpsum-tab").classList.toggle("active-tab", tab === 'lumpsum');
}

function updateValue(id, value) {
    document.getElementById(id).value = value;
}

function updateSlider(sliderId, value) {
    document.getElementById(sliderId).value = value;
}

function formatCustomNumber(number) {
    // Round the number to the nearest integer
    const roundedNumber = Math.round(number);
    
    // Convert the number to a string
    const numString = roundedNumber.toString();

    // Use a regex to format the number according to Indian number system
    let lastThreeDigits = numString.slice(-3);
    let otherDigits = numString.slice(0, -3);
    
    // Add commas to the other digits
    if (otherDigits) {
        lastThreeDigits = ',' + lastThreeDigits;
    }
    const formattedInteger = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThreeDigits;

    return formattedInteger;
}

function calculateSIP() {
    const monthlyInvestment = parseFloat(document.getElementById("monthlyInvestment").value);
    const annualRate = parseFloat(document.getElementById("annualRate").value) / 100;
    const investmentPeriod = parseFloat(document.getElementById("investmentPeriod").value);
    const months = investmentPeriod * 12;
    const monthlyRate = annualRate / 12;

    const totalInvestment = monthlyInvestment * months;
    const totalValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const expectedReturns = totalValue - totalInvestment;

    document.getElementById("sipTotalInvestment").textContent = formatCustomNumber(totalInvestment);
    document.getElementById("sipExpectedReturns").textContent = formatCustomNumber(expectedReturns);
    document.getElementById("sipTotalValue").textContent = formatCustomNumber(totalValue);

    displayChart("sipChart", totalInvestment, expectedReturns);
}

function calculateLumpsum() {
    const lumpsumAmount = parseFloat(document.getElementById("lumpsumAmount").value);
    const annualRate = parseFloat(document.getElementById("lumpsumRate").value) / 100;
    const investmentPeriod = parseFloat(document.getElementById("lumpsumPeriod").value);

    const totalValue = lumpsumAmount * Math.pow(1 + annualRate, investmentPeriod);
    const expectedReturns = totalValue - lumpsumAmount;
    const totalInvestment = lumpsumAmount;

    document.getElementById("lumpsumTotalInvestment").textContent = formatCustomNumber(totalInvestment);
    document.getElementById("lumpsumExpectedReturns").textContent = formatCustomNumber(expectedReturns);
    document.getElementById("lumpsumTotalValue").textContent = formatCustomNumber(totalValue);

    displayChart("lumpsumChart", totalInvestment, expectedReturns);
}

function displayChart(chartId, totalInvestment, expectedReturns) {
    const ctx = document.getElementById(chartId).getContext('2d');

    if (window[chartId] instanceof Chart) {
        window[chartId].destroy();
    }

    window[chartId] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Invested Amount', 'Est. Returns'],
            datasets: [{
                data: [totalInvestment, expectedReturns],
                backgroundColor: ['#d1c4e9', '#7e57c2'],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `₹${tooltipItem.raw.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}
