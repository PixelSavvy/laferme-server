export const paymentOptions = ["CASH", "CONSIGNMENT", "TRANSFER", "TRIAL", "DISCOUNT"] as [string, ...string[]];

export const priceIndex = ["TR1", "TR2", "TR3", "TR4", "TR5", "TRD", "TRC"] as [string, ...string[]];

export const statuses = {
  order: {
    ACCEPTED: "1000",
    PREPARING: "1001",
    PREPARED: "1002",
    READYTODELIVER: "1003",
    DELIVERING: "1004",
    DELIVERED: "1005",
    CANCELLED: "1006",
    RETURNED: "1007",
  },
  freezone: {
    ACCEPTED: "1000",
    PREPARING: "1001",
    PREPARED: "1002",
  },

  distribution: {
    READYTODELIVER: "1003",
    DELIVERING: "1004",
    DELIVERED: "1005",
    CANCELLED: "1006",
    RETURNED: "1007",
  },
};

export const orderStatuses = Object.values(statuses.order) as [string, ...string[]];

export const freezoneStatuses = Object.values(statuses.freezone) as [string, ...string[]];

export const distributionStatuses = Object.values(statuses.distribution) as [string, ...string[]];
