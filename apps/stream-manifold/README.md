<div align="center">
<a href="https://nanite-systems.net/" target="blank">
  <img src="https://nanite-systems.net/images/ns.colored.svg" width="200" alt="Nest Logo" />
</a>

[![version](https://img.shields.io/github/package-json/v/nanite-systems/stream-manifold?color=blue)](https://github.com/nanite-systems/stream-manifold)
[![issues](https://img.shields.io/github/issues/nanite-systems/stream-manifold)](https://github.com/nanite-systems/stream-manifold/issues)
[![dependecies](https://img.shields.io/librariesio/github/nanite-systems/stream-manifold)](https://libraries.io/github/nanite-systems/stream-manifold)
[![license](https://img.shields.io/github/license/nanite-systems/stream-manifold)](https://github.com/nanite-systems/stream-manifold/blob/main/LICENSE)

</div>

## Description

The manifold is a backwards-compatible websocket stream to Census, based on the up-stream collector and multiplexer
services.

## Requirements

- NodeJS v16
- [Stream devkit](https://github.com/nanite-systems/stream-devkit/)

## Installation

```bash
# configuration
$ cp .env.example .env

# install dependencies
$ yarn install
```

## Running the service

```bash
# development
$ yarn start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## License

All NS projects are [Apache-2.0 licensed](LICENSE).
