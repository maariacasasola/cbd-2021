import 'reflect-metadata';
import { injectable } from 'inversify';
import { TrackModel } from '../models/track.model';
import * as _ from 'lodash';
import { couch } from '../../index'

@injectable()
export class TracksService {

    public async getTracks() {
        const mangoQuery = {
            selector: {
            }
        };
        const parameters = {};
        try {
            const res = await couch.mango('tracks', mangoQuery, parameters).then((data: any) => {
                const res=JSON.parse(JSON.stringify(data));
                const ret: TrackModel[]=res.data.docs as TrackModel[];
                console.log(ret);
                return ret;
            });
            return res;
            
        } catch (error) {

        }
    }

    async getTrackById(id: string) {
        try{
        const artist = await couch.get("tracks", id).then(
            (data: any) => {
                let obj: TrackModel = data.data;
                return obj;
            }
        ).catch(()=>{
            console.log("")
        });
        return artist;
        }catch(error){

        }
    }
}
