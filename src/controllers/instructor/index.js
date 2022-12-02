import {
	InstructorValidator
} from "../../schemas/index.js";

import {
	create,
	update,
	get,
	remove,
	getAll
} from '../factory/controller.factory.js';

export const createInstructor = create(InstructorValidator.create);
export const updateInstructor = update(InstructorValidator.update);
export const getInstructors = getAll();
export const getInstructor = get();
export const deleteInstructor = remove();
