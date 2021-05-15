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
    name: 'Artists',
    path: '/artists/{id}',
})
@controller('/artists/:id')
@injectable()
export class ArtistController implements interfaces.Controller {
    constructor(@inject(ArtistsService.name) private artistsService: ArtistsService) {}

    @ApiOperationGet({
        description: 'Get artist object',
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
                model: 'Artist',
            },
            400: {},
        },
    })
    @httpGet('/')
    public async getArtist(
        @requestParam('id') id: string,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) {
        response.json(await this.artistsService.getArtistById(id));
    }
}
