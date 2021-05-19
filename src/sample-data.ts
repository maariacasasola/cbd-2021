import { injectable } from "inversify";
import { couch } from ".";

@injectable()
export class loadData {
    async loadArtists() {
        try {
            await couch.insert('cbd', {
                name: 'Rihanna',
                description: 'Singer, businesswoman, fashion designer, actress, diplomat, writer, dancer and philanthropist.',
                genres: '[\"Pop\",\"R&B\", \"Reggae\", \"Techno\"]',
                type: 'Artist'
            });

            await couch.insert('cbd', {
                name: 'La Oreja de Van Gogh',
                description: 'Musical group of pop-rock genre from San Sebastián, País Vasco, Spain.',
                genres: '[\"Pop\",\"Rock\"]',
                type: 'Artist'
            });

            await couch.insert('cbd', {
                name: 'Estopa',
                description: 'Spanish duo of Catalan rumba formed by the brothers David and José Manuel Muñoz.',
                genres: '[\"Pop rock\", \"Rumba catalana\"]',
                type: 'Artist'
            });

            await couch.insert('cbd', {
                name: 'Eminem',
                description: 'American rapper, singer, record producer and actor.',
                genres: '[\"Rap\", \"Hip Hop\", \"Trap\"]',
                type: 'Artist'
            });

        } catch (error) {
            console.log('An error has occurred loading artists data')
        }
    }

    async loadTracks() {
        try {
            await couch.insert("cbd", {
                title: 'Man down',
                url: 'https://www.youtube.com/watch?v=sEhy-RXkNo0',
                artist: this.getArtistId('Rihanna'),
                type: 'Track'
            });
        } catch (error) {
            console.log('An error has occurred loading tracks data')
        }
    }

    async getArtistId(name: string) {
        const mangoQuery = {
            selector: {
                type: 'Artist'
            }
        };
        const parameters = {};
        try {
            const artists = await couch.mango('cbd', mangoQuery, parameters);
            for (let a of artists) {
                if (name === a.name) {
                    return a._id
                } else {
                    return 'No artist data'
                }
            }
        } catch {
            console.log('An error has occurred retrieving data')
        }
    }
}