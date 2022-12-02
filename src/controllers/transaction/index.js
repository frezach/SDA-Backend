import {
	TransactionValidator
} from "../../schemas/index.js";

import {
	create,
	update,
	get,
	remove,
	getAll
} from '../factory/controller.factory.js';

export const createTransaction = create(TransactionValidator.create);
export const updateTransaction = update(TransactionValidator.update);
export const getTransactions = getAll();
export const getTransaction = get();
export const deleteTransaction = remove();
