import {
	WatchlistValidator
} from "../../schemas/index.js";

import {
	create,
	update,
	get,
	remove,
	getAll
} from '../factory/controller.factory.js';

export const createWatchlist = create(WatchlistValidator.create);
export const updateWatchlist = update(WatchlistValidator.update);
export const getWatchlists = getAll();
export const getWatchlist = get();
export const deleteWatchlist = remove();
