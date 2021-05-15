import 'reflect-metadata';
import { injectable } from 'inversify';
import { ArtistModel } from '../models/artist.model';
import * as _ from 'lodash';
import { couch } from '../../index'

@injectable()
export class ArtistsService {

    private artistsList: ArtistModel[] = [
        {
            description: 'Description Artist 1',
            _id: '1',
            _rev: '34',
            name: 'Artist 1',
            genres: [],
            tracks: [],
            version: '1.0.0',
        } as ArtistModel,
        {
            description: 'Description Artists 2',
            _id: '2',
            _rev: '34',
            name: 'Artist 2',
            genres: [],
            tracks: [],
            version: '2.0.0',
        } as ArtistModel,
    ];

    public getArtists() {
        couch.get('cbd', '').then((data: any) => {
            return data.data;
        });
    }

    // public addArtist(artist: ArtistModel): ArtistModel {
    //     this.artistsList.push(artist);
    //     return artist;
    // }

    async getArtistById(id: string) {
        const artist = couch.get("cbd", id).then(
            (data: any) => {
                let obj: ArtistModel = data.data;
                return obj;
            }
        );
        return artist;
    }
}
