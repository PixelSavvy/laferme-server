import { paths } from '@/config';
import { distributionController } from '@/controllers';
import express from 'express';

const router = express.Router();

router.route(`${paths.app.distribution}/:id`).get(async (req, res) => {
  await distributionController.getDistributionItem(req, res);
});

router.route(`${paths.app.distribution}/:id`).patch(async (req, res) => {
  await distributionController.updateDistributionItem(req, res);
});

router.route(paths.app.distribution).get(async (req, res) => {
  await distributionController.getDistributionItems(req, res);
});

export const distributionRoutes = router;
