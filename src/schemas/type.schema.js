import Joi from "joi";

import {
	validate_joi_result,
} from "../libs/utils.js";

import {
	KeySchema,
	nameSchema
} from "./common.schema.js";

export const schema = (updating = false) => Joi.object({
	// Type ID
	PK: KeySchema,
	// Primary Metadata
	SK: KeySchema,
	name: updating ? nameSchema : nameSchema.required(),
	status: updating ? Joi.boolean() : Joi.boolean().required()
})

export const create = (body) => {
	const result = schema().validate(body);
	validate_joi_result(result);
}
export const update = (body) => {
	const result = schema(true).validate(body);
	validate_joi_result(result);
}
