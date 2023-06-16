const { query } = require("express");
const mongoose = require("mongoose");

/**
 *
 * @param {object} filter
 * @param {Array<string>} idList
 * @returns {object} filter
 * @description This function parses the filter object and casts all properties that are specified in idList to ObjectId.
 */
const parseFilterIds = (filter, idList = []) => {
    try {
        const idProperties = ["_id", ...idList];
        const isId = (property) => idProperties.includes(property);
        for (const [key, value] of Object.entries(filter)) {
            if (isId(key)) {
                if (Array.isArray(value)) {
                    // cast all elements to ObjectId
                    filter[key] = value.map((candidate) =>
                        mongoose.Types.ObjectId(candidate)
                    );
                } else if (typeof value === "object") {
                    // make sure that all operators are casting to ObjectId
                    Object.entries(value).forEach(([operator, operand]) => {
                        if (queryOperators.comp.includes(operator)) {
                            // cast operand to ObjectId
                            filter[key][operator] =
                                mongoose.Types.ObjectId(operand);
                        }
                        if (queryOperators.array.includes(operator)) {
                            // cast all elements to ObjectId
                            filter[key][operator] = operand.map((candidate) =>
                                mongoose.Types.ObjectId(candidate)
                            );
                        }
                        if (queryOperators.eval.includes(operator)) {
                            // cast all elements to ObjectId
                            filter[key][operator] = parseFilterIds(operand);
                        }
                    });
                } else {
                    filter[key] = mongoose.Types.ObjectId(value);
                }
            } else if (typeof value === "object") {
                parseFilterIds(value, idList);
            }
        }
        return filter;
    } catch (error) {
        throw new Error(`Error parsing filter: ${error.message}`);
    }
};
const queryOperators = {
    comp: ["$eq", "$gt", "$gte", "$in", "$lt", "$lte", "$ne", "$nin"],
    log: ["$and", "$not", "$nor", "$or"],
    elem: ["$exists", "$type"],
    eval: ["$expr", "$jsonSchema", "$mod", "$regex", "$text", "$where"],
    geosp: [
        "$geoIntersects",
        "$geoWithin",
        "$near",
        "$nearSphere",
        "$box",
        "$center",
        "$centerSphere",
        "$geometry",
        "$maxDistance",
        "$minDistance",
        "$polygon",
    ],
    array: ["$all", "$elemMatch", "$size"],
    bit: ["$bitsAllClear", "$bitsAllSet", "$bitsAnyClear", "$bitsAnySet"],
    misc: ["$comment", "$rand", "$natural"],
};

module.exports = {
    queryOperators,
    parseFilterIds,
};
