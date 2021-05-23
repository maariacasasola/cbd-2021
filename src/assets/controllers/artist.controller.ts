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
import { ArtistModel } from '../models/artist.model';

@ApiPath({
    name: 'Artists',
    path: '/artists/{id}',
})
@controller('/artists/:id')
@injectable()
export class ArtistController implements interfaces.Controller {
    constructor(@inject(ArtistsService.name) private artistsService: ArtistsService) { }

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
            500: { description: 'Internal server error' },
            404: { description: 'Not found' },
            400: { description: 'Parameters fail' },
            200: { description: 'Successful' }
        },
        summary: 'Get an artist by id'
    })
    @httpGet('/')
    public async getArtist(
        @requestParam('id') id: string,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) {
        try {
            const message = await this.artistsService.getArtistById(id);
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

    @ApiOperationPut({
        description: 'Update artist object',
        parameters: {
            path: {
                id: {
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
            body: {
                description: 'Update artist',
                required: true,
                model: 'Artist'
            }
        },
        responses: {
            500: { description: 'Internal server error' },
            404: { description: 'Not found' },
            400: { description: 'Parameters fail' },
            200: { description: 'Successful' }
        },
        summary: 'Update artist'
    })
    @httpPut('/')
    public async updateArtist(@requestParam('id') id: string,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction) {
        if (!request.body) {
            return response.status(400).end();
        }
        if (request.body.name && request.body.description && request.body.genres) {
            try {
                const newArtist = new ArtistModel();
                newArtist.name = request.body.name;
                newArtist.description = request.body.description;
                newArtist.genres = request.body.genres;
                const message = await this.artistsService.updateArtist(id, newArtist);
                if (message === 'Artist updated correctly') {
                    return response.json(newArtist);
                } else if (message === 'Artist with id ' + id + ' does not exist') {
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
        description: 'Delete artist object',
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
        summary: 'Delete artist'
    })
    @httpDelete('/')
    public async deleteArtist(
        @requestParam('id') id: string,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) {
        try {
            const message = await this.artistsService.deleteArtist(id);
            if (message === 'Artist with id ' + id + ' does not exist') {
                return response.status(404).end();
            } else if (message === 'Artist deleted correctly') {
                return response.json(message);
            }
            return message;
        } catch (error) {
            return response.status(500).end();
        }
    }
}