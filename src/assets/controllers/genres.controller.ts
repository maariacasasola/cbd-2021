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
import { GenreModel } from '../models/genre.model';
import { GenresService } from '../services/genres.service';

@ApiPath({
    name: 'Genres',
    path: '/genres',
    security: { apiKeyHeader: [] },
})
@controller('/genres')
@injectable()
export class GenresController implements interfaces.Controller {
    constructor(@inject(GenresService.name) private genresService: GenresService) { }

    @ApiOperationGet({
        description: 'Get all genre objects',
        parameters: {},
        responses: {
            500: { description: 'Internal server error' },
            404: { description: 'Not found' },
            400: { description: 'Parameters fail' },
            200: { description: 'Successful' }
        },
        summary: 'Get all genres',
    })
    @httpGet('/')
    public async getGenres(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) {
        try {
            return response.json(await this.genresService.getGenres());
        } catch (error) {
            return response.status(500).end();
        }
    }

    @ApiOperationPost({
        description: 'Post genre object',
        parameters: {
            body: {
                description: 'New genre',
                required: true,
                model: 'Genre'
            },
        },
        responses: {
            500: { description: 'Internal server error' },
            404: { description: 'Not found' },
            400: { description: 'Parameters fail' },
            200: { description: 'Successful' }
        },
        summary: 'Post new genre',
    })
    @httpPost('/')
    async postGenre(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) {
        if (!request.body) {
            return response.status(400).end();
        }
        if (request.body.name && request.body.description) {
            try {
                const newGenre = new GenreModel();
                newGenre.name = request.body.name;
                newGenre.description = request.body.description;
                const message = await this.genresService.addGenre(newGenre);
                if (message === 'Genre created correctly') {
                    return response.json(newGenre);
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