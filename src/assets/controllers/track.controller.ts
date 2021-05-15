import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import {
    interfaces,
    controller,
    httpGet,
    requestParam,
} from 'inversify-express-utils';
import {
    ApiPath,
    SwaggerDefinitionConstant,
    ApiOperationGet,
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
            400: {},
        },
    })
    @httpGet('/')
    public async getTrack(
        @requestParam('id') id: string,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) {
        response.json(await this.tracksService.getTrackById(id));
    }
}
