export const paymentOptions: { [key: number]: string } = {
  2000: 'CASH',
  2001: 'CONSIGNMENT',
  2002: 'TRANSFER',
  2003: 'TRIAL',
  2004: 'DISCOUNT',
};

export const orderStatus: { [key: number]: string } = {
  3000: 'PREPARING',
  3001: 'PREPARED',
  3002: 'CANCELLED',
  3003: 'RETURNED',
};

export const distributionStatus: { [key: number]: string } = {
  3000: 'TODELIVER',
  3001: 'DELIVERING',
  3002: 'DELIVERED',
};

export const priceIndex: { [key: number]: string } = {
  1: 'TR1',
  2: 'TR2',
  3: 'TR3',
  4: 'TR4',
  5: 'TR5',
  6: 'TRC',
  7: 'TRD',
};
