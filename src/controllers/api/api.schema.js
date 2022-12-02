import Joi from 'joi';
import _ from 'lodash';

export const ExtendedKeySchema = Joi.string().pattern(/^[a-zA-Z-]*\b-[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
const Text = Joi.string().max(255)

export const like = Joi.object({
	id: ExtendedKeySchema.required()
})

export const playlist = (updating = false) = Joi.object({
	name: updating ? Text : Text.required()
})
