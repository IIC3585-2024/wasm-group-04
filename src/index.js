import { factorize, cFactorize } from './factorization.js';
import { naiveFactorization, cNaiveFactorization } from './naiveFactorization.js';


document.getElementById('factorizeButton').addEventListener('click', async function() {
    const max64Bit = (2n ** 64n) - 1n;

    const number = BigInt(document.getElementById('numberInput').value);
    const method = document.getElementById('methodSelect').value;
    let result = [];
    const startTime = new Date().getTime();


    if (number > max64Bit) {
        document.getElementById('output').innerText = `Number is too large, please enter a number less than ${max64Bit}`;
        return;
    }

    switch (method) {
        case 'wasm':
            result = await cFactorize(number);
            break;
        case 'js':
            result = await factorize(number);
            break;
        case 'naive':
            result = await naiveFactorization(number);
            break;
        case 'cNaive':
            result = await cNaiveFactorization(number);
            break;
    }

    const endTime = new Date().getTime();
    const totalTime = (endTime - startTime); // convert to seconds

    document.getElementById('output').innerText = `The factors are: ${result}`;
    document.getElementById('time').innerText = `Total time: ${totalTime} milliseconds`;
});


document.getElementById('compareButton').addEventListener('click', async function() {
    const iterations = document.getElementById('iterationsInput').value;
    const updateInterval = document.getElementById('updateRateInput').value;
    const number = BigInt(document.getElementById('numberInput').value);
    const wasmTimes = [];
    const jsTimes = [];
    const naiveTimes = [];
    const naiveCTimes = [];
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

        const startTime4 = new Date().getTime();
        await cNaiveFactorization(number);
        const endTime4 = new Date().getTime();
        naiveCTimes.push(endTime4 - startTime4);

        if (i % updateInterval === 0) {
            const wasmAverage = wasmTimes.reduce((a, b) => a + b, 0) / wasmTimes.length;
            const jsAverage = jsTimes.reduce((a, b) => a + b, 0) / jsTimes.length;
            const naiveAverage = naiveTimes.reduce((a, b) => a + b, 0) / naiveTimes.length;
            const naiveCAverage = naiveCTimes.reduce((a, b) => a + b, 0) / naiveTimes.length;
    
            document.getElementById('js').innerText = `JS average time: ${jsAverage.toFixed(3)} milliseconds`;
            document.getElementById('wasm').innerText = `WASM average time: ${wasmAverage.toFixed(3)} milliseconds`;
            document.getElementById('naive').innerText = `Naive JS average time: ${naiveAverage.toFixed(3)} milliseconds`;
            document.getElementById('naiveC').innerText = `Naive C average time: ${naiveCAverage.toFixed(3)} milliseconds`;
        }
    }
    document.getElementById('loading').innerText = `Finished!`;
});
