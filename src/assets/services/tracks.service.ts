import 'reflect-metadata';
import { injectable } from 'inversify';
import { TrackModel } from '../models/track.model';
import * as _ from 'lodash';
import { couch } from '../../index'
import { AssertionError } from 'chai';
import { response } from 'express';
import { requestHeaders } from 'inversify-express-utils';

@injectable()
export class TracksService {

    private tracksList: TrackModel[] = [
        {
            _id: '1',
            _rev: '34',
            title: 'Track 1',
            url: '',
            version: '1.0.0',
        } as TrackModel,
        {
            _id: '2',
            _rev: '34',
            title: 'Track 2',
            url: '',
            version: '2.0.0',
        } as TrackModel,
    ];

    public async getTracks() {
        const mangoQuery = {
            selector: {
            }
        };
        const parameters = {};
        try {
            const res = await couch.mango('cbd', mangoQuery, parameters).then((data: any) => {
                const res=JSON.parse(JSON.stringify(data));
                const ret: TrackModel[]=res.data.docs as TrackModel[];
                console.log(ret);
                return ret;
            });
            return res;
            
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async getTrackById(id: string) {
        try{
        const artist = await couch.get("cbd", id).then(
            (data: any) => {
                let obj: TrackModel = data.data;
                return obj;
            }
        ).catch((error: Error)=>{
            console.log("No existe una canción con el id " + id)
            return error.message
        });
        return artist;
        }catch(error){
            console.log("No existe una canción con el id " + id)
            return error
        }
    }

    async addTrack(track: TrackModel) {
        try{
        await couch.inssert("cbd", track).then(
            (data: any) => {
                let obj: TrackModel = data.data;
                return obj;
            }
        ).catch(((error: Error)=>{
            return error.message
        }));
        return track;
        }catch(error){
            console.log("Error al crear la canción")
            return error
        }
    }
}
