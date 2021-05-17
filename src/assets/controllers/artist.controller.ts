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
            200: {
                description: 'Successful'
            },
            400: { description: 'Parameters fail' },
        },
    })
    @httpGet('/')
    public async getArtist(
        @requestParam('id') id: string,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) {
        try {
            response.json(await this.artistsService.getArtistById(id));
        } catch (error) {
            console.log(error);
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
            200: {
                description: 'Successful'
            },
            400: { description: 'Parameters fail' },
        },
        summary: 'Update artist'
    })
    @httpPut('/')
    public async updateArtist(@requestParam('id') id: string,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction) {
        try {
            if (!request.body) {
                return response.status(400).end();
            }
            response.json(await this.artistsService.updateArtist(id, request.body));
        } catch (error) {
            console.log(error);
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
            200: {
                description: 'Successful'
            },
            400: {},
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
            response.json(await this.artistsService.deleteArtist(id));
        } catch (error) {
            console.log(error);
        }
    }
}
