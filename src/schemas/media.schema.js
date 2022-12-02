import Joi from "joi";

import {
	validate_joi_result,
} from "../libs/utils.js";

import {
	FileKeySchema,
} from "./common.schema.js";

export const buckets = {
	asset: `vod-assets-${process.env.STAGE}`,
	preview: `vod-preview-${process.env.STAGE}`,
	original: `vod-original-${process.env.STAGE}`,
}

export const media = Joi.object({
	type: Joi.string().valid(...Object.keys(buckets)).required(),
	file: FileKeySchema.required()
})

export const schema = (updating = false) => Joi.alternatives().try(
	media,
	Joi.array().items(media).max(5)
).required();

export const create = (body) => {
	const result = schema().validate(body);
	validate_joi_result(result);
}
export const update = (body) => {
	const result = schema(true).validate(body);
	validate_joi_result(result);
}
