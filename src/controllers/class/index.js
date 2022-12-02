import {
  ClassValidator
} from "../../schemas/index.js";

import {
  create,
  update,
  get,
  getAll,
  remove
} from '../factory/controller.factory.js';

export const createClass = create(ClassValidator.create);
export const updateClass = update(ClassValidator.update);
export const getClasses = getAll();
export const getClass = get();
export const deleteClass = remove();
