const baseUrl = 'https://my-json-server.typicode.com/moviedb-tech/movies/list';

export default {
  async getMoviesList() {
    return fetch(baseUrl)
      .then(response => response.json())
      .catch(err => console.log(err));
  },
  async getMovieItem(id) {
    return fetch(baseUrl + `/` + id)
      .then(response => response.json())
      .catch(err => console.log(err));
  },
};
