class ApiFeatures {
  constructor(queryObj, query) {
    this.queryObj = queryObj;
    this.query = query;
  }

  filter() {
    const excluded = ["pages", "fields", "limit", "sort"];

    let clonedObj = { ...this.queryObj };
    excluded.forEach((key) => {
      delete clonedObj[key];
    });

    let filterStr = JSON.stringify(clonedObj);
    filterStr = filterStr.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`,
    );
    this.query = this.query.find(JSON.parse(filterStr));
    return this;
  }

  sort() {
    let sortStr = "";
    if (this.queryObj.sort) {
      sortStr = this.queryObj.sort.split(",").join(" ");
    } else sortStr = "name";
    this.query = this.query.sort(sortStr);
    return this;
  }
  getFields() {
    let fieldStr = "";

    if (this.queryObj.fields) {
      fieldStr = this.queryObj.fields.split(",").join(" ");
    }
    this.query = this.query.select(fieldStr);
    return this;
  }
  getPages() {
    let pages = this.queryObj.pages || 1;
    let limit = this.queryObj.limit || 100;

    const toSkip = (pages - 1) * limit;
    this.query = this.query.skip(toSkip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;
