import ExcelJS from "exceljs";
import { Response } from "express";

import { stagesObj, statusCodes } from "@/config";
import { formatExcelFile, transformOrders } from "@/helpers";
import { sequelize } from "@/lib";
import { Customer, Order, Product } from "@/models";
import { Op } from "sequelize";

const getOrders = async (res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    const orders = await Order.findAll({
      transaction,
    });

    if (!orders.length) {
      await transaction.rollback();
      return res.status(statusCodes.NO_CONTENT).send();
    }

    // Create a new workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("შეკვეთები");

    // Define the columns
    worksheet.columns = [
      { header: "id", key: "id", width: 10 },
      {
        header: "შექმნის თარიღი",
        key: "createdAt",
        width: 15,
      },
      {
        header: "მომზადების თარიღი",
        key: "prepareDueAt",
        width: 15,
      },
      {
        header: "მიტანის თარიღი",
        key: "deliverDueAt",
        width: 15,
      },
      {
        header: "სარეალიზაციო პუნქტი",
        key: "customer",
      },
      {
        header: "პროდუქციის ტიპი",
        key: "product",
        width: 30,
      },
      {
        header: "რაოდენობა",
        key: "quantity",
        width: 10,
      },
      {
        header: "წონა",
        key: "weight",
        width: 10,
      },
      {
        header: "ფასი",
        key: "price",
        width: 10,
      },
      {
        header: "ანგარიშსწორების ტიპი",
        key: "paymentMethod",
        width: 15,
      },
      {
        header: "სტატუსი",
        key: "status",
        width: 15,
      },
    ];

    formatExcelFile(worksheet);

    const transformedOrders = transformOrders(orders);

    if (!Array.isArray(transformedOrders)) {
      return;
    }

    // Add rows to the worksheet
    transformedOrders.forEach((order) => {
      order.products?.forEach((product: any) => {
        worksheet.addRow({
          id: order.id,
          createdAt: order.createdAt,
          prepareDueAt: order.prepareDueAt,
          deliverDueAt: order.deliverDueAt,
          customer: order.customer?.name || "N/A",
          product: product.title || "N/A",
          quantity: product.quantity || "N/A",
          weight: product.weight || "N/A",
          price: product.price || "N/A",
          paymentMethod: order.customer?.paymentMethod || "N/A",
          status: order.status || "N/A",
        });
      });
    });

    // Set headers for download
    const fileName = "orders.xlsx";
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    // Write the workbook to the response
    await workbook.xlsx.write(res);

    await transaction.commit();

    return res.status(statusCodes.OK).end();
  } catch (error) {
    await transaction.rollback();
    console.error("Error exporting orders to excel:", error);
  }
};

