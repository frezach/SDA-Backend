import {
	FavoriteValidator
} from "../../schemas/index.js";

import {
	create,
	update,
	get,
	remove,
	getAll
} from '../factory/controller.factory.js';

export const createFavorite = create(FavoriteValidator.create);
export const updateFavorite = update(FavoriteValidator.update);
export const getFavorites = getAll();
export const getFavorite = get();
export const deleteFavorite = remove();
