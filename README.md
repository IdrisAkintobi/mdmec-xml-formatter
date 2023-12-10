# CSV to Movielabs Media Entertainment Core (MEC) formatter

## Description

This is a simple Node.js application utilizing the [NestJS](https://nestjs.com/) framework. The application converts a predefined CSV file into the Movielabs Media Entertainment Core (MEC) specification v2.9 XML format, which is required by Amazon Prime Video for uploading video content. The application efficiently zips all the converted files and provides the resulting zip file for download.

## Requirements

-   [Node.js](https://nodejs.org/en/) v18.0.0 or higher
-   [NPM](https://www.npmjs.com/) v7.0.0 or higher

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test
```

## Code Structure

```bash
.
├── LICENSE
├── README.md
├── nest-cli.json
├── package-lock.json
├── package.json
├── src
│   ├── app.module.ts
│   ├── controllers
│   │   ├── app.controller.spec.ts
│   │   ├── app.controller.ts
│   │   └── file.controller.ts
│   ├── domain
│   │   ├── enum
│   │   │   └── domain.enums.ts
│   │   ├── mappers
│   │   │   └── mdmec.mapper.ts
│   │   └── types
│   │       ├── parsed.type.ts
│   │       └── schema.type.ts
│   ├── infrastructure
│   │   ├── file.processor.ts
│   │   └── xml.builder.ts
│   ├── main.ts
│   └── services
│       ├── app.service.ts
│       └── file.service.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json
```

## License

[MIT licensed](LICENSE)
