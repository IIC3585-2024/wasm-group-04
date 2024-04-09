import Module from '../wasm/c_factorization.js';

export async function cFactorize(n) {
    const module = await Module();
    const _fast_pollard_rho = module.cwrap('pollard_rho', 'number', ['number']);

    if (n === 1) {
        return [1]
    }

    const factors = []
    while (n > 1) {
        const factor = await _fast_pollard_rho(n);
        factors.push(factor);
        n /= factor;
    }
    return factors;
}

export async function factorize(n) {
    if (n === 1) {
        return [1]
    }

    const factors = []
    while (n > 1) {
        const factor = await pollardRho(n);
        factors.push(factor);
        n /= factor;
    }
    return factors;
}

function pollardRho(n) {
    if (n === 1) {
        return 1
    }

    if (n % 2 === 0) {
        return 2
    }

    let x = 2
    let y = x
    let d = 1

    while (d === 1) {
        x = g(x, n)
        y = g(g(y, n), n)
        d = gcd(Math.abs(x - y), n)
    }

    return d
}

function g(x, n) {
    return (x * x + 1) % n;
}

function gcd(a, b) {
    if (a === 0) {
        return b
    }
    return gcd(b % a, a)
}