"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerServices = void 0;
const _models_1 = require("@models");
const _helpers_1 = require("@helpers");
const _lib_1 = require("@lib");
const sequelize_1 = require("sequelize");
const addCustomer = async (req, res, data) => {
    const transaction = await _lib_1.sequelize.transaction();
    try {
        // Check if the customer with the same email already exists
        const existingCustomer = await _models_1.Customer.findOne({
            where: {
                email: data.email,
            },
            transaction,
        });
        if (existingCustomer) {
            await transaction.rollback();
            return {
                success: true,
                customer: existingCustomer,
            };
        }
        // If the products array is not empty, check if the products exist
        let existingProducts = [];
        if (data.products && data.products.length > 0) {
            const productIds = data.products.map((product) => product.id);
            existingProducts = await _models_1.Product.findAll({
                where: {
                    id: {
                        [sequelize_1.Op.in]: productIds,
                    },
                },
                transaction,
            });
        }
        // If the customer with the same email does not exist and the products exist
        const newCustomer = await _models_1.Customer.create(data);
        // Associate customer products with the newly create customer
        await newCustomer.setProducts(existingProducts);
        await transaction.commit();
        return {
            exists: false,
            customer: newCustomer,
        };
    }
    catch (error) {
        await transaction.rollback();
        console.log('Failed to add a customer', error);
        throw new Error('Failed to create customer');
    }
};
const getCustomers = async (req, res) => {
    try {
        const foundCustomer = await _models_1.Customer.findAll({
            include: [
                {
                    model: _models_1.Product,
                    as: 'products',
                    through: {
                        attributes: [],
                    },
                },
            ],
            nest: true,
        });
        return foundCustomer;
    }
    catch (error) {
        throw error;
    }
};
const getCustomer = async (req, res) => {
    try {
        const foundCustomer = await _models_1.Customer.findAll({
            include: [
                {
                    model: _models_1.Product,
                    as: 'products',
                    through: {
                        attributes: [],
                    },
                },
            ],
            nest: true,
        });
        return foundCustomer;
    }
    catch (error) {
        throw error;
    }
};
const updateCustomer = async (data) => {
    const transaction = await _lib_1.sequelize.transaction();
    try {
        const existingCustomer = await _models_1.Customer.findByPk(data.id, { transaction });
        if (!existingCustomer) {
            await transaction.rollback();
            return { exists: false, customer: null };
        }
        const updatedCustomer = await existingCustomer.update(data, { transaction });
        let existingProducts = [];
        if (data.products && data.products.length > 0) {
            const productIds = data.products.map((product) => product.id);
            existingProducts = await _models_1.Product.findAll({
                where: { id: { [sequelize_1.Op.in]: productIds } },
                transaction,
            });
            if (existingProducts.length !== data.products.length) {
                await transaction.rollback();
                return { exists: false, customer: null };
            }
        }
        // Associate customer products with the newly updated customer
        await updatedCustomer.setProducts(existingProducts);
        await transaction.commit();
        return { exists: true, customer: updatedCustomer };
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
const deleteCustomer = async (req, res, id) => {
    const transaction = await _lib_1.sequelize.transaction();
    try {
        const foundCustomer = await _models_1.Customer.findByPk(id, { transaction });
        if (!foundCustomer) {
            await transaction.rollback();
            return (0, _helpers_1.sendResponse)(res, 404, 'სარეალიზაციო პუნქტი მსგავსი საიდენტიფიკაციო კოდით ვერ მოიძებნა!');
        }
        await foundCustomer.destroy({ transaction });
        // Verify the customer is no longer in the database
        const checkDeleted = await _models_1.Customer.findByPk(id, { transaction });
        if (checkDeleted) {
            await transaction.rollback();
            return (0, _helpers_1.sendResponse)(res, 500, 'სარეალიზაციო პუნქტის წაშლა ვერ მოხერხდა!');
        }
        await transaction.commit();
        return (0, _helpers_1.sendResponse)(res, 200, 'სარეალიზაციო პუნქტი წარმატებით წაიშალა!');
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.customerServices = {
    addCustomer,
    getCustomers,
    updateCustomer,
    deleteCustomer,
    getCustomer,
};
//# sourceMappingURL=customer.js.map