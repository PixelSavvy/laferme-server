import { stagesObj, statusesObj } from "@/config";
import { Order } from "@/models";

Order.beforeCreate(async (order, { transaction }) => {
  const { customerId } = order;

  try {
    const today = new Date();
    const transformedDate = `${String(today.getDate()).padStart(2, "0")}${String(today.getMonth() + 1).padStart(2, "0")}${today.getFullYear()}`;

    const orderId = `${transformedDate}/${customerId.split("-")[0]}`;
    order.id = orderId;
  } catch (error) {
    transaction && (await transaction.rollback());
    console.error("Error creating order", error);
    throw error;
  }
});

Order.beforeUpdate(async (order, { transaction }) => {
  const { status, stage: currentStage, preparedAt, deliveredAt } = order;

  // Manually update the stage based on the status
  try {
    // If CANCELLED OR RETURNED, do not update the stage
    if (status === statusesObj.order.CANCELLED || status === statusesObj.order.RETURNED) {
      order.stage = currentStage;
      return;
    }

    if (status === statusesObj.cleanZone.PREPARING && currentStage !== stagesObj.CLEANZONE) {
      order.stage = stagesObj.CLEANZONE;
      order.updateCount += 1;
    }

    if (status === statusesObj.cleanZone.PREPARED && currentStage !== stagesObj.DISTRIBUTION) {
      order.stage = stagesObj.DISTRIBUTION;
      order.updateCount += 1;
    }

    if (status === statusesObj.distribution.DELIVERED && currentStage !== stagesObj.DELIVERED) {
      order.stage = stagesObj.DELIVERED;
    }

    // Update preparedAt and deliveredAt timestamps
    if (status === statusesObj.cleanZone.PREPARED && !preparedAt) {
      order.preparedAt = new Date();
    }

    if (status === statusesObj.distribution.DELIVERED && !deliveredAt) {
      order.deliveredAt = new Date();
    }
  } catch (error) {
    transaction && (await transaction.rollback());
    console.error("Error updating order stage", error);
    throw error;
  }
});
