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
        description: 'Get genre artists objects',
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
        summary: 'Get artists of genre'
    })
    @httpGet('/')
    public async getGenreArtists(
        @requestParam('id') id: string,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) {
        try {
            const message = await this.genresService.getGenreArtists(id);
            console.log(message)
            if (message === 'Genre with id ' + id + ' does not exist') {
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