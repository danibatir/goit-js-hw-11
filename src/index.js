const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;
let query = '';

const API_KEY = '44190966-0aa6bbea47325323a5628291c';
const perPage = 40;

form.addEventListener('submit', event => {
  event.preventDefault();
  query = event.target.searchQuery.value.trim();
  if (query) {
    page = 1;
    gallery.innerHTML = '';
    loadMoreBtn.classList.remove('show');
    fetchImages();
  }
});

loadMoreBtn.addEventListener('click', () => {
  page++;
  fetchImages();
});

function fetchImages() {
  fetch(
    `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(
      query
    )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  )
    .then(response => response.json())
    .then(data => {
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        loadMoreBtn.classList.remove('show');
      } else {
        displayImages(data.hits);
        if (page === 1) {
          Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        }
        if (data.hits.length < perPage) {
          loadMoreBtn.classList.remove('show');
          if (page > 1) {
            Notiflix.Notify.info(
              "We're sorry, but you've reached the end of search results."
            );
          }
        } else {
          loadMoreBtn.classList.add('show');
        }
      }
    })
    .catch(error => {
      console.error('Error fetching images:', error);
      Notiflix.Notify.failure('Something went wrong. Please try again later.');
    });
}

function displayImages(images) {
  const markup = images
    .map(
      image => `
    <a href="${image.largeImageURL}" class="photo-card">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes</b> ${image.likes}
        </p>
        <p class="info-item">
          <b>Views</b> ${image.views}
        </p>
        <p class="info-item">
          <b>Comments</b> ${image.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b> ${image.downloads}
        </p>
      </div>
    </a>
  `
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  refreshLightbox();
  loadMoreBtn.classList.add('show');
}

function refreshLightbox() {
  const lightbox = new SimpleLightbox('.gallery a', {
    /* options */
  });
  lightbox.refresh();
}
