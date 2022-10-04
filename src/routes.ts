import express from 'express';
import controller from './controller';

const router = express.Router();

router.get('/geoip/:ip', controller.getGeoIP);
router.get('/show-cache', controller.cache);
router.delete('/cache', controller.resetCache);

export default router;