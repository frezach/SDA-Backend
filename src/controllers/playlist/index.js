import {
	PlaylistValidator
} from "../../schemas/index.js";

import {
	create,
	update,
	get,
	getAll,
	remove
} from '../factory/controller.factory.js';

export const createPlaylist = create(PlaylistValidator.create);
export const updatePlaylist = update(PlaylistValidator.update);
export const getPlaylists = getAll();
export const getPlaylist = get();
export const deletePlaylist = remove();
