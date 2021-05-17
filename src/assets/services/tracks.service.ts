import 'reflect-metadata';
import { injectable } from 'inversify';
import { TrackModel } from '../models/track.model';
import * as _ from 'lodash';
var couch = require('../../couchdb/couchdb').use('tracks')

@injectable()
export class TracksService {

    async getTracks() {
        const params = { include_docs: true, limit: 10, descending: true }
        try {
            return couch.list(params);
        } catch (error) {
            console.log(error)
        }
    }

    async getTrackById(id: string) {
        try {
            const doc = await couch.get(id);
            return doc;
        } catch (error) {
            console.log("No existe una canción con el id: " + id)
        }
    }
}
