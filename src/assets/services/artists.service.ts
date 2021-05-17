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
            genres: '',
            tracks: '',
            version: '1.0.0',
        } as ArtistModel,
        {
            description: 'Description Artists 2',
            _id: '2',
            _rev: '34',
            name: 'Artist 2',
            genres: '',
            tracks: '',
            version: '2.0.0',
        } as ArtistModel,
    ];

    async getArtists() {
        const mangoQuery = {
            selector: {
            }
        };
        const parameters = {};
        try {
            const res = await couch.mango('cbd', mangoQuery, parameters).then((data: any) => {
                const res = JSON.parse(JSON.stringify(data));
                const ret: ArtistModel[] = res.data.docs as ArtistModel[];
                console.log(ret);
                return ret;
            });
            return res;

        } catch (error) {
            return error.headers
        }
    }

    async addArtist(artist: ArtistModel) {
        try {
            await couch.insert("cbd", {
                name: artist.name,
                description: artist.description,
                genres: artist.genres,
                tracks: artist.tracks
            }).then((data:any) => {
                console.log(data)
            });
        } catch (error) {
            console.log(error)
        }
    }

    async getArtistById(id: string) {
        try {
            const artist = await couch.get("cbd", id).then(
                (data: any) => {
                    let obj: ArtistModel = data.data;
                    console.log(obj)
                    return obj;
                }
            ).catch((error: Error) => {
                console.log("No existe un artista con el id " + id)
                return error.message
            });
            return artist;
        } catch (error) {
            console.log("No existe un artista con el id " + id)
            return error.headers
        }
    }
}
