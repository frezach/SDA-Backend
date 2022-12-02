import Joi from 'joi';
import _ from 'lodash';

export const imageUrlSchema = Joi.string().uri({
	relativeOnly: true
}).max(300);

export const classUrlSchema = Joi.string().uri({
	relativeOnly: true
}).max(300);

export const fullnameSchema = Joi.string().min(2).max(60);
export const descriptionSchema = Joi.string().min(2).max(300);
export const lengthSchema = Joi.number().integer().min(0).max(1000);
export const difficultySchema = Joi.number().integer().min(0).max(864000);
export const emailSchema = Joi.string().min(3).required().email();

export const KeySchema = Joi.string().pattern(/^[a-zA-Z]*\b-[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
export const FileKeySchema = Joi.string().pattern(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}.[a-zA-Z0-9]{3,7}$/);

export const nameSchema = Joi.string().min(2).max(60);

export const boolSchema = Joi.boolean();

export const timeSchema = Joi.string().pattern(/\d{2}:\d{2}:\d{2}/);

export const numSchema = Joi.number().integer().min(1).max(100);

export const levelSchema = Joi.number().integer().min(1).max(3);

export const relation = (configuration = {}, isBeingUpdated = false) => {
	const { required = [], optional = [] } = configuration
	const mapped = {};

	const put = (attr, required = false) => {
		if(_.isObject(attr)) {
			mapped[attr.key] = attr.validator
		} else {
			mapped[attr] = Joi.alternatives().try(
				Joi.alternatives().try(
					Joi.array().items(KeySchema),
					Joi.array().items(Joi.object()),
				),
				Joi.alternatives().try(
					KeySchema,
					Joi.object()
				)
			)
		}

		// Forcefully ignore the required attribute if updating
		if(required && !isBeingUpdated) {
			mapped[_.isObject(attr) ? attr.key : attr].required();
		}
	}

	required.forEach((attribute) => put(attribute, true))
	optional.forEach((attribute) => put(attribute))

	return Joi.object(mapped)
}
