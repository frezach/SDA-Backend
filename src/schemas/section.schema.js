import Joi from "joi";

import {
  validate_joi_result,
} from "../libs/utils.js";

import {
  KeySchema,
  nameSchema,
  timeSchema
} from "./common.schema.js";

export const schema = (updating = false) => Joi.object({
  // Class ID
	PK: updating ? KeySchema : KeySchema.required(),
  // Section ID
	SK: KeySchema,
	title: updating ? nameSchema : nameSchema.required(),
	status: updating ? Joi.boolean() : Joi.boolean().required(),
	start: updating ? timeSchema : timeSchema.required(),
	end: updating ? timeSchema : timeSchema.required(),
})

export const create = (body) => {
  const result = schema().validate(body);
  validate_joi_result(result);
}
export const update = (body) => {
  const result = schema(true).validate(body);
  validate_joi_result(result);
}
