import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import {
    interfaces,
    controller,
    httpGet,
    requestParam,
    httpPut,
    httpDelete,
} from 'inversify-express-utils';
import {
    ApiPath,
    SwaggerDefinitionConstant,
    ApiOperationGet,
    ApiOperationPut,
    ApiOperationDelete,
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
            200: {
                description: 'Successful'
            },
            400: { description: 'Parameters fail' },
        },
    })
    @httpGet('/')
    public async getArtistTracks(
        @requestParam('id') id: string,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) {
        try {
            response.json(await this.artistsService.getArtistTracks(id));
        } catch (error) {
            console.log(error);
        }
    }

}