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
            200: {
                description: 'Successful'
            },
            400: {},
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
            response.json(await this.artistsService.getArtists());
        } catch (error) {
            console.log(error);
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
            200: {
                description: 'Successful',
            },
            400: { description: 'Parameters fail' },
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
        const newArtist = new ArtistModel();
        await this.artistsService.addArtist(request.body);
        response.json(request.body);
    }
}
