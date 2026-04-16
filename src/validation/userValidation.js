import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().trim().min(3).max(30).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).max(16).required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).max(16).required(),
});

export const requestResetUserPasswordSchema = Joi.object({
  email: Joi.string().trim().email().required(),
});

export const resetUserPasswordSchema = Joi.object({
  password: Joi.string().trim().min(6).max(16).required(),
  token: Joi.string().required(),
});

export const changePasswordSchema = Joi.object({
  oldPass: Joi.string().trim().min(6).max(16).required(),
  newPass: Joi.string().trim().min(6).max(16).required(),
  confirmPass: Joi.string().valid(Joi.ref('newPass')).required(),
});

export const changeUserNameSchema = Joi.object({
  newName: Joi.string().trim().min(3).max(30).required(),
});
