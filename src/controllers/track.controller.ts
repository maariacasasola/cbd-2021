import { TrackService } from './../services/tracks.service';

export class TrackController {

    trackService: TrackService;

    constructor() {
        this.trackService = new TrackService();
    }

    getTrack(req, res, next) {
        console.log(req.params.trackId);
        this.trackService.track(req.params.trackId).then((data) => {
            // No content
            if (!data) {
                res.status(204).json(data);
            }
            else {
                res.status(200).json(data);
            }
        }, (err) => {
            console.log('Failed in getting track', err);
            next(err);
        });
    }

    // saveBlog(req, res, next) {
    //     this.blogService.saveBlog(req.body).then((data) => {
    //         // No content
    //         if (!data) {
    //             res.status(204).json(data);
    //         }
    //         else {
    //             res.status(200).json(data);
    //         }
    //     }, (err) => {
    //         console.log('Failed in creating blog', err);
    //         next(err);
    //     });
    // }

    // updateBlog(req, res, next) {
    //     const _rev = req.params._rev;
    //     const blogId = req.params.blogId;
    //     if (!_rev || !blogId) {
    //         const err = new Error('Both blogId and _rev are mandatory');
    //         res.status(400).json(err);
    //         next(err);
    //     }
    //     this.blogService.updateBlog(blogId, _rev, req.body).then((data) => {
    //         // No content
    //         if (!data) {
    //             res.status(204).json('No blog found with the given ID');
    //         }
    //         else {
    //             res.status(200).json(data);
    //         }
    //     }, (err) => {
    //         console.log('Failed in updating blog', err);
    //         next(err);
    //     });
    // }

    // deleteBlog(req, res, next) {
    //     console.log(req.params.blogId);
    //     const _rev = req.params._rev;
    //     const blogId = req.params.blogId;
    //     if (!_rev || !blogId) {
    //         const err = new Error('Both blogId and _rev are mandatory');
    //         res.status(400).json(err);
    //         next(err);
    //     }
    //     this.blogService.deleteBlog(blogId, _rev).then((data) => {
    //         // No content
    //         if (!data) {
    //             res.status(204).json('No blog found to delete');
    //         }
    //         else {
    //             res.status(200).json(data);
    //         }
    //     }, (err) => {
    //         console.log('Failed in deleting blog', err);
    //         next(err);
    //     });
    // }
}


// import 'reflect-metadata';
// import { injectable, inject } from 'inversify';
// import {
//     interfaces,
//     controller,
//     httpGet,
//     requestParam,
// } from 'inversify-express-utils';
// import {
//     ApiPath,
//     SwaggerDefinitionConstant,
//     ApiOperationGet,
// } from 'swagger-express-ts';
// import * as express from 'express';
// import { TracksService } from '../services/tracks.service';

// @ApiPath({
//     name: 'Tracks',
//     path: '/tracks/{id}',
// })
// @controller('/tracks/:id')
// @injectable()
// export class TrackController implements interfaces.Controller {
//     constructor(@inject(TracksService.name) private tracksService: TracksService) {}

//     @ApiOperationGet({
//         description: 'Get track object',
//         parameters: {
//             path: {
//                 id: {
//                     required: true,
//                     type: SwaggerDefinitionConstant.Parameter.Type.STRING,
//                 },
//             },
//         },
//         responses: {
//             200: {
//                 description: 'Successful'
//             },
//             400: {},
//         },
//     })
//     @httpGet('/')
//     public async getTrack(
//         @requestParam('id') id: string,
//         request: express.Request,
//         response: express.Response,
//         next: express.NextFunction
//     ) {
//         response.json(await this.tracksService.getTrackById(id));
//     }
// }
