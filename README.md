# WebAssembly Integer Factorization

This repository includes a wasm implementation of integer factorization using the Pollard's rho algorithm. The code is written in C and compiled to wasm using emscripten.

It also provides a javascript implementation of the same algorithm for comparison.

## Usage

### Just run a HTTP server in the root directory for example using

```bash
python3 -m http.server
```

### Compile WASM

The wasm binaries for C code is already compiled. To recompile just run in terminal

```bash
./compile.sh
```

## Roadmap
- [x] Implement Pollard's rho algorithm in C
- [x] Compile C code to wasm
- [x] Implement Pollard's rho algorithm in JS
- [x] Implement a simple web interface
- [x] Support for large numbers (64 bits bigint in JS equivalent to C long long unsigned int)
- [ ] Implement a more complex web interface
- [ ] Implement more algorithms
- [ ] Compare different optimizations (Current is just O3)
- [ ] Make a complete implementation of factorize function in C ¿Return array of integers or share a string buffer? need more investigation.
