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
import { ArtistsController } from './assets/controllers/artists.controller';
import { ArtistController } from './assets/controllers/artist.controller';
import { ArtistsService } from './assets/services/artists.service';

import { TracksController } from './assets/controllers/tracks.controller';
import { TrackController } from './assets/controllers/track.controller';
import { TracksService } from './assets/services/tracks.service';
import { loadData } from './sample-data';
import { ArrayIterator, List, ListOfRecursiveArraysOrValues } from 'lodash';
import { createSandbox } from 'sinon';
import { ArtistModel } from './assets/models/artist.model';

const NodeCouchdb = require('node-couchdb');

export const couch = new NodeCouchdb({
    auth: {
        user: "admin",
        password: "cbd",
    },
});

const container = new Container();

container
    .bind<ArtistsService>(ArtistsService.name)
    .to(ArtistsService)
    .inSingletonScope();
container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(ArtistController)
    .whenTargetNamed(ArtistController.name);
container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(ArtistsController)
    .inSingletonScope()
    .whenTargetNamed(ArtistsController.name);

container
    .bind<TracksService>(TracksService.name)
    .to(TracksService)
    .inSingletonScope();
container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(TrackController)
    .whenTargetNamed(TrackController.name);
container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(TracksController)
    .inSingletonScope()
    .whenTargetNamed(TracksController.name);

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

async function getArtistId(name: string) {
    const mangoQuery = {
        selector: {
            type: 'Artist',
            name: name
        }
    };
    const parameters = {};
    try {
        const artists = await couch.mango('cbd', mangoQuery, parameters).then((data: any) => {
            const res = JSON.parse(JSON.stringify(data));
            console.log(res.data.docs[0]._id)
            if (res) {
                return res.data.docs[0]._id;
            } else {
                return 'No artist data';
            }
        }
        );
    } catch {
        console.log('An error has occurred retrieving data')
    }
}


couch.dropDatabase('cbd').then(
    () => {
        console.log("Database dropped");
        couch.createDatabase("cbd").then(
            async () => {
                console.log("Database created");
                await couch.insert('cbd', {
                    name: 'Rihanna',
                    description: 'Singer, businesswoman, fashion designer, actress, diplomat, writer, dancer and philanthropist.',
                    genres: '[\"Pop\",\"R&B\", \"Reggae\", \"Techno\"]',
                    type: 'Artist'
                });

                await couch.insert('cbd', {
                    name: 'La Oreja de Van Gogh',
                    description: 'Musical group of pop-rock genre from San Sebastián, País Vasco, Spain.',
                    genres: '[\"Pop\",\"Rock\"]',
                    type: 'Artist'
                });

                await couch.insert('cbd', {
                    name: 'Estopa',
                    description: 'Spanish duo of Catalan rumba formed by the brothers David and José Manuel Muñoz.',
                    genres: '[\"Pop rock\", \"Rumba catalana\"]',
                    type: 'Artist'
                });

                await couch.insert('cbd', {
                    name: 'Eminem',
                    description: 'American rapper, singer, record producer and actor.',
                    genres: '[\"Rap\", \"Hip Hop\", \"Trap\"]',
                    type: 'Artist'
                });

                // await couch.insert("cbd", {
                //     title: 'Man down',
                //     url: 'https://www.youtube.com/watch?v=sEhy-RXkNo0',
                //     artist: await getArtistId('Rihanna'),
                //     type: 'Track'
                // });
            }
        );
    }
);


