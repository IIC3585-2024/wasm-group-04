import Module from '../wasm/c_factorization.js';

const abs = (n) => (n < 0n) ? -n : n;

export async function cFactorize(n) {
    const module = await Module();
    const _fast_pollard_rho = module.cwrap('pollard_rho', 'bigint', ['bigint']);

    if (n === 1n) {
        return [1n]
    }

    const factors = []
    while (n > 1n) {
        const factor = await _fast_pollard_rho(n);
        factors.push(factor);
        n /= factor;
    }
    return factors;
}

export async function factorize(n) {
    if (n === 1n) {
        return [1n]
    }

    const factors = []
    while (n > 1n) {
        const factor = await pollardRho(n);
        factors.push(factor);
        n /= factor;
    }
    return factors;
}

function pollardRho(n) {
    if (n === 1n) {
        return 1
    }

    if (n % 2n === 0n) {
        return 2n
    }

    let x = 2n
    let y = x
    let d = 1n

    while (d === 1n) {
        x = g(x, n)
        y = g(g(y, n), n)
        d = gcd(abs(x - y), n)
    }

    return d
}

function g(x, n) {
    return (x * x + 1n) % n;
}

function gcd(a, b) {
    if (a === 0n) {
        return b
    }
    return gcd(b % a, a)
}