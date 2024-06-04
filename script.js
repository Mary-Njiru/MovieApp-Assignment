const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=2b84b14886227da4f94141f90f7c08d4&page=1'
const IMG_PATH = 'https://image.tmdb.org/t/p/w500'
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=2b84b14886227da4f94141f90f7c08d4&query="'
const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

// Get initial movies
getMovies(API_URL)

async function getMovies(url) {
    const result = await fetch(url)
    const data = await result.json()
    showMovies(data.results);
}

let selectedGenreId = null;
async function getMoviesByGenre() {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=2b84b14886227da4f94141f90f7c08d4&with_genres=${selectedGenreId}&page=1`;
  const result = await fetch(url);
  const data = await result.json();
  showMovies(data.results);
}

function showMovies(movies){
    main.innerHTML = ''
    movies.forEach((movie) => {
        const { title,poster_path,vote_average,overview} = movie
        const movieElement = document.createElement('div')
        movieElement.classList.add('movie')
        movieElement.innerHTML = `
             <img src="${IMG_PATH + poster_path}" alt="${title}">
          <div class="movie-info">
          <h3 id="title-${movie.id}" class="truncate">${shortenTitle(title, 15)}</h3>
            <div class="rating">
              ${generateStars(vote_average)}
            </div>
        </div>
          <div class="overview">
        <h3>Overview</h3>
        ${overview}
        </div>
         `
          main.appendChild(movieElement)

         // Add event listener to the movie element
         movieElement.addEventListener('click', () => {
          console.log('Movie clicked');
          const titleElement = movieElement.querySelector(`#title-${movie.id}`);
          const overview = movieElement.querySelector('.overview');
          if (titleElement.classList.contains('truncate')) {
            titleElement.textContent = title;
            titleElement.classList.remove('truncate');
          } else {
            titleElement.textContent = shortenTitle(title, 15);
            titleElement.classList.add('truncate');
          }
          overview.classList.toggle('show');
          console.log('Overview class toggled');
        
          // Create the new HTML page
          const moviePage = createMoviePage(movie);
        
          // Open the new movie page in a new window or tab
          const newWindow = window.open('', '_blank');
          newWindow.document.body.appendChild(moviePage);
        });
        
        
    })
}

function shortenTitle(title, length) {
    if (title.length > length) {
        return title.substr(0, length - 3) + "...";
    } else {
        return title;
    }
}

function generateStars(vote) {
  const fullStars = Math.floor(vote / 2);
  let halfStar;

    if (vote % 2 !== 0) {
     halfStar = 1;
      } else {
      halfStar = 0;
    }   
  let stars = '';

  for (let i = 0; i < fullStars; i++) {
    stars += '★';
  }

  if (halfStar) {
    stars += '☆';
  }

  return stars;
}




function createMoviePage(movie) {
  const moviePage = document.createElement('div');
  moviePage.classList.add('movie-page');
  moviePage.innerHTML = `
    <h1>${movie.title}</h1>
    <img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}">
    <div class="rating">
      ${generateStars(movie.vote_average)}
    </div>
    <div class="overview">
      <h3>Overview</h3>
      ${movie.overview}
    </div>
  `;
  return moviePage;
}


form.addEventListener('submit',(e) =>{
    e.preventDefault()
    const searchTerm = search.value
    if(searchTerm && searchTerm !==''){
        getMovies(SEARCH_API + searchTerm)
        search.value = ''
    }
    else{
        window.location.reload()
    }
})


// Fetch genres and create the sidebar
async function getGenres() {
    const result = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=2b84b14886227da4f94141f90f7c08d4');
    const data = await result.json();
    const genreList = document.getElementById('genre-list');
    data.genres.forEach((genre) => {
      const genreItem = document.createElement('li');
      genreItem.textContent = genre.name;
      genreItem.dataset.genreId = genre.id;
      genreItem.addEventListener('click', () => {
        selectedGenreId = genre.id;
        getMoviesByGenre();
      });
      genreList.appendChild(genreItem);
    });
}

// Add an event listener to the search input to filter movies as you type
search.addEventListener('input', async () => {
    const searchTerm = search.value.toLowerCase();
    if (searchTerm) {
        const url = `${SEARCH_API}${searchTerm}`;
        const result = await fetch(url);
        const data = await result.json();
        showMovies(data.results);
    } else {
        getMovies(API_URL);
    }
});

getGenres();