import 'reflect-metadata';
import { injectable } from 'inversify';
import { ArtistModel } from '../models/artist.model';
import { couch } from '../../index'

@injectable()
export class ArtistsService {
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
                return ret;
            });
            return res;

        } catch (error) {
            return error.headers
        }
    }

    async addArtist(artist: ArtistModel) {
        try {
            await couch.insert('cbd', {
                name: artist.name,
                description: artist.description,
                genres: artist.genres,
                tracks: artist.tracks
            }).then((data: any) => {
                console.log(data)
            }).catch(((error: Error) => {
                return error.message
            }));
        } catch (error) {
            console.log("Error al crear el artista")
            console.log(error)
        }
    }

    async getArtistById(id: string) {
        try {
            const artist = await couch.get('cbd', id).then(
                (data: any) => {
                    let obj: ArtistModel = data.data;
                    return obj;
                }
            ).catch((error: Error) => {
                console.log('Artist with id ' + id + ' does not exist')
                return error.message
            });
            return artist;
        } catch (error) {
            console.log('Artist with id ' + id + ' does not exist')
            return error.headers
        }
    }

    async updateArtist(id: string, artist_updated: ArtistModel) {
        try {
            const artist = await this.getArtistById(id);
            await couch.update('cbd', {
                _id: id,
                _rev: artist._rev,
                name: artist_updated.name,
                description: artist_updated.description,
                genres: artist_updated.genres,
                tracks: artist_updated.tracks
            }).then((data: any) => {
                console.log('Artist updated correctly')
            });
        } catch (error) {
            console.log(error)
        }
    }

    async deleteArtist(id: string) {
        try {
            const artist = await this.getArtistById(id);
            await couch.del('cbd', id, artist._rev).then((data: any) => {
                console.log('Artist deleted correcly')
            });
        } catch (error) {
            console.log(error)
        }
    }
}
