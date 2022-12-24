<div align="center">
<a href="https://nanite-systems.net/" target="blank">
  <img src="https://nanite-systems.net/images/ns.colored.svg" width="200" alt="Nest Logo" />
</a>

[![issues](https://img.shields.io/github/issues/nanite-systems/stream)](https://github.com/nanite-systems/stream/issues)
[![license](https://img.shields.io/github/license/nanite-systems/stream)](https://github.com/nanite-systems/stream/blob/main/LICENSE)

[![stream-collector](https://img.shields.io/github/package-json/v/nanite-systems/stream?color=blue&filename=apps%2Fstream-collector%2Fpackage.json&label=collector)](https://github.com/nanite-systems/stream/tree/main/apps/stream-collector)
[![stream-multiplexer](https://img.shields.io/github/package-json/v/nanite-systems/stream?color=blue&filename=apps%2Fstream-multiplexer%2Fpackage.json&label=multiplexer)](https://github.com/nanite-systems/stream/tree/main/apps/stream-multiplexer)
[![stream-manifold](https://img.shields.io/github/package-json/v/nanite-systems/stream?color=blue&filename=apps%2Fstream-manifold%2Fpackage.json&label=manifold)](https://github.com/nanite-systems/stream/tree/main/apps/stream-manifold)
[![stream-health](https://img.shields.io/github/package-json/v/nanite-systems/stream?color=blue&filename=apps%2Fstream-health%2Fpackage.json&label=health)](https://github.com/nanite-systems/stream/tree/main/apps/stream-health)


</div>

## Description

The Nanite Systems streaming services is a backwards-compatible ESS of PS2 Census ESS.
It implements numerous fixes and present a more reliable event stream.
The service is composed of multiple microservices:

- Collector: Collects all events from the Census ESS;
- Multiplexer: Combines and improves the quality of the event stream;
- Manifold: The endpoint of the ESS that exposes the event stream;
- Health: Monitors health of the downstream and upstream ESS.

## Requirements

- NodeJS v18
- Pnpm
- Docker

## Installation

```bash
# install dependencies and setup projects
$ pnpm i

# configuration of each app
$ cp .env.example .env
```

## Running the service

For each individual service

```bash
# development, e.g.
$ pnpm stream-collector start

# watch mode
$  pnpm stream-collector start:dev
```

## License

All NS projects are [Apache-2.0 licensed](LICENSE).
