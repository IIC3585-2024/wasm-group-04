#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <emscripten.h>

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

unsigned long long g(unsigned long long x, unsigned long long n)
{
    return (x * x + 1) % n;
}

unsigned long long EMSCRIPTEN_KEEPALIVE pollard_rho(unsigned long long n)
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
        x = g(x, n);
        y = g(g(y, n), n);
        d = gcd(llabs((long long)(x - y)), n);
    }
    return d;
}

unsigned long long *factorize(unsigned long long n, int *size)
{
    if (n == 1)
    {
        *size = 1;
        unsigned long long *factors = (unsigned long long *)malloc(sizeof(unsigned long long));
        factors[0] = 1;
        return factors;
    }

    unsigned long long *factors = (unsigned long long *)malloc(sizeof(unsigned long long));
    int count = 0;
    while (n > 1)
    {
        unsigned long long factor = pollard_rho(n);
        factors[count++] = factor;
        n /= factor;
        factors = (unsigned long long *)realloc(factors, (count + 1) * sizeof(unsigned long long));
    }
    *size = count;
    return factors;
}
