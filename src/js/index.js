import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PhotosApiService from './photosApiService';
import photoCardsMarkup from '../templates/photoCardsMarkup.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadMoreBtn from './loadMoreBtn';

const photosApiService = new PhotosApiService();
const refs = {
  formEl: document.querySelector('[id="search-form"]'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('[data-action="load-more-btn"]'),
};
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more-btn"]',
  hidden: true,
});
let gallery = new SimpleLightbox('.gallery a');

refs.formEl.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSubmit(e) {
  e.preventDefault();

  refs.galleryEl.innerHTML = '';
  const value = e.currentTarget.elements.searchQuery.value.trim();
  photosApiService.query = value;
  photosApiService.resetPage();

  loadMoreBtn.show();
  loadMoreBtn.disable();

  try {
    const photos = await photosApiService.fetchPhotos();
    const markup = photoCardsMarkup(photos);

    if (photos.length === 0 || !value) {
      throw new Error();
    } else if (photos.length < 40) {
      noMorePhotos();
    }

    refs.galleryEl.insertAdjacentHTML('beforeend', markup);
    Notify.success(`Hooray! We found ${photos.length} images.`);

    loadMoreBtn.enable();
  } catch (error) {
    onError();
  }

  gallery.refresh();
}

async function onLoadMore() {
  loadMoreBtn.disable();
  try {
    const photos = await photosApiService.fetchPhotos();
    const markup = photoCardsMarkup(photos);
    refs.galleryEl.insertAdjacentHTML('beforeend', markup);

    if (photos.length < 40) {
      noMorePhotos();
    }
  } catch (error) {
    onError();
  }
  loadMoreBtn.enable();
  pageScroll();
}

function onError() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
  loadMoreBtn.hide();
}

function noMorePhotos() {
  loadMoreBtn.hide();
  Notify.info("We're sorry, but you've reached the end of search results.");
}

function pageScroll() {
  const cardHeight =
    document.querySelector('.gallery').firstElementChild.offsetHeight;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
