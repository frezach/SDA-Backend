import {
	SectionValidator
} from "../../schemas/index.js";

import {
	create,
	update,
	get,
	getAll,
	remove
} from '../factory/controller.factory.js';

export const createSection = create(SectionValidator.create);
export const updateSection = update(SectionValidator.update);
export const getSections = getAll();
export const getSection = get();
export const deleteSection = remove();
