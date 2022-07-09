import './style.css'
import Notiflix from "notiflix";

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css"

import { createGallery } from "./js/createdGallery";
import ImgApiService from "./js/imageservices";
import LoadMoreBtn from './js/buttonMore';



const searchForm = document.querySelector('#search-form');
const imgGallery = document.querySelector('.gallery');



const loadMoreBtn = new LoadMoreBtn({
    selector: '.load-more',
    hidden: true,
});

const imgApiService = new ImgApiService();
let countImages = 0;


searchForm.addEventListener('submit', searchImg);
loadMoreBtn.refs.btn.addEventListener('click', onLoadMore);


function searchImg(evt) {
  evt.preventDefault();

  clearImgGallery();
  imgApiService.query = evt.currentTarget.elements.searchQuery.value.trim();
    
  imgApiService.resetPage();
    
  imgApiService.fetchImages()
      .then(data => {

        if (data.total === 0 || imgApiService.query === ''){
          notiflixFailure();
          loadMoreBtn.hide();

        } else {
          loadMoreBtn.show();
          loadMoreBtn.disabled();

          appendImg(data.hits);
          new SimpleLightbox('.gallery a').refresh();

          const { height: cardHeight } = document
            .querySelector('#search-form')
            .firstElementChild.getBoundingClientRect();

          window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
          });

          countImages = data.hits.length;
          
          loadMoreBtn.enable();
          Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
          observer.observe(scrollGuard);

        };        
      }
        )
      .catch(() => notiflixFailure());
  
  
};


function onLoadMore(evt) {
  evt.preventDefault();

  loadMoreBtn.disabled();

  imgApiService.fetchImages()
      .then(data => {
        appendImg(data.hits);
        loadMoreBtn.enable();
        countImages += data.hits.length;
        console.log(countImages);
        // lightbox.refresh();
        
        if(countImages > data.totalHits){
          loadMoreBtn.hide();
          Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
          
        }
      })
}

function appendImg (data) {
  imgGallery.insertAdjacentHTML('beforeend',createGallery(data));
}

function clearImgGallery() {
  imgGallery.innerHTML= '';
}

function notiflixFailure() {
  return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again');
}

function showModal(event) {
  if (event.target.nodeName !== 'IMG') {
      return;
  }

  event.preventDefault();
}