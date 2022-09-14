<div align="center">
<a href="https://nanite-systems.net/" target="blank">
  <img src="https://nanite-systems.net/images/ns.colored.svg" width="200" alt="Nest Logo" />
</a>

[![version](https://img.shields.io/github/lerna-json/v/nanite-systems/stream?color=blue)](https://github.com/nanite-systems/stream)
[![issues](https://img.shields.io/github/issues/nanite-systems/stream)](https://github.com/nanite-systems/stream/issues)
[![license](https://img.shields.io/github/license/nanite-systems/stream)](https://github.com/nanite-systems/stream/blob/main/LICENSE)

</div>

## Description

The Nanite Systems streaming services is a backwards-compatible ESS of PS2 Census ESS.
It implements numerous fixes and present a more reliable event stream.
The service is composed of multiple microservices:

- Collector: Collects all events from the Census ESS;
- Multiplexer: Combines and improves the quality of the event stream;
- Manifold: The endpoint of the ESS that exposes the event stream.

## Requirements

- NodeJS v16
- Docker
- Lerna

## Installation

```bash
# install dependencies and setup projects
$ lerna bootstrap

# configuration of each app
$ cp .env.example .env
```

## Running the service

For each individual service

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
