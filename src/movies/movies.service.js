const knex = require("../db/connection")

function list() {
    return knex("movies").select("*")
}

function filteredList() {
    const query = knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .select("m.movie_id", "m.title", "m.runtime_in_minutes", "m.rating", "m.description", "m.image_url", "mt.is_showing")
        .groupBy("m.movie_id", "m.title", "m.runtime_in_minutes", "m.rating", "m.description", "m.image_url", "mt.is_showing")
        .where({ "mt.is_showing": true });
        

    console.log("@@@@@query", query.toString()); // Log the generated SQL query

    return query;
}

function read(movieId) {
    return knex("movies").where({movie_id: movieId}).first()
}

function theaters(movieId) {
    return knex("movies as m")
        .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
        .join("theaters as t", "mt.theater_id", "t.theater_id")
        .select("t.theater_id",
                "t.name",
                "t.address_line_1",
                "t.address_line_2",
                "t.city",
                "t.zip",
                "t.created_at",
                "t.updated_at",
                "mt.is_showing",
                "mt.movie_id",)
        .where({ "m.movie_id": movieId })

}

function reviews(movieId) {
    return knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select(
            "r.review_id",
            "r.content",
            "r.score",
            "r.created_at",
            "r.updated_at",
            "r.critic_id",
            "r.movie_id",
            "c.critic_id as criticId",
            "c.preferred_name as preferredName",
            "c.surname",
            "c.organization_name as organizationName",
            "c.created_at as criticCreatedAt",
            "c.updated_at as criticUpdatedAt"
        )
        .where({ "r.movie_id": movieId })
        .then((results) => {
            return results.map((result) => {
                return {
                    review_id: result.review_id,
                    content: result.content,
                    score: result.score,
                    created_at: result.created_at,
                    updated_at: result.updated_at,
                    movie_id: result.movie_id,
                    critic: {
                        critic_id: result.criticId,
                        preferred_name: result.preferredName,
                        surname: result.surname,
                        organization_name: result.organizationName,
                        created_at: result.criticCreatedAt,
                        updated_at: result.criticUpdatedAt
                    }
                };
            });
        });
}


module.exports = {
    list,
    read,
    filteredList,
    theaters,
    reviews,
}