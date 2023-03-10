

/**
 * @class APIFeatures
 * @description this class is used to filter the data that is returned from the database's query
 * @param {object} query - the mongoose query 
 * @param {object} queryString - the request.query object
 */
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    /**
     * this limits the fields that are returned from the database
     * @returns {this}
     * @memberof APIFeatures
     */
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v -password -isDeleted');
        }
        return this
    }


    /**
     * this sorts the data that is returned from the database 
     * By default it sorts by the createdAt(time a document was created) field
     * @returns {this}
     */
    sort() {
        if (this.queryString.sort) {
            console.log(this.queryString.sort);

            const sortBy = this.queryString.sort.split(',').join(" ");
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }


    /**
     * this paginates the data that is returned from the database.
     * if not page is specified in the query it defaults to page 1.
     * if no limit is specified in the query it defaults to 100.
     * @returns {this}
     */
    paginate() {
        const page = this.queryString.page || 1;
        const skip = this.queryString.limit * (page - 1);
        this.query = this.query.skip(skip).limit(this.queryString.limit || 100);

        return this
    }

}


/**
 * @exports APIFeatures
 * @description this exports the APIFeatures class
 * @type {class}
 * @example const APIFeatures = require("../utils/APIFeaturesUtil");
 */
module.exports = APIFeatures;