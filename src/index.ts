import * as bodyParser from 'body-parser';
import * as express from 'express';
import 'reflect-metadata';
import { Container } from 'inversify';
import {
    interfaces,
    InversifyExpressServer,
    TYPE,
} from 'inversify-express-utils';
import * as swagger from 'swagger-express-ts';
import { CarsController } from './cars/controllers/cars.controller';
import { CarController } from './cars/controllers/car.controller';
import { CarsService } from './cars/services/cars.service';

const NodeCouchdb = require('node-couchdb');


const container = new Container();

container
    .bind<CarsService>(CarsService.name)
    .to(CarsService)
    .inSingletonScope();
container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(CarsController)
    .whenTargetNamed(CarsController.name);
container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(CarController)
    .inSingletonScope()
    .whenTargetNamed(CarController.name);

// create server
const server = new InversifyExpressServer(container);

server.setConfig((app: any) => {
    app.use('/api-docs/swagger', express.static('swagger'));
    app.use(
        '/api-docs/swagger/assets',
        express.static('node_modules/swagger-ui-dist')
    );
    app.use(bodyParser.json());
    app.use(
        swagger.express({
            definition: {
                externalDocs: {
                    url: 'My url',
                },
                info: {
                    title: 'My api',
                    version: '1.0',
                },
                responses: {
                    500: {},
                },
            },
        })
    );
});

server.setErrorConfig((app: any) => {
    app.use(
        (
            err: Error,
            request: express.Request,
            response: express.Response,
            next: express.NextFunction
        ) => {
            console.error(err.stack);
            response.status(500).send('Something broke!');
        }
    );
});

const app = server.build();
app.listen(3000);
console.info('Server is listening on port : 3000');

export const couch = new NodeCouchdb({
  auth: {
    user: "admin",
    password: "cbd",
  },
});

// Borrar base de datos
// couch.dropDatabase("cbd").then(
//   () => {
//     console.log("gola");
//   }
// );

// couch.createDatabase("cbd").then(
//   () => {
//     console.log("gola");
//   }
// );