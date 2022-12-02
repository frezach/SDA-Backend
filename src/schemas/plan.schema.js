import Joi from "joi";

import {
  validate_joi_result,
} from "../libs/utils.js";

import {
	KeySchema,
	nameSchema
} from "./common.schema.js";

const period = Joi.string().valid("Day", "Month", "Year");
const int = Joi.number().integer();

export const schema = (updating = false) => Joi.object({
	// Plan ID
	PK: KeySchema,
	// Primary Metadata
	SK: KeySchema,
	name: updating ? nameSchema : nameSchema.required(),
	duration: updating ? int : int.required(),
	type: updating ? period : period.required(),
	status: updating ?  Joi.boolean() : Joi.boolean().required(),
	price: updating ? Joi.number() : Joi.number().required()
})

export const create = (body) => {
	const result = schema().validate(body);
	validate_joi_result(result);
}
export const update = (body) => {
	const result = schema(true).validate(body);
	validate_joi_result(result);
}
