import Joi from "joi";

import {
  validate_joi_result,
} from "../libs/utils.js";

import {
  KeySchema,
  nameSchema,
  relation,
} from "./common.schema.js";

export const schema = (updating = false) => Joi.object({
  // Set ID
  PK: KeySchema,
  // Primary Metadata
  SK: KeySchema,
  title: updating ? nameSchema : nameSchema.required(),
  status: updating ? Joi.boolean() : Joi.boolean().required(),
  relations: relation({
		required: ['class'],
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
