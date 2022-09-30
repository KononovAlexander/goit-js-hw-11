import Notiflix from 'notiflix';
import { fetchImages, DEFAULT_PAGE, page,resetPage, perPage} from './js/fetchImages';
import {addImgCard} from './js/addImgCard'

const refs = {
 form: document.querySelector(".search-form"),
 input: document.querySelector(".input"),
 gallery: document.querySelector(".gallery"),
 buttonLoadMore: document.querySelector(".load-more")
}
console.log('page:', page);
let searchValue = '';


refs.form.addEventListener('submit', onSubmit);
refs.buttonLoadMore.addEventListener('click', addMoreImg);

async function onSubmit(event) {
    event.preventDefault();
    searchValue = event.currentTarget.elements.searchQuery.value.trim();
    try{
        resetPage ();
        const result = await fetchImages(searchValue); 
   
     if (searchValue === '') {
        btnInvisible();
        clearGallery();
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
         return;
    }
     if (result.hits < 1) {
        btnInvisible();
        clearGallery();
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }

    refs.gallery.innerHTML = addImgCard(result.hits);
        btnVisible() ;
     }catch(error) {
        Notiflix.Report.info('Oh',`${error.message}`, 'Okay');
    }

}

async function addMoreImg () {
    try {
        const result = await fetchImages(searchValue);
        const totalPages = (page - 1) * perPage;
        console.log('page:', page);
        console.log('totalPages:', totalPages);
            if (result.totalHits <= totalPages) {
                btnInvisible();
                Notiflix.Report.info('Wow', "We're sorry, but you've reached the end of search results.", 'Okay');
            }
        refs.gallery.insertAdjacentHTML('beforeend', addImgCard(result.hits));

    } catch (error) {
              Notiflix.Report.info('Oh',`${error.message}`, 'Okay');
    };
};

function clearGallery () {
    refs.gallery.innerHTML = '';
}

function btnInvisible () {
    refs.buttonLoadMore.classList.add('is-hidden');
}
function btnVisible () {
    refs.buttonLoadMore.classList.remove('is-hidden');
}


