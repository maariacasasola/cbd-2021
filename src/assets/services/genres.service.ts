import 'reflect-metadata';
import { injectable } from 'inversify';
import { GenreModel } from '../models/genre.model';
import { couch } from '../../index'
import { ArtistModel } from '../models/artist.model';

@injectable()
export class GenresService {
    async getGenres() {
        const mangoQuery = {
            selector: {
                type: 'Genre'
            }
        };
        const parameters = {};
        try {
            const res = await couch.mango('cbd', mangoQuery, parameters).then((data: any) => {
                const res = JSON.parse(JSON.stringify(data));
                if (res) {
                    const ret: GenreModel[] = res.data.docs as GenreModel[];
                    return ret;
                } else {
                    console.log('There are not any genres')
                }
            });
            if (res) {
                return res;
            } else {
                console.log('There are not any genres')
            }
        } catch (error) {
            console.log('An error has occurred')
            return error.headers
        }
    }

    async addGenre(genre: GenreModel) {
        try {
            await couch.insert('cbd', {
                name: genre.name,
                description: genre.description,
                type: 'Genre'
            }).then((status: any) => {
                if (status.status === 201) {
                    console.log('Genre created correctly')
                }
            });
        } catch (error) {
            console.log('An error has occurred')
        }
    }

    async getGenreById(id: string) {
        try {
            const genre: GenreModel = await couch.get('cbd', id).then(
                (data: any) => {
                    let obj: GenreModel = data.data;
                    if (obj?.type === 'Genre') {
                        return obj;
                    } else {
                        console.log('Genre with id ' + id + ' does not exist')
                    }
                }
            ).catch((error: Error) => {
                console.log('Genre with id ' + id + ' does not exist')
                return error.message
            });
            if (genre) {
                return genre;
            } else {
                console.log('Genre with id ' + id + ' does not exist')
            }
        } catch (error) {
            console.log('An error has occurred')
            return error.headers
        }
    }

    async updateGenre(id: string, genre_updated: GenreModel) {
        try {
            const genre = await this.getGenreById(id);
            if (genre && genre?.type === 'Genre') {
                await couch.update('cbd', {
                    _id: id,
                    _rev: genre._rev,
                    name: genre_updated.name,
                    description: genre_updated.description,
                    type: 'Genre'
                }).then((status: any) => {
                    if (status.status === 201) {
                        console.log('Genre created correctly')
                    }
                });
            } else {
                console.log('Genre with id ' + id + ' does not exist')
            }
        } catch (error) {
            console.log('An error has occurred')
        }
    }

    async deleteGenre(id: string) {
        try {
            const genre = await this.getGenreById(id);
            if (genre && genre?.type === 'Genre') {
                await couch.del('cbd', id, genre._rev).then((status: any) => {
                    if (status.status === 200) {
                        console.log('Genre deleted correctly')
                    }
                });
            } else {
                console.log('Genre with id ' + id + ' does not exist')
            }
        } catch (error) {
            console.log('An error has occurred')
        }
    }

    async getGenreArtists(genre_id: string) {
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
                    return ret.filter(artist=>artist?.genres.includes(genre_id));
                } else {
                    console.log('There are not any artists for the genre with id ' + genre_id)
                }
            });
            if (res) {
                return res;
            } else {
                console.log('There are not any artists for the genre with id ' + genre_id)
            }
        } catch (error) {
            console.log('An error has occurred')
            return error.headers
        }
    }
}
