import 'reflect-metadata';
import { injectable } from 'inversify';
import { CarModel } from '../models/car.model';
import * as _ from 'lodash';
import { couch } from '../../index'

@injectable()
export class CarsService {

    private carsList: CarModel[] = [
        {
            description: 'Description Car 1',
            _id: '1',
            _rev: '34',
            name: 'Car 1',
            version: '1.0.0',
        } as CarModel,
        {
            description: 'Description Car 2',
            _id: '2',
            _rev: '34',
            name: 'Car 2',
            version: '2.0.0',
        } as CarModel,
    ];

    public getCars() {
        couch.get('cbd', '').then((data: any) => {
            return data.data;
        });
    }

    // public addCar(car: CarModel): CarModel {
    //     this.carsList.push(car);
    //     return car;
    // }

    // public getCarById(id: string): CarModel {
    //     const res= _.find(this.carsList, (car: CarModel) => {
    //         return _.isEqual(car._id, id);
    //     });
    //     console.log(res)
    //     return res;
    // }

    async getCarById(id: string) {
        const car = couch.get("cbd", id).then(
            (data: any) => {
                let obj: CarModel = data.data;
                return obj;
            }
        );
        return car;
    }
}
