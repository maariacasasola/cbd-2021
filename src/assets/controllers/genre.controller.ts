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
import { GenresService } from '../services/genres.service';

@ApiPath({
    name: 'Genres',
    path: '/genres/{id}',
})
@controller('/genres/:id')
@injectable()
export class GenreController implements interfaces.Controller {
    constructor(@inject(GenresService.name) private genresService: GenresService) { }

    @ApiOperationGet({
        description: 'Get genre object',
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
        summary: 'Get a genre by id'
    })
    @httpGet('/')
    public async getGenre(
        @requestParam('id') id: string,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) {
        try {
            response.json(await this.genresService.getGenreById(id));
        } catch (error) {
            console.log(error);
        }
    }

    @ApiOperationPut({
        description: 'Update genre object',
        parameters: {
            path: {
                id: {
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
            body: {
                description: 'Update genre',
                required: true,
                model: 'Genre'
            }
        },
        responses: {
            200: {
                description: 'Successful'
            },
            400: { description: 'Parameters fail' },
        },
        summary: 'Update genre'
    })
    @httpPut('/')
    public async updateGenre(@requestParam('id') id: string,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction) {
        try {
            if (!request.body) {
                return response.status(400).end();
            }
            response.json(await this.genresService.updateGenre(id, request.body));
        } catch (error) {
            console.log(error);
        }
    }

    @ApiOperationDelete({
        description: 'Delete genre object',
        parameters: {
            path: {
                id: {
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                }
            },
        },
        responses: {
            200: {
                description: 'Successful'
            },
            400: {},
        },
        summary: 'Delete genre'
    })
    @httpDelete('/')
    public async deleteGenre(
        @requestParam('id') id: string,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) {
        try {
            response.json(await this.genresService.deleteGenre(id));
        } catch (error) {
            console.log(error);
        }
    }
}
