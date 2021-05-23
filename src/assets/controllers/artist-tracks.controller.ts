import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import {
    interfaces,
    controller,
    httpGet,
    requestParam,
} from 'inversify-express-utils';
import {
    ApiPath,
    SwaggerDefinitionConstant,
    ApiOperationGet,
} from 'swagger-express-ts';
import * as express from 'express';
import { ArtistsService } from '../services/artists.service';

@ApiPath({
    name: 'Artist Tracks',
    path: '/tracks/artist/{id}',
})
@controller('/tracks/artist/:id')
@injectable()
export class ArtistTracksController implements interfaces.Controller {
    constructor(@inject(ArtistsService.name) private artistsService: ArtistsService) { }

    @ApiOperationGet({
        description: 'Get artist tracks objects',
        parameters: {
            path: {
                id: {
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            500: { description: 'Internal server error' },
            404: { description: 'Not found' },
            400: { description: 'Parameters fail' },
            200: { description: 'Successful' }
        },
        summary: 'Get tracks of artist'
    })
    @httpGet('/')
    public async getArtistTracks(
        @requestParam('id') id: string,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) {
        try {
            const message = await this.artistsService.getArtistTracks(id);
            if (message === 'Artist with id ' + id + ' does not exist') {
                return response.status(404).end();
            } else if (message === 'An error occurred') {
                return 'An error occurred';
            }
            return message;
        } catch (error) {
            return response.status(500).end();
        }
    }
}