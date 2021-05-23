import 'reflect-metadata';
import { injectable } from 'inversify';
import { TrackModel } from '../models/track.model';
import * as _ from 'lodash';
import { couch } from '../../index'

@injectable()
export class TracksService {

    async getTracks() {
        const mangoQuery = {
            selector: {
                type: 'Track'
            }
        };
        const parameters = {};
        try {
            const res = await couch.mango('cbd', mangoQuery, parameters).then((data: any) => {
                const res = JSON.parse(JSON.stringify(data));
                if (res?.data?.docs) {
                    const ret: TrackModel[] = res?.data?.docs as TrackModel[];
                    return ret;
                } else {
                    return 'There are not any tracks';
                }
            });
            if (res.length !== 0) {
                return res;
            } else {
                return 'There are not any tracks';
            }
        } catch (error) {
            return 'An error ocurred';
        }
    }

    async getTrackById(id: string) {
        try {
            const track: TrackModel = await couch.get("cbd", id).then(
                (data: any) => {
                    let obj: TrackModel = data?.data;
                    if (obj?.type === 'Track') {
                        return obj;
                    } else {
                        return 'Track with id ' + id + ' does not exist';
                    }
                }
            ).catch((error: Error) => {
                return 'Track with id ' + id + ' does not exist';
            });
            if (track) {
                return track;
            } else {
                return 'Artist with id ' + id + ' does not exist';
            }
        } catch (error) {
            return error?.headers;
        }
    }

    async addTrack(track: TrackModel) {
        try {
            const newTrack = await couch.insert("cbd", {
                title: track?.title,
                url: track?.url,
                artist: track?.artist,
                type: 'Track'
            }).then((status: any) => {
                if (status?.status === 201) {
                    return 'Track created correctly';
                }
            });
            return newTrack;
        } catch (error) {
            return 'An error occurred';
        }
    }

    async updateTrack(id: string, track_updated: TrackModel) {
        try {
            const track = await this.getTrackById(id);
            if (track && track?.type === 'Track') {
                const updated= await couch.update('cbd', {
                    _id: id,
                    _rev: track?._rev,
                    title: track_updated?.title,
                    url: track_updated?.url,
                    artist: track_updated?.artist,
                    type: 'Track'
                }).then((status: any) => {
                    if (status.status === 201) {
                        return 'Track updated correctly';
                    }
                });
                return updated;
            } else {
                return 'Track with id ' + id + ' does not exist';
            }
        } catch (error) {
            return 'An error occurred';
        }
    }

    async deleteTrack(id: string) {
        try {
            const track = await this.getTrackById(id);
            if (track && track?.type === 'Track') {
                const e= await couch.del('cbd', id, track?._rev).then((status: any) => {
                    if (status?.status === 200) {
                        return 'Track deleted correctly';
                    }
                });
                return track;
            } else {
                return 'Track with id ' + id + ' does not exist';
            }
        } catch (error) {
            return 'An error occurred';
        }
    }
}