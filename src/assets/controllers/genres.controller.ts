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
            200: {
                description: 'Successful'
            },
            400: {},
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
            response.json(await this.genresService.getGenres());
        } catch (error) {
            console.log(error);
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
            200: {
                description: 'Successful',
            },
            400: { description: 'Parameters fail' },
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
        const newGenre = new GenreModel();
        await this.genresService.addGenre(request.body);
        response.json(request.body);
    }
}
