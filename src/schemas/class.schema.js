import Joi from "joi";

import {
  validate_joi_result,
} from "../libs/utils.js";

import {
  nameSchema,
  timeSchema,
	KeySchema,
	relation
} from './common.schema.js';
import { media } from "./media.schema.js";

export const schema = (updating = false) => Joi.object({
	PK: KeySchema,
	SK: KeySchema,
	title: updating? nameSchema : nameSchema.required(),
	hot: updating ? Joi.boolean() :  Joi.boolean().required(),
	videoOfWeek: updating ? Joi.boolean() : Joi.boolean().required(),
	duration: updating ? timeSchema : timeSchema.required(),
	level: updating ? Joi.number().integer().min(1).max(3) : Joi.number().integer().min(1).max(3).required(),
	difficultyLevel: updating ? Joi.number().integer().min(1).max(100) :Joi.number().integer().min(1).max(100).required(),
	thumbnail: updating ? media: media.required(),
	preview: updating ? media : media.required(),
	video: updating ? media : media.required(),
	premium: updating ? Joi.boolean() : Joi.boolean().required(),
	relations: relation({
		required: [
			'section',
			'choreographer',
			'type',
			'instructor',
		],
		optional: ['category']
	}, updating)
})

export const create = (body) => {
  const result = schema().validate(body);
  validate_joi_result(result);
}
export const update = (body) => {
  const result = schema(true).validate(body);
  validate_joi_result(result);
}
