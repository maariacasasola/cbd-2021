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
                if (res?.data?.docs) {
                    const ret: GenreModel[] = res?.data?.docs as GenreModel[];
                    return ret;
                } else {
                    return 'There are not any genres';
                }
            });
            if (res.length !== 0) {
                return res;
            } else {
                return 'There are not any genres';
            }
        } catch (error) {
            return 'An error has occurred';
        }
    }

    async addGenre(genre: GenreModel) {
        try {
            const newGenre = await couch.insert('cbd', {
                name: genre?.name,
                description: genre?.description,
                type: 'Genre'
            }).then((status: any) => {
                if (status.status === 201) {
                    return 'Genre created correctly';
                }
            });
            return newGenre;
        } catch (error) {
            return 'An error has occurred';
        }
    }

    async getGenreById(id: string) {
        try {
            const genre: GenreModel = await couch.get('cbd', id).then(
                (data: any) => {
                    let obj: GenreModel = data?.data;
                    if (obj?.type === 'Genre') {
                        return obj;
                    } else {
                        return 'Genre with id ' + id + ' does not exist';
                    }
                }
            ).catch((error: Error) => {
                return 'Genre with id ' + id + ' does not exist';
            });
            if (genre) {
                return genre;
            } else {
                return 'Genre with id ' + id + ' does not exist';
            }
        } catch (error) {
            return error?.headers;
        }
    }

    async updateGenre(id: string, genre_updated: GenreModel) {
        try {
            const genre = await this.getGenreById(id);
            if (genre && genre?.type === 'Genre') {
                const updated = await couch.update('cbd', {
                    _id: id,
                    _rev: genre?._rev,
                    name: genre_updated?.name,
                    description: genre_updated?.description,
                    type: 'Genre'
                }).then((status: any) => {
                    if (status.status === 201) {
                        return 'Genre updated correctly';
                    }
                });
                return updated;
            } else {
                return 'Genre with id ' + id + ' does not exist';
            }
        } catch (error) {
            return 'An error has occurred';
        }
    }

    async deleteGenre(id: string) {
        try {
            const genre = await this.getGenreById(id);
            if (genre && genre?.type === 'Genre') {
                const e = await couch.del('cbd', id, genre?._rev).then((status: any) => {
                    if (status?.status === 200) {
                        return 'Genre deleted correctly';
                    }
                });
                return genre;
            } else {
                return 'Genre with id ' + id + ' does not exist';
            }
        } catch (error) {
            return 'An error has occurred';
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
            const genre = await this.getGenreById(genre_id);
            if (genre && genre?.type === 'Genre') {
                const res = await couch.mango('cbd', mangoQuery, parameters).then((data: any) => {
                    const res = JSON.parse(JSON.stringify(data));
                    console.log(res)
                    if (res?.data?.docs) {
                        const ret: ArtistModel[] = res?.data?.docs as ArtistModel[];
                        return ret.filter(artist=>artist?.genres.includes(genre_id));
                    } else {
                        return 'There are not any artists for the genre with id ' + genre_id;
                    }
                });
                if (res.length !== 0) {
                    return res;
                } else {
                    console.log('2')
                    return 'There are not any artists for the genre with id ' + genre_id;
                }
            } else {
                return 'Artist with id ' + genre_id + ' does not exist';
            }
        } catch (error) {
            return 'An error occurred';
        }
    }
}