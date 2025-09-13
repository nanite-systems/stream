# stream-collector

## 5.1.1

### Patch Changes

- [#52](https://github.com/nanite-systems/stream/pull/52) [`9060a18`](https://github.com/nanite-systems/stream/commit/9060a18c6f78a6507d3252f7c12892f038bbcc5c) Thanks [@microwavekonijn](https://github.com/microwavekonijn)! - Fixed managed connection entering infinite cycle

- [#48](https://github.com/nanite-systems/stream/pull/48) [`2f78302`](https://github.com/nanite-systems/stream/commit/2f783028329fcc4c9f3758f1a03e0cb825497839) Thanks [@depfu](https://github.com/apps/depfu)! - Update all pnpm dependencies (2025-04-20)

- Updated dependencies [[`2f78302`](https://github.com/nanite-systems/stream/commit/2f783028329fcc4c9f3758f1a03e0cb825497839)]:
  - @nss/ess-concerns@1.0.3
  - @nss/rabbitmq@1.0.2
  - @nss/utils@0.1.2

## 5.1.0

### Minor Changes

- [#42](https://github.com/nanite-systems/stream/pull/42) [`5f826e4`](https://github.com/nanite-systems/stream/commit/5f826e43355044f0186e1a799528530fa3675501) Thanks [@microwavekonijn](https://github.com/microwavekonijn)! - Deprecated @nestjs/config

## 5.0.2

### Patch Changes

- [#35](https://github.com/nanite-systems/stream/pull/35) [`4240ef8fff9d6bb5921e78ee68d173c5d71b245c`](https://github.com/nanite-systems/stream/commit/4240ef8fff9d6bb5921e78ee68d173c5d71b245c) Thanks [@microwavekonijn](https://github.com/microwavekonijn)! - Bumped dependencies

- Updated dependencies [[`4240ef8fff9d6bb5921e78ee68d173c5d71b245c`](https://github.com/nanite-systems/stream/commit/4240ef8fff9d6bb5921e78ee68d173c5d71b245c)]:
  - @nss/ess-concerns@1.0.2
  - @nss/rabbitmq@1.0.1
  - @nss/utils@0.1.1

## 5.0.1

### Patch Changes

- [#30](https://github.com/nanite-systems/stream/pull/30) [`19db576`](https://github.com/nanite-systems/stream/commit/19db576f78711018b776e2ea09315d4c2d81e2e8) Thanks [@microwavekonijn](https://github.com/microwavekonijn)! - Added missing label prometheus

## 5.0.0

### Major Changes

- [#26](https://github.com/nanite-systems/stream/pull/26) [`b4fb65d`](https://github.com/nanite-systems/stream/commit/b4fb65d086de8591f68ea2928adf41618463bfef) Thanks [@microwavekonijn](https://github.com/microwavekonijn)! - improved metrics, updated dependencies, and numerous fixes

### Patch Changes

- Updated dependencies [[`b4fb65d`](https://github.com/nanite-systems/stream/commit/b4fb65d086de8591f68ea2928adf41618463bfef)]:
  - @nss/ess-concerns@1.0.1

## 4.0.1

### Patch Changes

- [#23](https://github.com/nanite-systems/stream/pull/23) [`081473b`](https://github.com/nanite-systems/stream/commit/081473bd45d2334464ffe065fe41652d1c1bf4f8) Thanks [@microwavekonijn](https://github.com/microwavekonijn)! - fix connection ids in metrics of messages being off by 1

## 4.0.0

### Major Changes

- [#21](https://github.com/nanite-systems/stream/pull/21) [`6113726`](https://github.com/nanite-systems/stream/commit/6113726b96994eacc36ea5d7fe586233715a9e5b) Thanks [@microwavekonijn](https://github.com/microwavekonijn)! - Allow use of multiple service ids for replication

### Minor Changes

- [#21](https://github.com/nanite-systems/stream/pull/21) [`6113726`](https://github.com/nanite-systems/stream/commit/6113726b96994eacc36ea5d7fe586233715a9e5b) Thanks [@microwavekonijn](https://github.com/microwavekonijn)! - Modified kind label to type as it was more appropriate

- [#21](https://github.com/nanite-systems/stream/pull/21) [`6113726`](https://github.com/nanite-systems/stream/commit/6113726b96994eacc36ea5d7fe586233715a9e5b) Thanks [@microwavekonijn](https://github.com/microwavekonijn)! - Fix connection state counter not recording connection id

- [#21](https://github.com/nanite-systems/stream/pull/21) [`6113726`](https://github.com/nanite-systems/stream/commit/6113726b96994eacc36ea5d7fe586233715a9e5b) Thanks [@microwavekonijn](https://github.com/microwavekonijn)! - Connection metrics start at 1 instead of 0

### Patch Changes

- [#21](https://github.com/nanite-systems/stream/pull/21) [`6113726`](https://github.com/nanite-systems/stream/commit/6113726b96994eacc36ea5d7fe586233715a9e5b) Thanks [@microwavekonijn](https://github.com/microwavekonijn)! - Fix connection logging to expose metadata and label properly

## 3.0.3

### Patch Changes

- [#17](https://github.com/nanite-systems/stream/pull/17) [`90cf083`](https://github.com/nanite-systems/stream/commit/90cf083b8db60cbd4b973a19ef95be9e821e7864) Thanks [@microwavekonijn](https://github.com/microwavekonijn)! - Chore/prep release

## 3.0.2

### Patch Changes

- [`74f3ff5`](https://github.com/nanite-systems/stream/commit/74f3ff5ad6b8148284f2677590e8e5e47eda6f02) Thanks [@microwavekonijn](https://github.com/microwavekonijn)! - fix generation tags for apps

## 3.0.1

### Patch Changes

- [#14](https://github.com/nanite-systems/stream/pull/14) [`773149c`](https://github.com/nanite-systems/stream/commit/773149c18836b5e5abcc62b070aab3f637d0cde2) Thanks [@microwavekonijn](https://github.com/microwavekonijn)! - fix CI

## 3.0.0

### Major Changes

- [#9](https://github.com/nanite-systems/stream/pull/9) [`f1188d2`](https://github.com/nanite-systems/stream/commit/f1188d26101dff7781b090d8ba3e397913c14caa) Thanks [@microwavekonijn](https://github.com/microwavekonijn)! - Improved logging and added metrics to the NSS

### Patch Changes

- Updated dependencies [[`f1188d2`](https://github.com/nanite-systems/stream/commit/f1188d26101dff7781b090d8ba3e397913c14caa)]:
  - @nss/ess-concerns@1.0.0
  - @nss/rabbitmq@1.0.0
  - @nss/utils@0.1.0

## 2.0.2

### Patch Changes

- [`d623e05`](https://github.com/nanite-systems/stream/commit/d623e0523fe578de3b7231f5b7378a572c931dfd) Thanks [@microwavekonijn](https://github.com/microwavekonijn)! - messed up the filter again

- [`5706b5c`](https://github.com/nanite-systems/stream/commit/5706b5caf17a32a4bd5d2bbf2dba2a9b35867a38) Thanks [@microwavekonijn](https://github.com/microwavekonijn)! - Final fix message filtering

- [`1b61ff7`](https://github.com/nanite-systems/stream/commit/1b61ff70ca50eb42042f08acabc6aed3738a1f26) Thanks [@microwavekonijn](https://github.com/microwavekonijn)! - Improvement to rabbitmq and nss service

- Updated dependencies [[`1b61ff7`](https://github.com/nanite-systems/stream/commit/1b61ff70ca50eb42042f08acabc6aed3738a1f26)]:
  - @nss/rabbitmq@0.0.2

## 2.0.1

### Patch Changes

- [`e1846a0`](https://github.com/nanite-systems/stream/commit/e1846a0834c4389659b86798fe1cf412e27566ed) Thanks [@microwavekonijn](https://github.com/microwavekonijn)! - fixed multiplexer and dedup filter usage

## 2.0.0

### Major Changes

- [`420570d`](https://github.com/nanite-systems/stream/commit/420570ddf1023238e539c70e49da3614ac9f2031) Thanks [@microwavekonijn](https://github.com/microwavekonijn)! - Added cycling connections and depration of multiplexer
