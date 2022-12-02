import {
	PlanValidator
} from "../../schemas/index.js";

import {
	create,
	update,
	get,
	getAll,
	remove
} from '../factory/controller.factory.js';

export const createPlan = create(PlanValidator.create);
export const updatePlan = update(PlanValidator.update);
export const getPlans = getAll();
export const getPlan = get();
export const deletePlan = remove();
