const {take, drop, negate, toLower, pick, transform} = require('lodash');
const Exceptions = require('./errors');

const ValidationError = Exceptions.ValidationError;

const safeApplyCondition = (condition, name, negated) => {
    return (something, message) => {
        if (!condition(something)) {
            throw new ValidationError(message || `Validation error ${something} must ${(negated ? ' not ' : ' ')} be ${toLower(name)}`);
        }
        return something;
    };
};

const mapToSafeFunction = (result, func, funcName) => {
    if (!/^(isNot).*/.test(funcName) && /^is.*/.test(funcName)) {

        const is = take(funcName, 2).join('');
        const name = drop(funcName, 2).join('');

        result[is + name] = safeApplyCondition(func, name, false);

        result[`${is}Not${name}`] = safeApplyCondition(negate(func), name, true);
    }
};

const Validator = validations => transform(
    pick(
        validations,
        (value, key) => /^is.*/.test(key)
    ),
    mapToSafeFunction
);

Validator.Error = ValidationError;

module.exports = Validator;
