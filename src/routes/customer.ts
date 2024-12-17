import { paths } from '@config';
import { customerController } from '@controllers';
import express from 'express';

const router = express.Router();

router.route(paths.app.customer).post(async (req, res) => {
  await customerController.addCustomer(req, res);
});

router.route(`${paths.app.customer}/:id`).get(async (req, res) => {
  await customerController.getCustomers(req, res);
});

router.route(paths.app.customer).get(async (req, res) => {
  await customerController.getCustomer(req, res);
});

router.route(`${paths.app.customer}/:id`).patch(async (req, res) => {
  await customerController.updateCustomer(req, res);
});

router.route(`${paths.app.customer}/:id`).delete(async (req, res) => {
  await customerController.deleteCustomer(req, res);
});

export const customerRoutes = router;
