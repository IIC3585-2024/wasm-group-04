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
      const randomNumber = Math.random() * 18446744073709551615; // Generates a random number between 0 and 18446744073709551615
      input.value = randomNumber;
    }, 50); // Interval of 50 milliseconds to generate new random numbers
    
    // Stop generating random numbers after 1 second
    setTimeout(() => {
      clearInterval(interval);
    }, 1000);
};

// Function to handle factorization
const handleFactorization = async () => {
    const max64Bit = (2n ** 64n) - 1n;

    const number = BigInt(document.getElementById('numberInput').value);
    let result = [];
    const startTime = new Date().getTime();

    if (number > max64Bit) {
        document.getElementById('output').innerText = `Number is too large, please enter a number less than ${max64Bit}`;
        return;
    }


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
            console.error('Invalid method selected');
            return;
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
    // document.getElementById('output').innerText = `The factors are: ${result}`;
    document.getElementById('time').innerText = `${totalTime} milliseconds`;
}

// Function that updates the progress bar
function updateBar(barId, percent) {
    const bar = document.getElementById(barId);
    bar.style.width = `${percent}%`;
  }

// Function to hide the progress bar
function hideProgressBar() {
    const progressBar = document.getElementById('progressBar');
    progressBar.style.display = 'none';
}

// Function to show the progress bar
function showProgressBar() {
    const progressBar = document.getElementById('progressBar');
    progressBar.style.display = 'block';
}

// Function to update the comparsion bars
function updateRacingGraph(iterations, jsTimes, wasmTimes, naiveTimes) {
    const ctx = document.getElementById('racingGraph').getContext('2d');
  
    if (racingChart) {
      racingChart.destroy();  // Destroy the previous chart if exists
    }
  
    racingChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: iterations }, (_, i) => i + 1),
        datasets: [
            {
              label: 'js',
              data: jsTimes,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderWidth: 2,
              pointRadius: 3,
              pointHoverRadius: 5,
              fill: false
            },
            {
              label: 'wasm',
              data: wasmTimes,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderWidth: 2,
              pointRadius: 3,
              pointHoverRadius: 5,
              fill: false
            },
            {
              label: 'naive',
              data: naiveTimes,
              borderColor: 'rgba(255, 205, 86, 1)',
              backgroundColor: 'rgba(255, 205, 86, 0.2)',
              borderWidth: 2,
              pointRadius: 3,
              pointHoverRadius: 5,
              fill: false
            }
          ]
        },
      options: {
        scales: {
            x: {
                grid: {
                  display: false
                },
                title: {
                  display: true,
                  text: 'Iteration',
                  font: {
                    size: 16,
                    weight: 'bold'
                  }
                }
              },
          y: {
            beginAtZero: true,
            grid: {
                display: false
            },
            title: {
              display: true,
              text: 'Time (ms)'
            }
          }
        }
      }
    });

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

// Function to handle method comparison
const handleMethodComparison = async () => {
    updateBar('progressBar', 0);
    showProgressBar();

    const updateInterval = 1;
    const iterations = document.getElementById('iterationsInput').value;
    // const updateInterval = document.getElementById('updateRateInput').value;
    const number = BigInt(document.getElementById('iterationsNumberInput').value);
    const wasmTimes = [];
    const jsTimes = [];
    const naiveTimes = [];
    // document.getElementById('loading').innerText = `Loading... ${0} / ${iterations}`;
    
    for (let i = 0; i < iterations; i++) {
        // document.getElementById('loading').innerText = `Loading... ${i} / ${iterations}`;
        updateBar('progressBar', (i / iterations) * 100);
        

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
            const wasmAverage = wasmTimes.reduce((a, b) => a + b, 0) / wasmTimes.length;
            const jsAverage = jsTimes.reduce((a, b) => a + b, 0) / jsTimes.length;
            const naiveAverage = naiveTimes.reduce((a, b) => a + b, 0) / naiveTimes.length;
            updateRacingGraph(i, jsTimes, wasmTimes, naiveTimes);
    
            // document.getElementById('js').innerText = `JS average time: ${jsAverage.toFixed(3)} milliseconds`;
            // document.getElementById('wasm').innerText = `WASM average time: ${wasmAverage.toFixed(3)} milliseconds`;
            // document.getElementById('naive').innerText = `Naive JS average time: ${naiveAverage.toFixed(3)} milliseconds`;
        }
    }

    hideProgressBar();
}

document.addEventListener('DOMContentLoaded', () => {
    generateRandomNumbers();
    handleMethodSelection();
    document.getElementById('factorizeButton').addEventListener('click', handleFactorization);
    document.getElementById('compareButton').addEventListener('click', handleMethodComparison);
    document.getElementById('randomNumber').addEventListener('click', generateRandomNumbers);
});