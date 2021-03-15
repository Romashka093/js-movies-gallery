import api from '../../services/apiService';
import refs from '../../services/refs';
import movieDetails from '../../helpers/movieDetails.hbs';
import {
  handlerToggleFavMovie,
  getFavMovies,
  state,
} from '../moviesGallery/moviesGallery';
import './movieDetails.css';

const { moviesList, modalWindow, body } = refs;

const handlerOpenMovieCard = async evt => {
  evt.preventDefault();
  if (evt.target.id === '') {
    return;
  }
  (async function () {
    const movieItemData = await api
      .getMovieItem(+evt.target.id)
      .then(data => data);

    modalWindow.innerHTML = movieDetails(movieItemData);
    const starIcon = document.querySelector('.userStatus').firstElementChild;
    starIcon.addEventListener('click', handlerToggleFavMovie);
  })();
  body.style.overflow = 'hidden';
  getFavMovies(state);
};

const handlerCloseModalWindow = evt => {
  evt.preventDefault();
  if (evt.target.nodeName == 'BUTTON') {
    modalWindow.innerHTML = '';
    body.style.overflow = 'auto';
  }
};

moviesList.addEventListener('click', handlerOpenMovieCard);
modalWindow.addEventListener('click', handlerCloseModalWindow);
