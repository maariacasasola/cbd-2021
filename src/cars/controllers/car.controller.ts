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
import { CarsService } from '../services/cars.service';

@ApiPath({
    name: 'Cars',
    path: '/cars/{id}',
})
@controller('/cars/:id')
@injectable()
export class CarController implements interfaces.Controller {
    constructor(@inject(CarsService.name) private carsService: CarsService) {}

    @ApiOperationGet({
        description: 'Get car object',
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
                model: 'Car',
            },
            400: {},
        },
    })
    @httpGet('/')
    public async getCar(
        @requestParam('id') id: string,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) {
        response.json(await this.carsService.getCarById(id));
    }
}
