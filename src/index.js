import { factorize, cFactorize } from './factorization.js';
import { naiveFactorization } from './naiveFactorization.js';

let selectedMethod = 'wasm';
let racingChart;

// Function to handle method selection
const handleMethodSelection = () => {
    const optionButtons = document.querySelectorAll('.method-btn');
    
    optionButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove the 'selected' class from all buttons
            optionButtons.forEach(btn => {
                btn.classList.remove('selected');
            });

            // Add the 'selected' class to the clicked button
            button.classList.add('selected');

            selectedMethod = button.getAttribute('data-value');
            console.log(`Selected Method: ${selectedMethod}`);
        });
    });
}

const generateRandomNumbers = () => {
    const input = document.getElementById('numberInput');
  
    const interval = setInterval(() => {
        const randomNumber = Math.floor(Math.random() * 18446744073709551615); // Generates a random number between 0 and 18446744073709551615
        input.value = randomNumber;
    }, 50); // Interval of 50 milliseconds to generate new random numbers
    
    // Stop generating random numbers after 1 second
    setTimeout(() => {
        clearInterval(interval);
    }, 1000);
};

// Function to handle factorization
const handleFactorization = async () => {
    const button = document.getElementById('factorizeButton');
    button.disabled = true;
    button.innerHTML = '...';

    const max64Bit = (2n ** 64n) - 1n;

    const number = BigInt(document.getElementById('numberInput').value);
    let result = [];
    const startTime = new Date().getTime();

    if (number > max64Bit) {
        document.getElementById('output').innerText = `Number is too large, please enter a number less than ${max64Bit}`;
        return;
    }

    try {
        switch (selectedMethod) {
            case 'wasm':
                result = await cFactorize(number);
                break;
            case 'js':
                result = await factorize(number);
                break;
            case 'naive':
                result = await naiveFactorization(number);
                break;
            default:
                throw new Error('Invalid method selected');
        }
    } catch (error) {
        console.error('Error:', error.message);
        return;
    } finally {
        // Enable the button
        button.disabled = false;
        button.innerHTML = 'go';
    }

    const endTime = new Date().getTime();
    const totalTime = (endTime - startTime); // convert to milliseconds

    document.getElementById('output').innerHTML = '';

    // Add each factor as a new <p> tag
    result.forEach(factor => {
        const p = document.createElement('p');
        p.innerText = factor;
        p.classList.add('tag-number');
        document.getElementById('output').appendChild(p);
    });
    document.getElementById('time').innerText = `${totalTime} milliseconds`;
}

// Function to update the stats table
function updateStatsTable(jsTimes, wasmTimes, naiveTimes) {
    // Update the table with average, min, and max values
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    const jsMin = Math.min(...jsTimes);
    const jsMax = Math.max(...jsTimes);
    const jsAvg = jsTimes.reduce((a, b) => a + b, 0) / jsTimes.length;

    const wasmMin = Math.min(...wasmTimes);
    const wasmMax = Math.max(...wasmTimes);
    const wasmAvg = wasmTimes.reduce((a, b) => a + b, 0) / wasmTimes.length;

    const naiveMin = Math.min(...naiveTimes);
    const naiveMax = Math.max(...naiveTimes);
    const naiveAvg = naiveTimes.reduce((a, b) => a + b, 0) / naiveTimes.length;

    console.log(jsMin, jsMax, jsAvg, "js");
    console.log(wasmMin, wasmMax, wasmAvg, "wasm");
    console.log(naiveMin, naiveMax, naiveAvg, "naive");

    const minRow = document.createElement('tr');
    minRow.innerHTML = `
        <td>Min</td>
        <td>${jsMin.toFixed(3)} ms</td>
        <td>${wasmMin.toFixed(3)} ms</td>
        <td>${naiveMin.toFixed(3)} ms</td>
    `;
    tableBody.appendChild(minRow);

    const maxRow = document.createElement('tr');
    maxRow.innerHTML = `
        <td>Max</td>
        <td>${jsMax.toFixed(3)} ms</td>
        <td>${wasmMax.toFixed(3)} ms</td>
        <td>${naiveMax.toFixed(3)} ms</td>
    `;
    tableBody.appendChild(maxRow);

    const avgRow = document.createElement('tr');
    avgRow.innerHTML = `
        <td>Average</td>
        <td>${jsAvg.toFixed(3)} ms</td>
        <td>${wasmAvg.toFixed(3)} ms</td>
        <td>${naiveAvg.toFixed(3)} ms</td>
    `;
    tableBody.appendChild(avgRow);
}

