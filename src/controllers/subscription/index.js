import {
	SubscriptionValidator
} from "../../schemas/index.js";

import {
	create,
	update,
	get,
	remove,
	getAll
} from '../factory/controller.factory.js';

export const createSubscription = create(SubscriptionValidator.create);
export const updateSubscription = update(SubscriptionValidator.update);
export const getSubscriptions = getAll();
export const getSubscription = get();
export const deleteSubscription = remove();
