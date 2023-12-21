const knex = require("../db/connection")
const reduceProperties = require("../utils/reduce-properties")


async function getMoviesAndMT() {
    return await knex("movies as m")
      .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
      .select("*");
}
  
async function getTheaters() {
    return await knex("theaters as t").select("*");
}
  
async function list() {
    const [theaters, movies] = await Promise.all([getTheaters(), getMoviesAndMT()]);

    const theatersMap = new Map();
    theaters.forEach(theater => {
        theater.movies = [];
        theatersMap.set(theater.theater_id, theater);
    });

    movies.forEach(movie => {
        const theaterId = movie.theater_id;
        const theater = theatersMap.get(theaterId);
        if (theater) {
            theater.movies.push({
                movie_id: movie.movie_id,
                title: movie.title,
                runtime_in_minutes: movie.runtime_in_minutes,
                rating: movie.rating,
                description: movie.description,
                image_url: movie.image_url,
                created_at: movie.created_at,
                updated_at: movie.updated_at,
                is_showing: movie.is_showing,
            });
        }
    });

    const reducedData = [...theatersMap.values()];

    return reducedData;
}


// function list() {
//   return knex("theaters as t")
//     .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
//     .join("movies as m", "mt.movie_id", "m.movie_id")
//     .select(
//       "t.theater_id",
//       "t.name",
//       "t.address_line_1",
//       "t.address_line_2",
//       "t.city",
//       "t.state",
//       "t.zip",
//       "t.created_at",
//       "t.updated_at",
//       "m.movie_id",
//       "m.title",
//       "m.runtime_in_minutes",
//       "m.rating",
//       "m.description",
//       "m.image_url",
//       "mt.theater_id as movie_theater_id",
//       "m.created_at as movie_created_at",
//       "m.updated_at as movie_updated_at",
//       "mt.is_showing"
//     )
//     .then((results) => {
//         return results.map(result => {
//            return {
//                theater_id: result.theater_id,
//                name: result.name,
//                address_line_1: result.address_line_1,
//                address_line_2: result.address_line_2,
//                city: result.city,
//                state: result.state,
//                zip: result.zip,
//                created_at: result.created_at,
//                updated_at: result.updated_at,
//                movies: [{
//                    movie_id: result.movie_id,
//                    title: result.title,
//                    runtime_in_minutes: result.runtime_in_minutes,
//                    rating: result.rating,
//                    description: result.description,
//                    image_url: result.image_url,
//                    created_at: result.movie_created_at,
//                    updated_at: result.movie_updated_at,
//                    is_showing: result.is_showing,
//                    theater_id: result.movie_theater_id
//                }]
//            } 
           
//         })
//     });
// }

module.exports = {
    list,
}