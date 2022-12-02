import {
  CategoryValidator
} from "../../schemas/index.js";

import {
  create,
  update,
  get,
  getAll,
  remove
} from '../factory/controller.factory.js';

export const createCategory = create(CategoryValidator.create);
export const updateCategory = update(CategoryValidator.update);
export const getCategories = getAll();
export const getCategory = get();
export const deleteCategory = remove();
