/**
 * This function verifies that the paging parameters are valid and returns them as an array
 * @param { string | number} pFirst 
 * @param { string | number } pLast 
 * @returns {[number, number]} first and last
 */
const verifyPagingParameters = (pFirst, pLast) => {
    const first = parseInt(pFirst) | 0;
    const last = parseInt(pLast) | 9;
    if (first < 0 || last < 0) {
        throw new Error(
            "first and last parameters must be greater than or equal to 0"
        );
    }
    if (first > last) {
        throw new Error("first parameter must be less than or equal to last");
    }
    return [first, last];
}

module.exports = verifyPagingParameters;