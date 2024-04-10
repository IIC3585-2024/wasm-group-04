#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <stdbool.h>

// extracted from https://www.geeksforgeeks.org/primality-test-set-3-miller-rabin/
// C++ program Miller-Rabin primality test

// Utility function to do modular exponentiation.
// It returns (x^y) % p
unsigned long long power(unsigned long long x, unsigned long long y, unsigned long long p)
{
    unsigned long long res = 1;      // Initialize result
    x = x % p;  // Update x if it is more than or
                // equal to p
    while (y > 0)
    {
        // If y is odd, multiply x with result
        if (y & 1)
            res = (res*x) % p;

        // y must be even now
        y = y>>1; // y = y/2
        x = (x*x) % p;
    }
    return res;
}

// This function is called for all k trials. It returns
// false if n is composite and returns true if n is
// probably prime.
// d is an odd number such that  d*2 = n-1
// for some r >= 1
bool miller_test(unsigned long long d, unsigned long long n)
{
    // Pick a random number in [2..n-2]
    // Corner cases make sure that n > 4
    unsigned long long a = 2 + rand() % (n - 4);

    // Compute a^d % n
    unsigned long long x = power(a, d, n);

    if (x == 1  || x == n-1)
       return true;

    // Keep squaring x while one of the following doesn't
    // happen
    // (i)   d does not reach n-1
    // (ii)  (x^2) % n is not 1
    // (iii) (x^2) % n is not n-1
    while (d != n-1)
    {
        x = (x * x) % n;
        d *= 2;

        if (x == 1)      return false;
        if (x == n-1)    return true;
    }

    // Return composite
    return false;
}

// It returns false if n is composite and returns true if n
// is probably prime.  k is an input parameter that determines
// accuracy level. Higher value of k indicates more accuracy.
bool is_prime(unsigned long long n, unsigned long long k)
{
    // Corner cases
    if (n <= 1 || n == 4)  return false;
    if (n <= 3) return true;

    // Find r such that n = 2^d * r + 1 for some r >= 1
    unsigned long long d = n - 1;
    while (d % 2 == 0)
        d /= 2;

    // Iterate given number of 'k' times
    for (int i = 0; i < k; i++)
         if (!miller_test(d, n))
              return false;

    return true;
}

// Driver program
int main()
{
    int k = 4;  // Number of iterations

    printf("All primes smaller than 100: \n");

    for (unsigned long long n = 1; n < 10000; n++)
       if (is_prime(n, k))
          printf("%llu ", n);

    printf("\n");
    return 0;
}

unsigned long long gcd(unsigned long long a, unsigned long long b)
{
    unsigned long long temp;
    while (b != 0)
    {
        temp = a % b;
        a = b;
        b = temp;
    }
    return a;
}

unsigned long long g(unsigned long long x, unsigned long long n, unsigned long long c)
{
    return (x * x + c) % n;
}

unsigned long long pollard_rho(unsigned long long n, unsigned long long c)
{
    if (n == 1)
    {
        return 1;
    }

    if (n % 2 == 0)
    {
        return 2;
    }

    unsigned long long x = 2, y = 2, d = 1;

    while (d == 1)
    {
        x = g(x, n, c);
        y = g(g(y, n, c), n, c);
        d = gcd(llabs((long long)(x - y)), n);
    }
    return d;
}
