import 'reflect-metadata';
import * as express from 'express';
import { inject, injectable } from 'inversify';
import {
    controller,
    httpGet,
    httpPost,
    httpPut,
    interfaces,
    requestParam
} from 'inversify-express-utils';
import 'reflect-metadata';
import {
    ApiOperationGet,
    ApiOperationPost,
    ApiOperationPut,
    ApiPath,
    SwaggerDefinitionConstant,
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
            200: {
                description: 'Successful'
            },
            400: {},
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
            response.json(await this.tracksService.getTracks());
        } catch (error) {
            console.log(error);
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
            200: {
                description: 'successful',
            },
            400: { description: 'Parameters fail' },
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
        const t = new TrackModel();
        await this.tracksService.addTrack(request.body);
        response.json(request.body);
    }
}


