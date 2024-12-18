"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const _helpers_1 = require("@helpers");
const _services_1 = require("@services");
const _validations_1 = require("@validations");
const getProducts = async (req, res) => {
    try {
        const foundProducts = await _services_1.productServices.getProducts(req, res);
        if (!foundProducts.length)
            return (0, _helpers_1.sendResponse)(res, 200, 'პროდუქტები ვერ მოიძებნა', []);
        return (0, _helpers_1.sendResponse)(res, 200, 'პროდუქტები წარმატებით მოიძებნა', foundProducts);
    }
    catch (error) {
        console.error(error);
        return (0, _helpers_1.sendResponse)(res, 505, 'შეცდომა პროდუქტების ძებნისას', error);
    }
};
const getProduct = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        const foundProduct = await _services_1.productServices.getProduct(req, res, id);
        if (!foundProduct)
            return (0, _helpers_1.sendResponse)(res, 404, 'პროდუქტი ვერ მოიძებნა', {});
        return (0, _helpers_1.sendResponse)(res, 200, 'პროდუქტი წარმატებით მოიძებნა', foundProduct);
    }
    catch (error) {
        console.error(error);
        return (0, _helpers_1.sendResponse)(res, 505, 'შეცდომა პროდუქტის ძებნისას', error);
    }
};
const addProduct = async (req, res) => {
    // Extract data from the server
    const data = req.body;
    // Parse data
    const parsedData = _validations_1.newProductSchema.safeParse(data);
    // If the data does not match the schema, return server error to the clinet
    if (!parsedData.success)
        return (0, _helpers_1.sendResponse)(res, 400, 'Validation error', parsedData.error.format());
    // If the data parsed successfully, follow the addProduct service
    try {
        // Add a new product
        const result = await _services_1.productServices.addProduct(req, res, parsedData.data);
        // If the product was not added (wrong input)
        if (result.exists)
            return (0, _helpers_1.sendResponse)(res, 409, 'პროდუქტი მსგავსი პროდუქტის კოდით არსებობს');
        // If product added successfully
        return (0, _helpers_1.sendResponse)(res, 201, 'პროდუქტი წარმატებით დაემატა', result.product);
    }
    catch (error) {
        console.error('Error adding a product:', error);
        return (0, _helpers_1.sendResponse)(res, 500, 'შეცდომა პროდუქტის შექმნისას', error);
    }
};
const updateProduct = async (req, res) => {
    const data = req.body;
    const parsedData = _validations_1.productSchema.safeParse(data);
    if (!parsedData.success)
        return (0, _helpers_1.sendResponse)(res, 400, 'Validation error', parsedData.error.format());
    try {
        const updatedProduct = await _services_1.productServices.updateProduct(req, res, parsedData.data);
        if (!updatedProduct.exists)
            return (0, _helpers_1.sendResponse)(res, 404, 'პროდუქტი მსგავსი საიდენტიფიკაციო კოდით ვერ მოიძებნა', updatedProduct.product);
        return (0, _helpers_1.sendResponse)(res, 200, 'პროდუქტი წარმატებით განახლდა', updatedProduct);
    }
    catch (error) {
        console.error(error);
        return (0, _helpers_1.sendResponse)(res, 505, 'შეცდომა პროდუქტის რედაქტირებისას', error);
    }
};
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await _services_1.productServices.deleteProduct(req, res, id);
    }
    catch (error) {
        console.error(error);
        return (0, _helpers_1.sendResponse)(res, 505, 'შეცდომა პროდუქტის წაშლისას', error);
    }
};
exports.productController = {
    addProduct,
    getProducts,
    deleteProduct,
    updateProduct,
    getProduct,
};
//# sourceMappingURL=product.js.map