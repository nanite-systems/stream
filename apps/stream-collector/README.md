<div align="center">
<a href="https://nanite-systems.net/" target="blank">
  <img src="https://nanite-systems.net/images/ns.colored.svg" width="200" alt="Nest Logo" />
</a>

[![version](https://img.shields.io/github/package-json/v/nanite-systems/stream-collector?color=blue)](https://github.com/nanite-systems/stream-collector)
[![issues](https://img.shields.io/github/issues/nanite-systems/stream-collector)](https://github.com/nanite-systems/stream-collector/issues)
[![dependecies](https://img.shields.io/librariesio/github/nanite-systems/stream-collector)](https://libraries.io/github/nanite-systems/stream-collector)
[![license](https://img.shields.io/github/license/nanite-systems/stream-collector)](https://github.com/nanite-systems/stream-collector/blob/main/LICENSE)

</div>

## Description

Collector service that pushes messages from the Census stream API to a RabbitMQ exchange. Used as part of the NS stream
API.

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

## Docker release

This service is released to the GitHub container registery under the same name as the repository.

```bash
$ docker run --name ps2-collector -e SERVICE_ID=example -e PS2_ENVIRONMENT=ps2 -d ghcr.io/nanite-systems/stream-collector
```

## Configuration

| Variable                                | Required | Description                                                                                              |
| --------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------- |
| SERVICE_ID                              | yes      | Census service id, http://census.daybreakgames.com/#service-id                                           |
| PS2_ENVIRONMENT                         | yes      | The environment to listen to                                                                             |
| STREAM_ENDPOINT                         | no       | The url of the websocket endpoint                                                                        |
| RESUBSCRIBE_INTERVAL                    | no       | Interval in seconds when to resend the subscription, default none                                        |
| RECONNECT_INTERVAL                      | no       | Interval in seconds when to reconnect to the stream, default none                                        |
| RECONNECT_DELAY                         | no       | Delay in seconds when creating a new connection, default `0`                                             |
| RECONNECT_DELAY_FAULT                   | no       | Delay in seconds when creating a new connection after fault, default `5`                                 |
| SUBSCRIBE_WORLDS                        | no       | Comma separated list of worlds to subscribe to, default `['all']`                                        |
| SUBSCRIBE_EVENTS                        | no       | Comma separated list of events to subscribe to, default `['all']`                                        |
| SUBSCRIBE_LOGICAL_AND                   | no       | Boolean value that sets the `logicalAndCharactersWithWorlds` value in the subscription, default `false`  |
|                                         |
| COLLECTOR_ID                            | no       | Id to to identitfy messages send to the RabbitMQ exchange from this collector, default random uuid       |
| RABBITMQ_URL                            | yes      | Url to connect to the RabbitMQ instance                                                                  |
| RABBITMQ_COLLECTOR_EXCHANGE_NAME        | yes      | Name of the RabbitMQ exchange to publish to                                                              |
| RABBITMQ_COLLECTOR_EXCHANGE_TYPE        | no       | Type of exchange to assert in RabbitMQ, default `fanout`                                                 |
| RABBITMQ_COLLECTOR_EXCHANGE_DURABLE     | no       | Sets whether the exchange should be durable, default `false`                                             |
| RABBITMQ_COLLECTOR_EXCHANGE_AUTO_DELETE | no       | Sets whether the exchange should auto delete itself when there is no use, `false`                        |
|                                         |
| LOG_LEVELS                              | no       | Comma separated list of log levels, default `['log', 'warn', 'error']`(others are `debug`, and `verbose` |

## License

All NS projects are [Apache-2.0 licensed](LICENSE).
