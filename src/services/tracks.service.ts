import * as config from 'config';
import { EnvConstants } from '../util/env.constant';
import { trackDB } from '../services/common';

const TRACK_DESIGN_DOCUMENT_ID = config.get(
  EnvConstants.TRACK_DESIGN_DOCUMENT_ID
);
const TRACK_DB_INDEX_NAME = config.get(EnvConstants.TRACK_DB_INDEX_NAME);

export class TrackService {

    track(trackId: string) {
        return new Promise<any>((resolve, reject) => {
          trackDB.get(trackId).then(
            body => {
              console.log(body);
              if (body) {
                resolve(body);
              } else {
                console.log();
              }
            },
            err => {
              console.log(err);
            }
          );
        });
      }

//   saveTrack(track: any) {
//     return new Promise<any>((resolve, reject) => {
//       trackDB.insert(track).then(
//         result => {
//           resolve(result);
//         },
//         err => {
//           reject(ErrorCode.dbCommunicationErrorObj(err.message));
//         }
//       );
//     });
//   }

//   updateBlog(blogId: string, _rev: string, blog: any) {
//     return new Promise<any>((resolve, reject) => {
//       blogDB.insert({
//         ...blog,
//         _id: blogId,
//         _rev
//       }).then(
//         result => {
//           resolve(result);
//         },
//         err => {
//           reject(ErrorCode.dbCommunicationErrorObj(err.message));
//         }
//       );
//     });
//   }

//   deleteBlog(blogId: string, _rev: string) {
//     return new Promise<any>((resolve, reject) => {
//       blogDB.destroy(blogId, _rev).then(
//         result => {
//           resolve(result);
//         },
//         err => {
//           console.log(err);
//           reject(ErrorCode.dbCommunicationErrorObj(err.message));
//         }
//       );
//     });
//   }
}