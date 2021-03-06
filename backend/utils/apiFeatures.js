class APIFeatures {
  constructor(collection, queryStr) {
    this.collection = collection
    this.queryStr = queryStr
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: 'i',
          },
        }
      : {}
    this.collection = this.collection.find(keyword)
    return this
  }

  filter() {
    const queryCopy = { ...this.queryStr }

    //Remove fields from the query
    const removeFileds = ['keyword', 'limit', 'page']

    removeFileds.forEach((element) => {
      delete queryCopy[element]
    })

    //advance filter for price, ratings etc.
    let queryStr = JSON.stringify(queryCopy)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`)

    this.collection = this.collection.find(JSON.parse(queryStr))
    return this
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1
    const skip = resPerPage * (currentPage - 1)

    this.collection = this.collection.limit(resPerPage).skip(skip)
    return this
  }
}

module.exports = APIFeatures
