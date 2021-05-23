import 'reflect-metadata';
import * as express from 'express';
import { inject, injectable } from 'inversify';
import {
    controller,
    httpGet,
    httpPost,
    interfaces
} from 'inversify-express-utils';
import 'reflect-metadata';
import {
    ApiOperationGet,
    ApiOperationPost,
    ApiPath
} from 'swagger-express-ts';
import { TrackModel } from '../models/track.model';
import { TracksService } from '../services/tracks.service';

@ApiPath({
    name: 'Tracks',
    path: '/tracks',
    security: { apiKeyHeader: [] },
})
@controller('/tracks')
@injectable()
export class TracksController implements interfaces.Controller {
    constructor(@inject(TracksService.name) private tracksService: TracksService) { }

    @ApiOperationGet({
        description: 'Get all tracks objects',
        parameters: {},
        responses: {
            500: { description: 'Internal server error' },
            404: { description: 'Not found' },
            400: { description: 'Parameters fail' },
            200: { description: 'Successful' }
        },
        summary: 'Get all tracks',
    })
    @httpGet('/')
    public async getTracks(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) {
        try {
            return response.json(await this.tracksService.getTracks());
        } catch (error) {
            return response.status(500).end();
        }
    }

    @ApiOperationPost({
        description: 'Post track object',
        parameters: {
            body: {
                description: 'New track',
                model: 'Track',
                required: true,
            },
        },
        responses: {
            500: { description: 'Internal server error' },
            404: { description: 'Not found' },
            400: { description: 'Parameters fail' },
            200: { description: 'Successful' }
        },
        summary: 'Post new track',
    })
    @httpPost('/')
    async postTrack(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) {
        if (!request.body) {
            return response.status(400).end();
        }
        if (request.body.title && request.body.url && request.body.artist) {
            try {
                const newTrack = new TrackModel();
                newTrack.title = request.body.title;
                newTrack.url = request.body.url;
                newTrack.artist = request.body.artist;
                const message = await this.tracksService.addTrack(newTrack);
                if (message === 'Track created correctly') {
                    return response.json(newTrack);
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