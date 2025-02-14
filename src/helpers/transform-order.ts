export const transformOrders = (orders: any) => {
  // Normalize to an array for consistent processing
  const orderArray = Array.isArray(orders) ? orders : [orders];

  // Transform products for each order
  const transformedOrders = orderArray.map((order) => {
    const { products, ...rest } = order.toJSON ? order.toJSON() : order; // Handle Sequelize instances

    const transformedProducts = (products || []).map((product: any) => {
      const { orderDetails, ...productRest } = product;

      return {
        ...productRest,
        ...orderDetails, // Flatten orderDetails into product
      };
    });

    return {
      ...rest,
      products: transformedProducts,
    };
  });

  // Return a single transformed object if the input was not an array
  return Array.isArray(orders) ? transformedOrders : transformedOrders[0];
};

export const calculateOrderTotal = (order: any) => {
  if (!order || !order.products || !Array.isArray(order.products)) {
    throw new Error("Invalid order or products data");
  }

  // Determine the weight field to use based on the stage
  const weightField = order.stage === "CLEANZONE" ? "preparedWeight" : order.stage === "DELIVERED" && "distributedWeight";

  if (!weightField) return;

  // Calculate the total as the sum of price * weightField for each product
  const total = order.products.reduce((sum: number, product: any) => {
    const price = product.price;
    const weight = product[weightField];

    return sum + price * weight;
  }, 0);

  // Update the order's total
  order.total = total;

  return order;
};
