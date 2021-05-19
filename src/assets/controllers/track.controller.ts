import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import {
    interfaces,
    controller,
    httpGet,
    requestParam,
    httpDelete,
    httpPut,
} from 'inversify-express-utils';
import {
    ApiPath,
    SwaggerDefinitionConstant,
    ApiOperationGet,
    ApiOperationDelete,
    ApiOperationPut,
} from 'swagger-express-ts';
import * as express from 'express';
import { TracksService } from '../services/tracks.service';

@ApiPath({
    name: 'Tracks',
    path: '/tracks/{id}',
})
@controller('/tracks/:id')
@injectable()
export class TrackController implements interfaces.Controller {
    constructor(@inject(TracksService.name) private tracksService: TracksService) {}

    @ApiOperationGet({
        description: 'Get track object',
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
            400: {  description: 'Parameters fail' },
        },
        summary: 'Get a track by id'
    })
    @httpGet('/')
    public async getTrack(
        @requestParam('id') id: string,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) {
        try {
            response.json(await this.tracksService.getTrackById(id));
        } catch (error) {
            console.log(error);
        }
    }

    @ApiOperationPut({
        description: 'Update track object',
        parameters: {
            path: {
                id: {
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
            body: {
                description: 'Update track',
                required: true,
                model: 'Track'
            }
        },
        responses: {
            200: {
                description: 'Successful'
            },
            400: { description: 'Parameters fail' },
        },
        summary: 'Update track'
    })
    @httpPut('/')
    public async updateTrack(@requestParam('id') id: string,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction) {
        try {
            if (!request.body) {
                return response.status(400).end();
            }
            response.json(await this.tracksService.updateTrack(id, request.body));
        } catch (error) {
            console.log(error);
        }
    }

    @ApiOperationDelete({
        description: 'Delete track object',
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
        summary: 'Delete track'
    })
    @httpDelete('/')
    public async deleteTrack(
        @requestParam('id') id: string,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) {
        try {
            response.json(await this.tracksService.deleteTrack(id));
        } catch (error) {
            console.log(error);
        }
    }
}
