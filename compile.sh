#!/bin/bash

emcc src/factorization.c -o wasm/c_factorization.js -s EXPORTED_FUNCTIONS=_pollard_rho,_is_prime -s EXPORTED_RUNTIME_METHODS=cwrap -s EXPORT_ES6=1 -s WASM_BIGINT -O3

emcc -O3 -s WASM_BIGINT -s EXPORTED_FUNCTIONS="['_primeFactors', '_freeArray']" -s MODULARIZE=1 -s EXPORT_ES6=1 -s "EXPORTED_RUNTIME_METHODS=['cwrap', 'HEAPU64']" naiveFactorization.cpp -o c_naiveFactorization.js