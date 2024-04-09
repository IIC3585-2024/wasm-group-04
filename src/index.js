import { factorize, cFactorize } from './factorization.js';

document.getElementById('factorizeButton').addEventListener('click', async function() {
    const number = document.getElementById('numberInput').value;
    const method = document.getElementById('methodSelect').value;
    let result = [];
    const startTime = new Date().getTime();

    if (number >= Number.MAX_SAFE_INTEGER) {
        document.getElementById('output').innerText = `Number is too large, please enter a number less than ${Number.MAX_SAFE_INTEGER}`;
        return;
    }

    switch (method) {
        case 'wasm':
            result = await cFactorize(number);
            break;
        case 'js':
            result = await factorize(number);
            break;
    }

    const endTime = new Date().getTime();
    const totalTime = (endTime - startTime); // convert to seconds

    document.getElementById('output').innerText = `The factors are: ${result}`;
    document.getElementById('time').innerText = `Total time: ${totalTime} milliseconds`;
});
