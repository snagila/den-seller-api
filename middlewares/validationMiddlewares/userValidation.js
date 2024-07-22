import Joi from "joi";
import { buildErrorResponse } from "../../utilityHELPER/responseHelper.js";

export const newUserValidation = (req, res, next) => {
  try {
    // joi model schema for new user validation
    const schema = Joi.object({
      firstName: Joi.string().min(3).required(),
      lastName: Joi.string().min(3).required(),
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      address: Joi.string().required(),
      phone: Joi.string().required().max(13),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return buildErrorResponse(res, error.message);
    }
    next();
  } catch (error) {
    console.log(error.message);
    next();
  }
};
