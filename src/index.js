import { factorize, cFactorize } from './factorization.js';
import { naiveFactorization } from './naiveFactorization.js';

let selectedMethod = '';

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
      const randomNumber = Math.floor(Math.random() * 18446744073709551615); // Generates a random number between 0 and 999
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
    document.getElementById('time').innerText = `Total time: ${totalTime} milliseconds`;
}

// Function to handle method comparison
const handleMethodComparison = async () => {
    const iterations = document.getElementById('iterationsInput').value;
    const updateInterval = document.getElementById('updateRateInput').value;
    const number = BigInt(document.getElementById('numberInput').value);
    const wasmTimes = [];
    const jsTimes = [];
    const naiveTimes = [];
    document.getElementById('loading').innerText = `Loading... ${0} / ${iterations}`;
    
    for (let i = 0; i < iterations; i++) {
        document.getElementById('loading').innerText = `Loading... ${i} / ${iterations}`;

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
    
            document.getElementById('js').innerText = `JS average time: ${jsAverage.toFixed(3)} milliseconds`;
            document.getElementById('wasm').innerText = `WASM average time: ${wasmAverage.toFixed(3)} milliseconds`;
            document.getElementById('naive').innerText = `Naive JS average time: ${naiveAverage.toFixed(3)} milliseconds`;
        }
    }
    document.getElementById('loading').innerText = `Finished!`;
}

document.addEventListener('DOMContentLoaded', () => {
    generateRandomNumbers();
    handleMethodSelection();
    document.getElementById('factorizeButton').addEventListener('click', handleFactorization);
    document.getElementById('compareButton').addEventListener('click', handleMethodComparison);
});