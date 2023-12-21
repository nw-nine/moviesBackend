const knex = require("../db/connection")

function read(reviewId) {
    return knex("reviews").where({review_id: reviewId}).first()
}

function destroy(reviewId) {
    return knex("reviews").where("review_id", reviewId).delete()
}


async function getCritics(critic_id) {
    return knex("critics").where({ critic_id }).first()
}

async function getReviewsWithCritic(review) {
    review.critic = await getCritics(review.critic_id)
    return review
}

async function update(review) {
    return knex("reviews")
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(getReviewsWithCritic)
}



module.exports = {
    read,
    destroy,
    update,
}