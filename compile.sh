#!/bin/bash

emcc src/factorization.c -o wasm/c_factorization.js -s EXPORTED_RUNTIME_METHODS=cwrap -s EXPORT_ES6=1 -s WASM_BIGINT -O3
