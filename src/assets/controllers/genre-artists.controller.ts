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
import { GenresService } from '../services/genres.service';

@ApiPath({
    name: 'Genre Artists',
    path: '/artists/genre/{id}',
})
@controller('/artists/genre/:id')
@injectable()
export class GenreArtistsController implements interfaces.Controller {
    constructor(@inject(GenresService.name) private genresService: GenresService) { }

    @ApiOperationGet({
        description: 'Get genre tracks objects',
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
    public async getGenreArtists(
        @requestParam('id') id: string,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) {
        try {
            response.json(await this.genresService.getGenreArtists(id));
        } catch (error) {
            console.log(error);
        }
    }

}