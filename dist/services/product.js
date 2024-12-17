"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productServices = void 0;
const helpers_1 = require("@/helpers");
const lib_1 = require("@/lib");
const models_1 = require("@/models");
const addProduct = async (req, res, data) => {
    const transaction = await lib_1.sequelize.transaction();
    try {
        const existingProduct = await models_1.Product.findOne({
            where: {
                productCode: data.productCode,
            },
            transaction,
        });
        if (existingProduct) {
            await transaction.rollback();
            return {
                exists: true,
                product: existingProduct,
            };
        }
        const newProduct = await models_1.Product.create(data);
        return {
            exists: false,
            product: newProduct,
        };
    }
    catch (error) {
        console.error('Error creating product:', error);
        throw new Error('Failed to create product');
    }
};
const getProducts = async (req, res) => {
    try {
        const foundProduct = await models_1.Product.findAll();
        return foundProduct;
    }
    catch (error) {
        throw error;
    }
};
const getProduct = async (req, res, id) => {
    try {
        const foundProduct = await models_1.Product.findByPk(id);
        return foundProduct;
    }
    catch (error) {
        throw error;
    }
};
const deleteProduct = async (req, res, id) => {
    const transaction = await lib_1.sequelize.transaction();
    try {
        const foundProduct = await models_1.Product.findByPk(id, { transaction });
        if (!foundProduct) {
            await transaction.rollback();
            return (0, helpers_1.sendResponse)(res, 404, 'პროდუქტი მსგავსი საიდენტიფიკაციო კოდით ვერ მოიძებნა!');
        }
        await foundProduct.destroy({ transaction });
        // Verify the product is no longer in the database
        const checkDeleted = await models_1.Product.findByPk(id, { transaction });
        if (checkDeleted) {
            await transaction.rollback();
            return (0, helpers_1.sendResponse)(res, 500, 'პროდუქტის წაშლა ვერ მოხერხდა!');
        }
        await transaction.commit();
        return (0, helpers_1.sendResponse)(res, 200, 'პროდუქტი წარმატებით წაიშალა!');
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
const updateProduct = async (req, res, data) => {
    const transaction = await lib_1.sequelize.transaction();
    try {
        const existingProduct = await models_1.Product.findByPk(data.id, {
            transaction,
        });
        if (!existingProduct)
            return {
                exists: false,
                product: existingProduct,
            };
        const updatedProduct = await existingProduct.update(data, {
            transaction,
        });
        await transaction.commit();
        return {
            exists: true,
            product: updatedProduct,
        };
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.productServices = {
    addProduct,
    getProducts,
    deleteProduct,
    updateProduct,
    getProduct,
};
//# sourceMappingURL=product.js.map