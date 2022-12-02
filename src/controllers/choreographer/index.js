import {
  ChoreographerValidator
} from "../../schemas/index.js";

import {
  create,
  update,
  get,
  getAll,
  remove
} from '../factory/controller.factory.js';

export const createChoreographer = create(ChoreographerValidator.create);
export const updateChoreographer = update(ChoreographerValidator.update);
export const getChoreographers = getAll();
export const getChoreographer = get();
export const deleteChoreographer = remove();
