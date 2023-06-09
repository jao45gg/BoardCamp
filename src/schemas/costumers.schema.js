import joi from "joi";

const customersSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().min(10).max(11).required(),
    cpf: joi.string().length(11).required().custom((value, helpers) => {
        if(isNaN(value))
            throw new Error("cpf need to contain only numbers!");
    }),
    birthday: joi.date().required()
});

export default customersSchema;