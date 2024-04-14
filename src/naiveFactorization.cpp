#include <emscripten.h>
#include <vector>
#include <cmath>

extern "C" {

EMSCRIPTEN_KEEPALIVE
unsigned long long* primeFactors(unsigned long long n) 
{ 
    std::vector<unsigned long long> factors;
    
    while (n % 2 == 0) 
    { 
        factors.push_back(2);
        n = n / 2; 
    } 

    for (unsigned long long i = 3; i <= std::sqrt(n); i = i + 2) 
    { 
        while (n % i == 0) 
        { 
            factors.push_back(i);
            n = n / i; 
        } 
    } 

    if (n > 2) 
        factors.push_back(n);
    
    factors.push_back(-1); // Add sentinel value at the end

    unsigned long long* arr = (unsigned long long*) malloc(factors.size() * sizeof(unsigned long long));
    std::copy(factors.begin(), factors.end(), arr);
    
    return arr;
} 

EMSCRIPTEN_KEEPALIVE
void freeArray(unsigned long long* arr) {
    free(arr);
}

} 