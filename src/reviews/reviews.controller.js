const service = require("./reviews.service")

async function reviewExists(req, res, next) {
    const { reviewId } = req.params;
  
    const review = await service.read(reviewId);
  
    if (review) {
      res.locals.review = review;
      return next();
    }
    next({ status: 404, message:"Review cannot be found" });
}

async function destroy(req, res, next) {
    let data = await service.destroy(req.params.reviewId)
    res.status(204).json({ data })
}

async function update(req, res) {
    const updatedReview = {
        ...res.locals.review,
        ...req.body.data,
        review_id: res.locals.review.review_id,
      };
      const data = await service.update(updatedReview);
      console.log("!@#@#", data);
    res.json({ data })
}

module.exports = {
    destroy: [reviewExists, destroy],
    update: [reviewExists, update],
}