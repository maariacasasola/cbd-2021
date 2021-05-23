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
import { ArtistTracksController } from './assets/controllers/artist-tracks.controller';
import { GenresService } from './assets/services/genres.service';
import { GenreController } from './assets/controllers/genre.controller';
import { GenresController } from './assets/controllers/genres.controller';
import { GenreArtistsController } from './assets/controllers/genre-artists.controller';

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

container
    .bind<GenresService>(GenresService.name)
    .to(GenresService)
    .inSingletonScope();
container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(GenreController)
    .whenTargetNamed(GenreController.name);
container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(GenresController)
    .inSingletonScope()
    .whenTargetNamed(GenresController.name);

container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(ArtistTracksController)
    .whenTargetNamed(ArtistTracksController.name);

container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(GenreArtistsController)
    .whenTargetNamed(GenreArtistsController.name);

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
                info: {
                    title: 'API REST con base de datos de CouchBD',
                    version: '1.0',
                    description: 'Grupo 46\n\nCasasola Calzadilla, María\n Coleto Alcudia, Emilia'
                },
                responses: {
                    500: { description: 'Internal server error' },
                    404: { description: 'Not found' },
                    400: { description: 'Parameters fail' },
                    200: { description: 'Successful' }
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
            if (res) {
                return res.data.docs[0]._id;
            } else {
                return 'No artist data';
            }
        });
        return artists;
    } catch {
        console.log('An error has occurred retrieving data')
    }
}

async function getGenreId(name: string) {
    const mangoQuery = {
        selector: {
            type: 'Genre',
            name: name
        }
    };
    const parameters = {};
    try {
        const genres = await couch.mango('cbd', mangoQuery, parameters).then((data: any) => {
            const res = JSON.parse(JSON.stringify(data));
            if (res) {
                return res.data.docs[0]._id;
            } else {
                return 'No genre data';
            }
        });
        return [genres,];
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
                    name: 'Pop',
                    description: 'Originated in its modern form during the mid-1950s in the United States and the United Kingdom',
                    type: 'Genre'
                });
                await couch.insert('cbd', {
                    name: 'Rumba catalana',
                    description: 'Developed in Barcelona`s Romani community beginning in the 1950s and 1960s. Its rhythms are derived from the Andalusian flamenco rumba',
                    type: 'Genre'
                });
                await couch.insert('cbd', {
                    name: 'Hip Hop',
                    description: 'Developed in the United States by inner-city African Americans and Latino Americans in the Bronx borough of New York City in the 1970s.',
                    type: 'Genre'
                });
                await couch.insert('cbd', {
                    name: 'Rihanna',
                    description: 'Singer, businesswoman, fashion designer, actress, diplomat, writer, dancer and philanthropist.',
                    genres: await getGenreId('Pop'),
                    type: 'Artist'
                });
                await couch.insert('cbd', {
                    name: 'La Oreja de Van Gogh',
                    description: 'Musical group of pop-rock genre from San Sebastián, País Vasco, Spain.',
                    genres: await getGenreId('Pop'),
                    type: 'Artist'
                });
                await couch.insert('cbd', {
                    name: 'Estopa',
                    description: 'Spanish duo of Catalan rumba formed by the brothers David and José Manuel Muñoz.',
                    genres: await getGenreId('Rumba catalana'),
                    type: 'Artist'
                });
                await couch.insert('cbd', {
                    name: 'Eminem',
                    description: 'American rapper, singer, record producer and actor.',
                    genres: await getGenreId('Hip Hop'),
                    type: 'Artist'
                });
                await couch.insert("cbd", {
                    title: 'Man down',
                    url: 'https://www.youtube.com/watch?v=sEhy-RXkNo0',
                    artist: await getArtistId('Rihanna'),
                    type: 'Track'
                });
                await couch.insert("cbd", {
                    title: '20 de enero',
                    url: 'https://www.youtube.com/watch?v=QmhcdlvUIUY',
                    artist: await getArtistId('La Oreja de Van Gogh'),
                    type: 'Track'
                });
                await couch.insert("cbd", {
                    title: 'Vino tinto',
                    url: 'https://www.youtube.com/watch?v=NOjgze5Nmzc',
                    artist: await getArtistId('Estopa'),
                    type: 'Track'
                });
                await couch.insert("cbd", {
                    title: 'Venom',
                    url: 'https://www.youtube.com/watch?v=8CdcCD5V-d8',
                    artist: await getArtistId('Eminem'),
                    type: 'Track'
                });
            }
        );
    }
);