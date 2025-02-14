// Payment methods
export const paymentMethodsObj = {
  CASH: "CASH",
  CONSIGNMENT: "CONSIGNMENT",
  TRANSFER: "TRANSFER",
  TRIAL: "TRIAL",
  DISCOUNT: "DISCOUNT",
};

export const paymentMethods = Object.values(paymentMethodsObj) as [string, ...string[]];

// Price indexes
export const priceIndex = ["TR1", "TR2", "TR3", "TR4", "TR5", "TRD", "TRC"] as [string, ...string[]];

// Order stages
export const stagesObj = {
  ALL: "ALL",
  ORDER: "ORDER",
  CLEANZONE: "CLEANZONE",
  DISTRIBUTION: "DISTRIBUTION",
  DELIVERED: "DELIVERED",
};

export const stages = Object.values(stagesObj) as [string, ...string[]];

// Customer types
export const customerTypesObj = {
  INDIVIDUAL: "INDIVIDUAL",
  SOLE_SMALL: "SOLE_SMALL",
  SOLE_STANDARD: "SOLE_STANDARD",
  LLC: "LLC",
};

export const customerTypes = Object.values(customerTypesObj) as [string, ...string[]];

// Order statuses
export const statusesObj = {
  order: {
    ACCEPTED: "ACCEPTED",
    PREPARING: "PREPARING",
    PREPARED: "PREPARED",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
    RETURNED: "RETURNED",
  },
  cleanZone: {
    ACCEPTED: "ACCEPTED",
    PREPARING: "PREPARING",
    PREPARED: "PREPARED",
    CANCELLED: "CANCELLED",
  },

  distribution: {
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
    RETURNED: "RETURNED",
  },
};

export const orderStatuses = Object.values(statusesObj.order) as [string, ...string[]];
export const cleanZoneStatuses = Object.values(statusesObj.cleanZone) as [string, ...string[]];
export const distributionStatuses = Object.values(statusesObj.distribution) as [string, ...string[]];
