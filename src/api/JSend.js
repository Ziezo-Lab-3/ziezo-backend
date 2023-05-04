class ApiResult {
    /** 
     * @param {any} data
     * @param {"success"|"fail"|"error"} status
     * @param {string} message
     * */
    constructor(status, data = null, message = "") {
        this.status = status;
        this.data = data;
        if (message.length === 0) {
            if (status === "success") {
                this.message = "Request successful";
            } else if (status === "fail") {
                this.message = "Request failed";
            } else if (status === "error") {
                this.message = "An internal error occurred";
            }
        }
        else {
            this.message = message;
        }
    }
}

module.exports = {
    ApiResult,
}