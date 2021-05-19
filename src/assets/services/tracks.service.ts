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
                type: 'Track'
            }
        };
        const parameters = {};
        try {
            const res = await couch.mango('cbd', mangoQuery, parameters).then((data: any) => {
                const res = JSON.parse(JSON.stringify(data));
                if (res) {
                    const ret: TrackModel[] = res.data.docs as TrackModel[];
                    return ret;
                } else {
                    console.log('There are not any tracks')
                }
            });
            if (res) {
                return res;
            } else {
                console.log('There are not any tracks')
            } 
        } catch (error) {
            console.log('An error has ocurred')
            return error.headers
        }
    }

    async getTrackById(id: string) {
        try {
            const track: TrackModel = await couch.get("cbd", id).then(
                (data: any) => {
                    let obj: TrackModel = data.data;
                    if (obj?.type === 'Track') {
                        return obj;
                    } else {
                        console.log('Track with id ' + id + ' does not exist')
                    }
                }
            ).catch((error: Error) => {
                console.log('Track with id ' + id + ' does not exist')
                return error.message
            });
            return track;
        } catch (error) {
            console.log('Track with id ' + id + ' does not exist')
            return error
        }
    }

    async addTrack(track: TrackModel) {
        try {
            await couch.insert("cbd", {
                title: track.title,
                url: track.url,
                type: 'Track'
            }).then(
                (data: any) => {
                    console.log('Track created correctly')
                }
            ).catch(((error: Error) => {
                return error.message
            }));
        } catch (error) {
            console.log('An error has occurred')
            console.log(error)
        }
    }

    async updateTrack(id:string, track_updated: TrackModel){
        try {
            const track = await this.getTrackById(id);
            if (track && track?.type === 'Track') {
                await couch.update('cbd', {
                    _id: id,
                    _rev: track._rev,
                    title: track_updated.title,
                    url: track_updated.url,
                    type: 'Track'
                }).then((status: any) => {
                    if (status.status === 201) {
                        console.log('Track created correctly')
                    }
                });
            } else {
                console.log('Track with id ' + id + ' does not exist')
            }
        } catch (error) {
            console.log('An error has occurred')
        }
    }

    async deleteTrack(id: string) {
        try {
            const track = await this.getTrackById(id);
            if (track && track?.type === 'Track') {
                await couch.del('cbd', id, track._rev).then((status: any) => {
                    if (status.status === 200) {
                        console.log('Track deleted correctly')
                    }
                });
            } else {
                console.log('Track with id ' + id + ' does not exist')
            }
        } catch (error) {
            console.log(error)
        }
    }
}
