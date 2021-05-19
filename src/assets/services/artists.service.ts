import 'reflect-metadata';
import { injectable } from 'inversify';
import { ArtistModel } from '../models/artist.model';
import { couch } from '../../index'

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
                if (res) {
                    const ret: ArtistModel[] = res.data.docs as ArtistModel[];
                    return ret;
                } else {
                    console.log('There are not any artists')
                }
            });
            if (res) {
                return res;
            } else {
                console.log('There are not any artists')
            }
        } catch (error) {
            console.log('An error has occurred')
            return error.headers
        }
    }

    async addArtist(artist: ArtistModel) {
        try {
            await couch.insert('cbd', {
                name: artist.name,
                description: artist.description,
                genres: artist.genres,
                type: 'Artist'
            }).then((status: any) => {
                if (status.status === 201) {
                    console.log('Artist created correctly')
                }
            });
        } catch (error) {
            console.log('An error has occurred')
        }
    }

    async getArtistById(id: string) {
        try {
            const artist: ArtistModel = await couch.get('cbd', id).then(
                (data: any) => {
                    let obj: ArtistModel = data.data;
                    if (obj?.type === 'Artist') {
                        return obj;
                    } else {
                        console.log('Artist with id ' + id + ' does not exist')
                    }
                }
            ).catch((error: Error) => {
                console.log('Artist with id ' + id + ' does not exist')
                return error.message
            });
            if (artist) {
                return artist;
            } else {
                console.log('Artist with id ' + id + ' does not exist')
            }
        } catch (error) {
            console.log('An error has occurred')
            return error.headers
        }
    }

    async updateArtist(id: string, artist_updated: ArtistModel) {
        try {
            const artist = await this.getArtistById(id);
            if (artist && artist?.type === 'Artist') {
                await couch.update('cbd', {
                    _id: id,
                    _rev: artist._rev,
                    name: artist_updated.name,
                    description: artist_updated.description,
                    genres: artist_updated.genres,
                    type: 'Artist'
                }).then((status: any) => {
                    if (status.status === 201) {
                        console.log('Artist created correctly')
                    }
                });
            } else {
                console.log('Artist with id ' + id + ' does not exist')
            }
        } catch (error) {
            console.log('An error has occurred')
        }
    }

    async deleteArtist(id: string) {
        try {
            const artist = await this.getArtistById(id);
            if (artist && artist?.type === 'Artist') {
                await couch.del('cbd', id, artist._rev).then((status: any) => {
                    if (status.status === 200) {
                        console.log('Artist deleted correctly')
                    }
                });
            } else {
                console.log('Artist with id ' + id + ' does not exist')
            }
        } catch (error) {
            console.log('An error has occurred')
        }
    }
}
