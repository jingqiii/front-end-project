// Movie details: https://developers.themoviedb.org/3/movies/get-movie-details

// logo & colors: https://www.themoviedb.org/about/logos-attribution
// rating icon color: #f5c518

// model --------------------------------------------------------------
const model = {
  movies: [],
  details: [],
  favorite: [],
};
// controller ---------------------------------------------------------
const baseUrl = "https://api.themoviedb.org/3/movie";
const api_key = "api_key=ccc75b649ff03e4931abbe0fa41e4036";
const langUrl = "&language=en-US";
const pageUrl = "&page=";
const imgBaseUrl = "https://image.tmdb.org/t/p/w780";

const fetchMovie = (selectMovie) => {
  const page = 1;
  return fetch(
    `${baseUrl}/${selectMovie}?${api_key}${langUrl}${pageUrl}${page}`
  )
    .then((resp) => resp.json())
    .then((movies) => {
      model.movies = movies.results;
    });
};

const fetchMovieDetails = (selectMovieId) => {
  return fetch(`${baseUrl}/${selectMovieId}?${api_key}${langUrl}`)
    .then((resp) => resp.json())
    .then((details) => {
      model.details = details;
    });
};

const createCard = (movie) => {
  const li = document.createElement("li");
  li.className = "showcase-box";
  li.innerHTML = `
    <div class="showcase-item">
      <div class="showcase-post">
      <img src="${imgBaseUrl}${movie.backdrop_path}" alt="" />
      </div>
      <div class="showcase-text">
        <strong>${movie.title}</strong>
      </div>
      <div class="showcase-icon">
        <div class="star-section">
          <ion-icon name="star"></ion-icon>
          <p>${movie.vote_average}</p>
        </div>
        <button class="heartButton">
          <ion-icon name="heart-empty" class="heartEmpty active"></ion-icon>
          <ion-icon name="heart" class="heart"></ion-icon>
        </button>
      </div>
    </div>
  `;
  return li;
};

const createFavCard = (movie) => {
  const li = document.createElement("li");
  li.className = "showcase-box";
  li.innerHTML = `
    <div class="showcase-item">
      <div class="showcase-post">
      <img src="${imgBaseUrl}${movie.backdrop_path}" alt="" />
      </div>
      <div class="showcase-text">
        <strong>${movie.title}</strong>
      </div>
      <div class="showcase-icon">
        <div class="star-section">
          <ion-icon name="star"></ion-icon>
          <p>${movie.vote_average}</p>
        </div>
        <button class="heartButton">
          <ion-icon name="heart-empty" class="heartEmpty"></ion-icon>
          <ion-icon name="heart" class="heart active"></ion-icon>
        </button>
      </div>
    </div>
  `;
  return li;
};

const createDetailCard = (details) => {
  const detailsContainer = document.createElement("div");
  detailsContainer.classList.add("details-container");
  detailsContainer.classList.add("active");
  console.log(details.id);
  let list = "";
  details.genres.forEach((genr) => {
    list += "<li>" + genr.name + "</li>";
  });

  let companiesList = "";
  const comImgBaseUrl = "https://image.tmdb.org/t/p/original";
  details.production_companies.forEach((comp) => {
    if (comp.logo_path !== null) {
      const compUrl = comImgBaseUrl + comp.logo_path.replace(".png", ".svg");
      console.log(`${compUrl}`);
      companiesList += "<li>" + "<img src=" + compUrl + ">" + "</li>";
    }
  });
  detailsContainer.innerHTML = `
  <div class="close-button">
  <button>&times;</button>
  </div>
  <div class="details-box">
    <div class="details-post">
      <img src="${imgBaseUrl}${details.backdrop_path}" alt=""/>
    </div>
    <div class="details-para">
      <h1>${details.title}</h1>
      <span>overview</span>
      <p class="details-discription">${details.overview}</p>
      <span>Genres</span>
      <ul class="genres-list">
      ${list}
      </ul>
      <span>Rating</span>
      <p class="details-rated">${details.vote_average}</p>
      <span>Production Companies</span>
      <ul class="companies-icon-list">
      ${companiesList}
      </ul>
    </div>
 </div>
  `;
  return detailsContainer;
};

const pageNumberCard = (c) => {
  const p = document.querySelector(".carrier");
  p.innerHTML = c;
  return p;
};

// view ---------------------------------------------------------------
const updateView = () => {
  if (model.movies && model.movies.length > 0) {
    const showcaseContainer = document.querySelector(".showcase-container-ul");
    showcaseContainer.innerHTML = "";
    model.movies.forEach((movie) => {
      showcaseContainer.appendChild(createCard(movie));
    });
  }
};

