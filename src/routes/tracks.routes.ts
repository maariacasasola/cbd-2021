import * as express from 'express';
import { TrackController } from '../controllers/track.controller';

const trackController = new TrackController();

class BlogRoutes {
  public express;

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const router = express.Router();
    router.get('/tracks/:trackId', trackController.getTrack.bind(trackController));
    // router.post('/tracks', trackController.saveTrack.bind(trackController));
    // router.put('/tracks/:trackId/:_rev', trackController.updateTrack.bind(trackController));
    // router.delete('/tracks/:trackId/:_rev', trackController.deleteTrack.bind(trackController));
    // load routes
    this.express.use('', [
      router
    ]);
  }
}

export const blogRoutes = new BlogRoutes().express;