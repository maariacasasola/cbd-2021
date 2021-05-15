import 'reflect-metadata';
import { injectable } from 'inversify';
import { TrackModel } from '../models/track.model';
import * as _ from 'lodash';
import { couch } from '../../index'

@injectable()
export class TracksService {

    private tracksList: TrackModel[] = [
        {
            _id: '1',
            title: 'Track 1',
            url: '',
            version: '1.0.0',
        } as TrackModel,
        {
            _id: '2',
            title: 'Track 2',
            url: '',
            version: '2.0.0',
        } as TrackModel,
    ];

    public getTracks() {
        couch.get('cbd', '').then((data: any) => {
            return data.data;
        });
    }

    // public addArtist(artist: ArtistModel): ArtistModel {
    //     this.artistsList.push(artist);
    //     return artist;
    // }

    async getTrackById(id: string) {
        try{
        const artist = await couch.get("cbd", id).then(
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