const updatePageView = (c) => {
  pageNumberCard(c);
};

const updateFavView = () => {
  const favContainer = document.querySelector(".showcase-container-ul");
  favContainer.innerHTML = "";
  model.favorite.forEach((movie) => {
    favContainer.appendChild(createFavCard(movie));
  });
};

const updateDetailView = (curTarget) => {
  const showcaseSection = document.querySelector(".details-section");
  const overlay = document.querySelector(".overlay");
  if (model.details && Object.keys(model.details).length > 0) {
    overlay.classList.add("active");
    showcaseSection.innerHTML = "";
    showcaseSection.appendChild(createDetailCard(model.details));
    showcaseSection.appendChild(overlay);
  } else {
    if (curTarget.tagName === "BUTTON") {
      showcaseSection.childNodes.forEach((obj) => {
        obj.classList.remove("active");
      });
    }
  }
};

const updateHeartView = (e) => {
  const targetHeart = e.target;
  const heartStatus = e.target.classList;
  console.log("@ @ ", heartStatus.contains("active"));
  if (heartStatus.contains("active") && heartStatus.contains("heartEmpty")) {
    targetHeart.parentNode.children[0].classList.remove("active");
    targetHeart.parentNode.children[1].classList.add("active");
  } else {
    targetHeart.parentNode.children[0].classList.add("active");
    targetHeart.parentNode.children[1].classList.remove("active");
  }
};

const loadData = () => {
  const selectMovie = document.getElementById("movie-filter").value;
  const fetchPromise = fetchMovie(selectMovie);
  fetchPromise.then(() => {
    updateView();
  });
};

const loadDetailData = (e) => {
  const target = e.target;
  if (target.tagName === "IMG") {
    const url = target.src;
    let pathname = new URL(url).pathname;
    pathname = pathname.replace("/t/p/w780", ""); //get the image "value" in model Object
    model.movies.forEach((movie) => {
      if (movie.backdrop_path === pathname) {
        const movieId = movie.id;
        const fetchDetailPromise = fetchMovieDetails(movieId);
        fetchDetailPromise.then(() => {
          updateDetailView();
        });
      }
    });
  }

  if (target.tagName === "ION-ICON") {
    const favTarget =
      target.parentNode.parentNode.previousSibling.previousSibling;
    const favShow = favTarget.children[0].innerHTML;
    model.movies.forEach((movie) => {
      if (
        movie.title === favShow &&
        JSON.stringify(model.favorite).indexOf(JSON.stringify(favShow)) === -1
      ) {
        model.favorite.push(movie);
        updateHeartView(e);
      } else if (
        movie.title === favShow &&
        JSON.stringify(model.favorite).indexOf(JSON.stringify(favShow)) !== -1
      ) {
        model.favorite.splice(
          model.favorite.findIndex((item) => item.title === movie.title),
          1
        );
        updateHeartView(e);
      }
    });
  }
};

const closeDetailData = (e) => {
  if (e.target.tagName === "BUTTON") {
    model.details = null;
    const curTarget = e.target;
    updateDetailView(curTarget);
  }
};

const loadFavData = () => {
  updateFavView();
};

const loadPageData = (e) => {
  let counter = document.querySelector(".carrier").innerHTML;
  if (e.target.innerHTML === "Prev" && Number(counter) > 1) {
    updatePageView(counter - 1);
  }
  if (e.target.innerHTML === "Next" && Number(counter) < 20) {
    updatePageView(Number(counter) + 1);
    console.log(counter);
  }
};

const loadEvent = () => {
  const filterElement = document.querySelector("#movie-filter");
  const prevButton = document.querySelector(".prev-button");
  const nextButton = document.querySelector(".next-button");
  const showcaseClick = document.querySelector(".showcase-container-ul");
  const closeDetailButton = document.querySelector(".details-section");
  const homePage = document.querySelector(".homePage");
  const likedListButton = document.querySelector(".favPage");
  filterElement.addEventListener("change", loadData);
  showcaseClick.addEventListener("click", loadDetailData);
  closeDetailButton.addEventListener("click", closeDetailData);
  homePage.addEventListener("click", loadData);
  likedListButton.addEventListener("click", loadFavData);
  prevButton.addEventListener("click", loadPageData);
  nextButton.addEventListener("click", loadPageData);
};
loadData();
loadEvent();
