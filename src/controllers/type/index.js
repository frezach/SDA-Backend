import {
	TypeValidator
} from "../../schemas/index.js";

import {
	create,
	update,
	get,
	remove,
	getAll
} from '../factory/controller.factory.js';

export const createType = create(TypeValidator.create);
export const updateType = update(TypeValidator.update);
export const getTypes = getAll();
export const getType = get();
export const deleteType = remove();
