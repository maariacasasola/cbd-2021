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
    SwaggerDefinitionConstant,
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
    constructor(@inject(ArtistsService.name) private artistsService: ArtistsService) {}

    @ApiOperationGet({
        description: 'Get all artist objects',
        parameters: {},
        responses: {
            200: {
                description: 'Successful'
            },
            400: {},
        },
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
                model: 'Artist',
                required: true
            },
        },
        responses: {
            200: {
                model: 'Artist',
            },
            400: { description: 'Parameters fail' },
        },
        summary: 'Post new artist',
    })
    @httpPost('/')
    public postArtist(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): void {
        if (!request.body) {
            return response.status(400).end();
        }
        const newArtist = new ArtistModel();
        newArtist._id = request.body.id;
        newArtist.name = request.body.name;
        newArtist.description = request.body.description;
        this.artistsService.addArtist(request.body);
        response.json(request.body);
    }
}