// Function to update racing graph
function updateRacingGraph(iterations, jsTimes, wasmTimes, naiveTimes) {
    const ctx = document.getElementById('racingGraph').getContext('2d');

    if (racingChart) {
        racingChart.data.labels = Array.from({ length: iterations }, (_, i) => i + 1);
        racingChart.data.datasets[0].data = jsTimes;
        racingChart.data.datasets[1].data = wasmTimes;
        racingChart.data.datasets[2].data = naiveTimes;
        racingChart.update();  // Update the existing chart with new data
        return;
    }
  
    racingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: iterations }, (_, i) => i + 1),
            datasets: [
                {
                    label: 'js',
                    data: jsTimes,
                    borderColor: '#559fae',
                    backgroundColor: '#FAFCFD',
                    borderWidth: 3,
                    pointRadius: 0,
                    pointHoverRadius: 10,
                    fill: false
                },
                {
                    label: 'wasm',
                    data: wasmTimes,
                    borderColor: '#87a6db',
                    backgroundColor: '#FAFCFD',
                    borderWidth: 3,
                    pointRadius: 0,
                    pointHoverRadius: 10,
                    fill: false
                },
                {
                    label: 'naive',
                    data: naiveTimes,
                    borderColor: '#dd6a44',
                    backgroundColor: '#FAFCFD',
                    borderWidth: 3,
                    pointRadius: 0,
                    pointHoverRadius: 10,
                    fill: false
                }
            ]
            },
        options: {
            animation: {
                duration: 0, // Duration of the animation in milliseconds
            },
            scales: {
                x: {
                        grid: {
                        display: false
                    },
                    title: {
                        display: false,
                        text: 'Iteration',
                        font: {
                            size: 16,
                            weight: 'bold',
                            color: 'red'
                        }
                    }
                },
            y: {
                beginAtZero: true,
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 20,
                        color: 'red'
                    }
                },
                    title: {
                    display: true,
                    text: 'Milliseconds'
                }
            }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 20
                        }
                    }
                }
            }
        }
    });
}

// Function to handle method comparison
const handleMethodComparison = async () => {

    const updateInterval = 1;
    const iterations = document.getElementById('iterationsInput').value;
    const number = BigInt(document.getElementById('iterationsNumberInput').value);
    
    const result = await naiveFactorization(number);
        
    // Add each factor as a new <p> tag
    result.forEach(factor => {
        const p = document.createElement('p');
        p.innerText = factor;
        p.classList.add('tag-number');
    });

    const wasmTimes = [];
    const jsTimes = [];
    const naiveTimes = [];
    
    for (let i = 0; i < iterations; i++) {
        const startTime = new Date().getTime();
        await cFactorize(number);
        const endTime = new Date().getTime();
        wasmTimes.push(endTime - startTime);
    
        const startTime2 = new Date().getTime();
        await factorize(number);
        const endTime2 = new Date().getTime();
        jsTimes.push(endTime2 - startTime2);
    
        const startTime3 = new Date().getTime();
        await naiveFactorization(number);
        const endTime3 = new Date().getTime();
        naiveTimes.push(endTime3 - startTime3);

        if (i % updateInterval === 0) {
            updateRacingGraph(i, jsTimes, wasmTimes, naiveTimes);
            updateStatsTable(jsTimes, wasmTimes, naiveTimes);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    generateRandomNumbers();
    handleMethodSelection();
    document.getElementById('factorizeButton').addEventListener('click', handleFactorization);
    document.getElementById('compareButton').addEventListener('click', handleMethodComparison);
    document.getElementById('randomNumber').addEventListener('click', generateRandomNumbers);
});