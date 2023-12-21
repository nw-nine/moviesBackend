const service = require("./movies.service")


async function movieExists(req, res, next) {
    const { movieId } = req.params;
  
    const movie = await service.read(movieId);
  
    if (movie) {
      res.locals.movie = movie;
      return next();
    }
    next({ status: 404, message: `Movie cannot be found` });
}

async function list(req, res, next) {
    const { is_showing } = req.query
    if(is_showing) {
        console.log("@#@#@");
        let data = await service.filteredList()
        console.log("Data:", data);
        res.json({ data })
    }else {
        let data = await service.list()
        res.json({ data })
    }
}

async function filteredList(req, res) {
    if(req.query) {
        let data = await service.filteredList()
        console.log(data);
        res.json({ data })
    }
}

async function read(req, res, next) {
    let data = await service.read(req.params.movieId)
    res.json({ data })
}

async function theaters(req, res) {
    let data = await service.theaters(req.params.movieId)
    res.json({ data })
}
async function reviews(req, res) {
    let data = await service.reviews(req.params.movieId)
    res.json({ data })
}

module.exports = {
    list,
    filteredList,
    read: [movieExists, read],
    theaters,
    reviews,
}

