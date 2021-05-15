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
    constructor(@inject(TracksService.name) private tracksService: TracksService) {}

    @ApiOperationGet({
        description: 'Get all tracks objects',
        parameters: {},
        responses: {
            200: {
                description: 'Successful'
            },
            400: {},
        },
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

    // @ApiOperationPost({
    //     description: 'Post artist object',
    //     parameters: {
    //         body: {
    //             description: 'New artist',
    //             model: 'Artist',
    //             required: true,
    //         },
    //     },
    //     responses: {
    //         200: {
    //             model: 'Artist',
    //         },
    //         400: { description: 'Parameters fail' },
    //     },
    //     summary: 'Post new artist',
    // })
    // @httpPost('/')
    // public postArtist(
    //     request: express.Request,
    //     response: express.Response,
    //     next: express.NextFunction
    // ): void {
    //     if (!request.body) {
    //         return response.status(400).end();
    //     }
    //     const newArtist = new ArtistModel();
    //     newArtist._id = request.body.id;
    //     newArtist.name = request.body.name;
    //     newArtist.description = request.body.description;
    //     this.artistsService.addArtist(request.body);
    //     response.json(request.body);
    // }
}
