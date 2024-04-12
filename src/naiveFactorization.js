export async function naiveFactorization(n) {
    let factors = [];

    // Find all the factors of 2
    while (n % 2n === 0n) {
        factors.push(2);
        n = n / 2n; // Convert the division result to a BigInt
    }

    // Find all the odd factors
    for (let i = 3; i <= Math.sqrt(Number(n)); i += 2) {
        while (n % BigInt(i) === 0n) {
            factors.push(i);
            n = n / BigInt(i); // Convert the division result to a BigInt
        }
    }

    // If n is a prime number greater than 2, add it to the factors array
    if (n > 2n) {
        factors.push(Number(n));
    }

    return factors;
}

//idea and code base from https://www.geeksforgeeks.org/prime-factor/

