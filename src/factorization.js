import Module from "../wasm/c_factorization.js";

const abs = (n) => (n < 0n ? -n : n);

export async function cFactorize(n) {
  const module = await Module();
  const _fast_pollard_rho = module.cwrap("pollard_rho", "bigint", ["bigint"]);

  if (n === 1n) {
    return [1n];
  }

  const factors = [];
  while (n > 1n) {
    const factor = await _fast_pollard_rho(n);
    factors.push(factor);
    n /= factor;
  }
  return factors;
}

// Javascript program Miller-Rabin primality test

// Utility function to do
// modular exponentiation.
// It returns (x^y) % p
function power(x, y, p)
{

    // Initialize result
    let res = 1n;

    // Update x if it is more than or
    // equal to p
    x = x % p;
    while (y > 0n)
    {

        // If y is odd, multiply
        // x with result
        if (y & 1n)
            res = (res*x) % p;

        // y must be even now
        y = y>>1n; // y = y/2
        x = (x*x) % p;
    }
    return res;
}

// This function is called
// for all k trials. It returns
// false if n is composite and
// returns false if n is
// probably prime. d is an odd
// number such that d*2<sup>r</sup> = n-1
// for some r >= 1
function miillerTest(d, n)
{

    // Pick a random number in [2..n-2]
    // Corner cases make sure that n > 4
    let a = 2n + (BigInt(Math.floor(Math.random() * (Number(n) - 4))));


    // Compute a^d % n
    let x = power(a, d, n);

    if (x == 1n || x == n-1n)
        return true;

    // Keep squaring x while one
    // of the following doesn't
    // happen
    // (i) d does not reach n-1
    // (ii) (x^2) % n is not 1
    // (iii) (x^2) % n is not n-1
    while (d != n-1n)
    {
        x = (x * x) % n;
        d *= 2n;

        if (x == 1n)
            return false;
        if (x == n-1n)
              return true;
    }

    // Return composite
    return false;
}

// It returns false if n is
// composite and returns true if n
// is probably prime. k is an
// input parameter that determines
// accuracy level. Higher value of
// k indicates more accuracy.
function isPrime( n, k)
{

    // Corner cases
    if (n <= 1n || n == 4n) return false;
    if (n <= 3n) return true;

    // Find r such that n =
    // 2^d * r + 1 for some r >= 1
    let d = n - 1n;
    while (d % 2n == 0n)
        d /= 2n;

    // Iterate given number of 'k' times
    for (let i = 0n; i < k; i++)
        if (!miillerTest(d, n))
            return false;

    return true;
}

export async function factorize(n) {
  if (n === 1n) {
    return [1n];
  }

  const factors = [];
  while (n > 1n) {
    let factor = await pollardRho(n, 1n);

    // Execute primality test for the factor
    if (isPrime(factor, 4)) {
      factors.push(factor);
      n /= factor;
      continue;
    }

    console.log("factor", factor, "n", n);
    let retries = 0n;
    while (factor === n) {
      console.log("retries", retries);
      factor = await pollardRho(n, retries + 1n);
      retries++;
      if (retries > 100) {
        break;
      }
    }

    factors.push(factor);
    n /= factor;
  }
  return factors;
}

function pollardRho(n, c = 1n) {
  if (n === 1n) {
    return 1;
  }

  if (n % 2n === 0n) {
    return 2n;
  }

  let x = 2n;
  let y = x;
  let d = 1n;

  while (d === 1n) {
    x = g(x, n, c);
    y = g(g(y, n, c), n, c);
    d = gcd(abs(x - y), n);
  }

  return d;
}

function g(x, n, c = 1n) {
  return (x * x + c) % n;
}

function gcd(a, b) {
  if (a === 0n) {
    return b;
  }
  return gcd(b % a, a);
}
