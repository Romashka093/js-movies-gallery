import api from '../../services/apiService';
import refs from '../../services/refs';
import movieItem from '../../helpers/movieItem.hbs';
import favoriteListItem from '../../helpers/favoriteListItem.hbs';
import emptyList from '../../helpers/emptyList.hbs';
import './moviesGallery.css';
import '../favoriteList/favoriteList.css';

const { moviesList, favoriteMovieList } = refs;

export const state = {
  allMovies: [],
  favoriteMovies: [],
};

const createMoviesData = async () => {
  const movieListData = await api.getMoviesList().then(data => data);
  state.allMovies.push(...movieListData);
  localStorage.setItem('allMovies', JSON.stringify(state.allMovies));
  moviesList.insertAdjacentHTML('beforeend', movieItem(movieListData));
  if (state.favoriteMovies.length > 0) {
    state.allMovies.filter(movie => {
      if (state.favoriteMovies.includes(String(movie.id))) {
        favoriteMovieList.insertAdjacentHTML(
          'beforeend',
          favoriteListItem(movie),
        );
      }
    });
  } else {
    const text = {
      text: 'You still not added any of movies to favorite list!',
    };
    favoriteMovieList.insertAdjacentHTML('beforeend', emptyList(text));
  }
};
createMoviesData();

export const getFavMovies = state => {
  state.favoriteMovies =
    JSON.parse(localStorage.getItem('favoriteMovies')) || [];

  const userFavoriteMovies = state.favoriteMovies;

  if (moviesList.children !== null) {
    setTimeout(() => {
      const indicatorFavoriteMovies = document.querySelectorAll(
        '.regularMovie',
      );

      for (const elem of indicatorFavoriteMovies) {
        userFavoriteMovies.includes(elem.dataset.id)
          ? elem.classList.replace('regularMovie', 'favoriteMovie')
          : elem.classList.replace('favoriteMovie', 'regularMovie');
      }
    }, 1000);
  }
};
getFavMovies(state);

export const handlerToggleFavMovie = async evt => {
  evt.preventDefault();
  const elem = await evt.target;
  const id = elem.dataset.id;

  if (state.favoriteMovies.length >= 0) {
    const emptyItem = document.querySelector('.emptyItem');
    emptyItem ? favoriteMovieList.removeChild(emptyItem) : undefined;
  }

  if (id) {
    state.favoriteMovies =
      JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    const movieFavItems = document.querySelectorAll('.movieItem');
    const movieFavCards = document.querySelectorAll('.favoriteMovie');

    if (state.favoriteMovies.includes(id)) {
      state.favoriteMovies = state.favoriteMovies.filter(favId => favId !== id);
      elem.classList.replace('favoriteMovie', 'regularMovie');

      for (const movie of movieFavCards) {
        if (id === movie.dataset.id) {
          movie.classList.replace('favoriteMovie', 'regularMovie');
        }
      }

      for (const movie of movieFavItems) {
        if (id === movie.id) {
          favoriteMovieList.removeChild(movie);
        }
      }
      if (state.favoriteMovies.length === 0) {
        const text = {
          text:
            'Your list is empty, because you delete all your favorite movies!',
        };
        favoriteMovieList.insertAdjacentHTML('beforeend', emptyList(text));
      }
    } else {
      state.favoriteMovies.push(id);
      elem.classList.replace('regularMovie', 'favoriteMovie');
      for (const movie of state.allMovies) {
        if (+id === movie.id) {
          favoriteMovieList.insertAdjacentHTML(
            'beforeend',
            favoriteListItem(movie),
          );
        }
      }
    }
    localStorage.setItem(
      'favoriteMovies',
      JSON.stringify(state.favoriteMovies),
    );
  }
};

moviesList.addEventListener('click', handlerToggleFavMovie);
favoriteMovieList.addEventListener('click', handlerToggleFavMovie);
