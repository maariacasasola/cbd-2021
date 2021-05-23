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
import { TrackModel } from '../models/track.model';

@ApiPath({
    name: 'Tracks',
    path: '/tracks/{id}',
})
@controller('/tracks/:id')
@injectable()
export class TrackController implements interfaces.Controller {
    constructor(@inject(TracksService.name) private tracksService: TracksService) { }

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
            500: { description: 'Internal server error' },
            404: { description: 'Not found' },
            400: { description: 'Parameters fail' },
            200: { description: 'Successful' }
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
            const message = await this.tracksService.getTrackById(id);
            if (message === 'Track with id ' + id + ' does not exist') {
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
            500: { description: 'Internal server error' },
            404: { description: 'Not found' },
            400: { description: 'Parameters fail' },
            200: { description: 'Successful' }
        },
        summary: 'Update track'
    })
    @httpPut('/')
    public async updateTrack(@requestParam('id') id: string,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction) {
        if (!request.body) {
            return response.status(400).end();
        }
        if (request.body.title && request.body.url && request.body.artist) {
            try {
                const newTrack = new TrackModel();
                newTrack.title = request.body.title;
                newTrack.url = request.body.url;
                newTrack.artist = request.body.artist;
                const message = await this.tracksService.updateTrack(id, newTrack);
                if (message === 'Track updated correctly') {
                    return response.json(newTrack);
                } else if (message === 'Track with id ' + id + ' does not exist') {
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
            500: { description: 'Internal server error' },
            404: { description: 'Not found' },
            400: { description: 'Parameters fail' },
            200: { description: 'Successful' }
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
            const message = await this.tracksService.deleteTrack(id);
            if (message === 'Track with id ' + id + ' does not exist') {
                return response.status(404).end();
            } else if (message === 'Track deleted correctly') {
                return response.json(message);
            }
            return message;
        } catch (error) {
            return response.status(500).end();
        }
    }
}