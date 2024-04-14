import Module from "../wasm/c_naiveFactorization.js";

export async function cNaiveFactorization(n) {
  const instance = await Module();
  const primeFactors = instance.cwrap('primeFactors', 'bigint', ['bigint']);
  const freeArray = instance.cwrap('freeArray', null, ['number']);

  const ptr = primeFactors(n);
  const result = [];
  let index = 0;
  let low, high, value;

  while (true) {
    // Asume que los valores de 32 bits están almacenados secuencialmente y no hay centinela intermedio
    low = instance.HEAPU32[(ptr / 4) + (2 * index)];
    high = instance.HEAPU32[(ptr / 4) + (2 * index + 1)];

    // Revisar si hemos alcanzado el centinela, suponiendo que el centinela es -1 en ambos (bajo y alto)
    if (low === 0xFFFFFFFF && high === 0xFFFFFFFF) break;

    // Combinar los dos valores de 32 bits en un valor de 64 bits:
    value = low + high * 4294967296;

    result.push(value);
    index++;
  }

  freeArray(ptr);
  return result;
}


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
