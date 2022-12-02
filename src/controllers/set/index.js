import {
	SetValidator
} from "../../schemas/index.js";

import {
	create,
	update,
	get,
	remove,
	getAll
} from '../factory/controller.factory.js';

export const createSet = create(SetValidator.create);
export const updateSet = update(SetValidator.update);
export const getSets = getAll();
export const getSet = get();
export const deleteSet = remove();
