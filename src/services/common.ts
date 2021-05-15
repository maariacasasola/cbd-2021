
import * as nano from 'nano';
import * as config from 'config';
import { EnvConstants } from '../util/env.constant';

const trackDBOpts = {
    url: config.get<string>(EnvConstants.COUCHDB_URL) + config.get<string>(EnvConstants.DATABASE_TRACK)
};
export const trackDB: any = nano(trackDBOpts);

export const couchDB: any = nano({
    url: config.get(EnvConstants.COUCHDB_URL)
});