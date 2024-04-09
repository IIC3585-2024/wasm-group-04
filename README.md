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
