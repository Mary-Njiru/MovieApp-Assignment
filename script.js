const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=2b84b14886227da4f94141f90f7c08d4&page=1'

const IMG_PATH= 'https://image.tmdb.org/t/p/w1280'

const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=2b84b14886227da4f94141f90f7c08d4&query="'

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search') 

//Get initial movies
getMovies(API_URL)
async function getMovies(url) {
    const res = await fetch(url)
    const data = await res.json()
    showMovies(data.results);
}
let selectedGenreId = null;
async function getMoviesByGenre() {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=2b84b14886227da4f94141f90f7c08d4&with_genres=${selectedGenreId}&page=1`;
  const res = await fetch(url);
  const data = await res.json();
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
            <h3>${title}</h3>
            <span class="${getClassByRate(vote_average)}">${vote_average}</span>
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
            const overview = movieElement.querySelector('.overview')
            overview.classList.add('show');
            console.log('Overview class toggled');
        })
    })
}
function getClassByRate(vote){
    if(vote >= 8){
       return 'green'
    }else if(vote >= 5){
        return 'orange'
    }else{
        return 'red'
    }
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
    const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=2b84b14886227da4f94141f90f7c08d4');
    const data = await res.json();
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
  getGenres();