import 'reflect-metadata';
import * as express from 'express';
import { inject, injectable } from 'inversify';
import {
    controller,
    httpGet,
    httpPost,
    interfaces,
} from 'inversify-express-utils';
import 'reflect-metadata';
import {
    ApiOperationGet,
    ApiOperationPost,
    ApiPath,
} from 'swagger-express-ts';
import { ArtistModel } from '../models/artist.model';
import { ArtistsService } from '../services/artists.service';

@ApiPath({
    name: 'Artists',
    path: '/artists',
    security: { apiKeyHeader: [] },
})
@controller('/artists')
@injectable()
export class ArtistsController implements interfaces.Controller {
    constructor(@inject(ArtistsService.name) private artistsService: ArtistsService) { }

    @ApiOperationGet({
        description: 'Get all artist objects',
        parameters: {},
        responses: {
            500: { description: 'Internal server error' },
            404: { description: 'Not found' },
            400: { description: 'Parameters fail' },
            200: { description: 'Successful' }
        },
        summary: 'Get all artists',
    })
    @httpGet('/')
    public async getArtists(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) {
        try {
            return response.json(await this.artistsService.getArtists());
        } catch (error) {
            return response.status(500).end();
        }
    }

    @ApiOperationPost({
        description: 'Post artist object',
        parameters: {
            body: {
                description: 'New artist',
                required: true,
                model: 'Artist'
            },
        },
        responses: {
            500: { description: 'Internal server error' },
            400: { description: 'Parameters fail' },
            200: { description: 'Successful' }
        },
        summary: 'Post new artist',
    })
    @httpPost('/')
    async postArtist(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) {
        if (!request.body) {
            return response.status(400).end();
        }
        if (request.body.name && request.body.description && request.body.genres) {
            try {
                const newArtist = new ArtistModel();
                newArtist.name = request.body.name;
                newArtist.description = request.body.description;
                newArtist.genres = request.body.genres;
                const message = await this.artistsService.addArtist(newArtist);
                if (message === 'Artist created correctly') {
                    return response.json(newArtist);
                } else {
                    return 'An error occurred';
                }
            } catch (error) {
                return response.status(500).end();
            }
        } else {
            return response.status(400).end();
        }
    }
}