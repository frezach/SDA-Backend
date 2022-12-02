import Joi from "joi";

import {
	validate_joi_result,
} from "../libs/utils.js";

import {
	KeySchema
} from "./common.schema.js";

const status = Joi.string().valid('pending', 'complete', 'verifying')

export const schema = (updating = false) => Joi.object({
	// User ID
	PK: KeySchema,
	// Transaction ID
	SK: KeySchema,
	status: updating ? status : status.required(),
	amount: updating ? Joi.number() : Joi.number().required()
})

export const create = (body) => {
	const result = schema().validate(body);
	validate_joi_result(result);
}
export const update = (body) => {
	const result = schema(true).validate(body);
	validate_joi_result(result);
}