const getProducts = async (res: Response) => {
  const transaction = await sequelize.transaction();

  try {
    const products = await Product.findAll({
      transaction,
    });

    if (!products.length) {
      await transaction.rollback();
      return res.status(statusCodes.NO_CONTENT).send();
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("პროდუქტები");

    worksheet.columns = [
      { header: "id", key: "id" },
      { header: "SKU", key: "productCode" },
      { header: "პროდუქციის ტიპი", key: "title" },
      {
        header: "hasVAT",
        key: "vat",
      },
      {
        header: "TR1",
        key: "tr1",
      },
      {
        header: "TR2",
        key: "tr2",
      },
      {
        header: "TR3",
        key: "tr3",
      },
      {
        header: "TR4",
        key: "tr4",
      },
      {
        header: "TR5",
        key: "tr5",
      },
      {
        header: "TRC",
        key: "trc",
      },
      {
        header: "TRD",
        key: "trd",
      },
    ];

    formatExcelFile(worksheet);

    products.forEach((product) => {
      worksheet.addRow({
        id: product.id,
        productCode: product.productCode,
        title: product.title,
        vat: product.hasVAT === "1" ? "კი" : "არა",
        tr1: product.prices.TR1,
        tr2: product.prices.TR2,
        tr3: product.prices.TR3,
        tr4: product.prices.TR4,
        tr5: product.prices.TR5,
        trc: product.prices.TRC,
        trd: product.prices.TRD,
      });
    });

    // Set headers for download
    const fileName = "products.xlsx";
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    // Write the workbook to the response
    await workbook.xlsx.write(res);

    await transaction.commit();

    return res.status(statusCodes.OK).end();
  } catch (error) {
    await transaction.rollback();
    console.error("Error exporting orders to excel:", error);
  }
};

const getCustomers = async (res: Response) => {
  const transaction = await sequelize.transaction();

  try {
    const customers = await Customer.findAll();

    if (!customers.length) {
      await transaction.rollback();
      return res.status(statusCodes.NO_CONTENT).send();
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("სარეალიზაციო პუნქტები");

    worksheet.columns = [
      { header: "id", key: "id" },
      { header: "ტიპი", key: "type" },
      { header: "დღგ-ს გადამხდელი", key: "paysVAT" },
      { header: "სახელი", key: "name" },
      { header: "პირადი ნომერი / საინდ. კოდი", key: "indetificationNumber" },
      { header: "მისამართი", key: "address" },
      { header: "ტელეფონი", key: "phone" },
      { header: "ელ.ფოსტა", key: "email" },
      { header: "საფასო ინდექსი", key: "priceIndex" },
      { header: "ზედნადები", key: "needInvoice" },
      { header: "გადახდის მეთოდი", key: "paymentOption" },
      { header: "საკონტაქტო პირი", key: "contactPersonName" },
      { header: "საკონტაქტო პირის პოზიცია", key: "contactPersonPosition" },
      { header: "საკონტაქტო პირის ნომერი", key: "contactPersonPhone" },
      { header: "საკონტაქტო პირის ელ.ფოსტა", key: "contactPersonEmail" },
    ];

    formatExcelFile(worksheet);

    customers.forEach((customer) => {
      worksheet.addRow({
        id: customer.id,
        type: customer.type,
        paysVAT: customer.paysVAT === "1" ? "კი" : "არა",
        name: customer.name,
        indetificationNumber: customer.identificationNumber,
        address: customer.address,
        phone: customer.phone,
        email: customer.email,
        priceIndex: customer.priceIndex,
        needInvoice: customer.needsInvoice === "1" ? "კი" : "არა",
        paymentMethod: customer.paymentMethod,
        contactPersonName: customer.contactPerson?.name,
        contactPersonPosition: customer.contactPerson?.position,
        contactPersonPhone: customer.contactPerson?.phone,
        contactPersonEmail: customer.contactPerson?.email,
      });
    });

    // Set headers for download

    const fileName = "customers.xlsx";
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    // Write the workbook to the response
    await workbook.xlsx.write(res);

    await transaction.commit();

    return res.status(statusCodes.OK).end();
  } catch (error) {
    await transaction.rollback();
    console.error("Error exporting customers to excel:", error);
  }
};

const getCleanzoneItems = async (res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    const orders = await Order.findAll({
      transaction,
    });

    if (!orders.length) {
      await transaction.rollback();
      return res.status(statusCodes.NO_CONTENT).send();
    }

    // Create a new workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("შეკვეთები");

    // Define the columns
    worksheet.columns = [
      { header: "id", key: "id", width: 10 },
      {
        header: "შექმნის თარიღი",
        key: "createdAt",
        width: 15,
      },
      {
        header: "მომზადების თარიღი",
        key: "prepareDueAt",
        width: 15,
      },
      {
        header: "მიტანის თარიღი",
        key: "deliverDueAt",
        width: 15,
      },
      {
        header: "სარეალიზაციო პუნქტი",
        key: "customer",
      },
      {
        header: "პროდუქციის ტიპი",
        key: "product",
        width: 30,
      },
      {
        header: "ფასი",
        key: "price",
        width: 10,
      },
      {
        header: "გამზადებული რაოდენობა",
        key: "preparedQuantity",
        width: 10,
      },
      {
        header: "გამზადებული წონა",
        key: "preparedWeight",
        width: 10,
      },
      {
        header: "ანგარიშსწორების ტიპი",
        key: "paymentMethod",
        width: 15,
      },
      {
        header: "სტატუსი",
        key: "status",
        width: 15,
      },
    ];

    formatExcelFile(worksheet);

    const transformedOrders = transformOrders(orders);

    if (!Array.isArray(transformedOrders)) {
      return;
    }

    // Add rows to the worksheet
    transformedOrders.forEach((order) => {
      order.products?.forEach((product: any) => {
        worksheet.addRow({
          id: order.id,
          createdAt: order.createdAt,
          prepareDueAt: order.prepareDueAt,
          deliverDueAt: order.deliverDueAt,
          customer: order.customer?.name || "N/A",
          product: product.title || "N/A",
          preparedQuantity: product.preparedQuantity || "N/A",
          preparedWeight: product.preparedWeight || "N/A",
          price: product.price || "N/A",
          paymentMethod: order.customer?.paymentMethod || "N/A",
          status: order.status || "N/A",
        });
      });
    });

    // Set headers for download
    const fileName = "cleanzone.xlsx";
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    // Write the workbook to the response
    await workbook.xlsx.write(res);

    await transaction.commit();

    return res.status(statusCodes.OK).end();
  } catch (error) {
    await transaction.rollback();
    console.error("Error exporting orders to excel:", error);
  }
};

const getDistributionItems = async (res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    const orders = await Order.findAll({
      where: {
        [Op.or]: [{ stage: stagesObj.DISTRIBUTION }, { stage: stagesObj.DELIVERED }],
      },
      transaction,
    });

    if (!orders.length) {
      await transaction.rollback();
      return res.status(statusCodes.NO_CONTENT).send();
    }

    // Create a new workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("შეკვეთები");

    // Define the columns
    worksheet.columns = [
      { header: "id", key: "id", width: 10 },
      {
        header: "შექმნის თარიღი",
        key: "createdAt",
        width: 15,
      },
      {
        header: "მომზადების თარიღი",
        key: "prepareDueAt",
        width: 15,
      },
      {
        header: "მიტანის თარიღი",
        key: "deliverDueAt",
        width: 15,
      },
      {
        header: "სარეალიზაციო პუნქტი",
        key: "customer",
      },
      {
        header: "პროდუქციის ტიპი",
        key: "product",
        width: 30,
      },
      {
        header: "ფასი",
        key: "price",
        width: 10,
      },

      {
        header: "გამზადებული წონა",
        key: "preparedWeight",
        width: 10,
      },
      {
        header: "მიტანილი წონა",
        key: "distributedWright",
        width: 10,
      },
      {
        header: "ჯამი",
        key: "total",
        width: 10,
      },
      {
        header: "ანგარიშსწორების ტიპი",
        key: "paymentMethod",
        width: 15,
      },
      {
        header: "სტატუსი",
        key: "status",
        width: 15,
      },
    ];

    formatExcelFile(worksheet);

    const transformedOrders = transformOrders(orders);

    if (!Array.isArray(transformedOrders)) {
      return;
    }

    // Add rows to the worksheet
    transformedOrders.forEach((order) => {
      order.products?.forEach((product: any) => {
        worksheet.addRow({
          id: order.id,
          createdAt: order.createdAt,
          prepareDueAt: order.prepareDueAt,
          deliverDueAt: order.deliverDueAt,
          customer: order.customer?.name || "N/A",
          product: product.title || "N/A",
          preparedWeight: product.preparedWeight || "N/A",
          distributedWeight: product.distributedWeight || "N/A",
          total: order.total || "N/A",
          price: product.price || "N/A",
          paymentMethod: order.customer?.paymentMethod || "N/A",
          status: order.status || "N/A",
        });
      });
    });

    // Set headers for download
    const fileName = "distribution.xlsx";
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    // Write the workbook to the response
    await workbook.xlsx.write(res);

    await transaction.commit();

    return res.status(statusCodes.OK).end();
  } catch (error) {
    await transaction.rollback();
    console.error("Error exporting orders to excel:", error);
  }
};

export const excelServices = {
  getProducts,
  getCustomers,
  getOrders,
  getCleanzoneItems,
  getDistributionItems,
};
