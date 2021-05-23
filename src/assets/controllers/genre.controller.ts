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
import { GenreModel } from '../models/genre.model';

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
            500: { description: 'Internal server error' },
            404: { description: 'Not found' },
            400: { description: 'Parameters fail' },
            200: { description: 'Successful' }
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
            const message = await this.genresService.getGenreById(id);
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
            500: { description: 'Internal server error' },
            404: { description: 'Not found' },
            400: { description: 'Parameters fail' },
            200: { description: 'Successful' }
        },
        summary: 'Update genre'
    })
    @httpPut('/')
    public async updateGenre(@requestParam('id') id: string,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction) {
        if (!request.body) {
            return response.status(400).end();
        }
        if (request.body.name && request.body.description) {
            try {
                const newGenre = new GenreModel();
                newGenre.name = request.body.name;
                newGenre.description = request.body.description;
                const message = await this.genresService.updateGenre(id, newGenre);
                if (message === 'Genre updated correctly') {
                    return response.json(newGenre);
                } else if (message === 'Genre with id ' + id + ' does not exist') {
                    return response.status(404).end();
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
            500: { description: 'Internal server error' },
            404: { description: 'Not found' },
            400: { description: 'Parameters fail' },
            200: { description: 'Successful' }
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
            const message = await this.genresService.deleteGenre(id);
            if (message === 'Genre with id ' + id + ' does not exist') {
                return response.status(404).end();
            } else if (message === 'Genre deleted correctly') {
                return response.json(message);
            }
            return message;
        } catch (error) {
            return response.status(500).end();
        }
    }
}