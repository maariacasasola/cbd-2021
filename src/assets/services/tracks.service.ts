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

    public async getTracks() {
        const mangoQuery = {
            selector: {
            }
        };
        const parameters = {};
        try {
            const res = await couch.mango('cbd', mangoQuery, parameters).then((data: any) => {
                const res = JSON.parse(JSON.stringify(data));
                const ret: TrackModel[] = res.data.docs as TrackModel[];
                console.log(ret);
                return ret;
            }).catch(((error: Error) => {
                return error.message
            }));
            return res;

        } catch (error) {
            console.log(error)
            return error
        }
    }

    async getTrackById(id: string) {
        try {
            const artist = await couch.get("cbd", id).then(
                (data: any) => {
                    let obj: TrackModel = data.data;
                    return obj;
                }
            ).catch((error: Error) => {
                console.log("No existe una canción con el id " + id)
                return error.message
            });
            return artist;
        } catch (error) {
            console.log("No existe una canción con el id " + id)
            return error
        }
    }

    async addTrack(track: TrackModel) {
        try {
            await couch.insert("cbd", {
                title: track.title,
                url: track.url
            }).then(
                (data: any) => {
                    console.log(data)
                }
            ).catch(((error: Error) => {
                return error.message
            }));
        } catch (error) {
            console.log("Error al crear la canción")
            console.log(error)
        }
    }

    async updateTrack(id:string, track_updated: TrackModel){
        try {
            const track: TrackModel = await this.getTrackById(id);
            await couch.update("cbd", {
                _id: id,
                _rev: track._rev,
                name: track_updated.title,
                url: track_updated.url
            }).then((data:any) => {
                console.log('Track updated correctly')
                console.log(data)
            });
        } catch (error) {
            console.log(error)
        }
    }

    async deleteTrack(id: string) {
        try {
            const track = await this.getTrackById(id);
            await couch.del('cbd', id, track._rev).then((data: any) => {
                console.log('Track deleted correcly')
            });
        } catch (error) {
            console.log(error)
        }
    }
}
