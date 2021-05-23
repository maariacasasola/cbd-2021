import 'reflect-metadata';
import { injectable } from 'inversify';
import { ArtistModel } from '../models/artist.model';
import { couch } from '../../index'
import { TrackModel } from '../models/track.model';

@injectable()
export class ArtistsService {
    async getArtists() {
        const mangoQuery = {
            selector: {
                type: 'Artist'
            }
        };
        const parameters = {};
        try {
            const res = await couch.mango('cbd', mangoQuery, parameters).then((data: any) => {
                const res = JSON.parse(JSON.stringify(data));
                if (res?.data?.docs) {
                    const ret: ArtistModel[] = res?.data?.docs as ArtistModel[];
                    return ret;
                } else {
                    return 'There are not any artists';
                }
            });
            if (res.length !== 0) {
                return res;
            } else {
                return 'There are not any artists';
            }
        } catch (error) {
            return 'An error occurred';
        }
    }

    async addArtist(artist: ArtistModel) {
        try {
            const newArtist = await couch.insert('cbd', {
                name: artist?.name,
                description: artist?.description,
                genres: artist?.genres,
                type: 'Artist'
            }).then((status: any) => {
                if (status?.status === 201) {
                    return 'Artist created correctly';
                }
            });
            return newArtist;
        } catch (error) {
            return 'An error occurred';
        }
    }

    async getArtistById(id: string) {
        try {
            const artist: ArtistModel = await couch.get('cbd', id).then(
                (data: any) => {
                    let obj: ArtistModel = data?.data;
                    if (obj?.type === 'Artist') {
                        return obj;
                    } else {
                        return 'Artist with id ' + id + ' does not exist';
                    }
                }
            ).catch((error: Error) => {
                return 'Artist with id ' + id + ' does not exist';
            });
            if (artist) {
                return artist;
            } else {
                return 'Artist with id ' + id + ' does not exist';
            }
        } catch (error) {
            return error?.headers;
        }
    }

    async updateArtist(id: string, artist_updated: ArtistModel) {
        try {
            const artist = await this.getArtistById(id);
            if (artist && artist?.type === 'Artist') {
                const updated = await couch.update('cbd', {
                    _id: id,
                    _rev: artist?._rev,
                    name: artist_updated?.name,
                    description: artist_updated?.description,
                    genres: artist_updated?.genres,
                    type: 'Artist'
                }).then((status: any) => {
                    if (status?.status === 201) {
                        return 'Artist updated correctly';
                    }
                });
                return updated;
            } else {
                return 'Artist with id ' + id + ' does not exist';
            }
        } catch (error) {
            return 'An error occurred';
        }
    }

    async deleteArtist(id: string) {
        try {
            const artist = await this.getArtistById(id);
            if (artist && artist?.type === 'Artist') {
                const e = await couch.del('cbd', id, artist?._rev).then((status: any) => {
                    if (status?.status === 200) {
                        return 'Artist deleted correctly';
                    }
                });
                return artist;
            } else {
                return 'Artist with id ' + id + ' does not exist';
            }
        } catch (error) {
            return 'An error occurred';
        }
    }

    async getArtistTracks(artist_id: string) {
        const mangoQuery = {
            selector: {
                type: 'Track',
                artist: artist_id
            }
        };
        const parameters = {};
        try {
            const artist = await this.getArtistById(artist_id);
            if (artist && artist?.type === 'Artist') {
                const res = await couch.mango('cbd', mangoQuery, parameters).then((data: any) => {
                    const res = JSON.parse(JSON.stringify(data));
                    if (res?.data?.docs) {
                        const ret: TrackModel[] = res?.data?.docs as TrackModel[];
                        return ret;
                    } else {
                        return 'There are not any tracks for the artist with id ' + artist_id;
                    }
                });
                if (res.length !== 0) {
                    return res;
                } else {
                    return 'There are not any tracks for the artist with id ' + artist_id;
                }
            } else {
                return 'Artist with id ' + artist_id + ' does not exist';
            }
        } catch (error) {
            return 'An error occurred';
        }
    }
}