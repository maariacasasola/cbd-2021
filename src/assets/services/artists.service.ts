import 'reflect-metadata';
import { injectable } from 'inversify';
import { ArtistModel } from '../models/artist.model';
import * as _ from 'lodash';
import nano = require('nano');
var couch = require('../../couchdb/couchdb').use('artists')

@injectable()
export class ArtistsService {

    async getArtists() {
        const params = { include_docs: true, limit: 10, descending: true }
        try {
            return couch.list(params);
        } catch (error) {
            console.log(error)
        }
    }

    async getArtistById(id: string) {
        try {
            const doc = await couch.get(id);
            return doc;
        } catch (error) {
            console.log("No existe una artista con el id: " + id)
        }
    }

    // public addArtist(artist: ArtistModel): ArtistModel {
    //     try {
    //         const res = await couch.mango('artists', mangoQuery, parameters);
    //         return artist;
    //     }catch{

    //     }
    // }
}
