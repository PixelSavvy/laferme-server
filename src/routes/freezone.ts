import { paths } from '@config';
import { freezoneController } from '@controllers';
import express from 'express';

const router = express.Router();

router.route(`${paths.app.freezone}/:id`).get(async (req, res) => {
  await freezoneController.getFreezoneItem(req, res);
});

router.route(paths.app.freezone).get(async (req, res) => {
  await freezoneController.getFreezoneItems(req, res);
});

router.route(`${paths.app.freezone}/:id`).patch(async (req, res) => {
  await freezoneController.updateFreezoneItem(req, res);
});

export const freezoneRoutes = router;
