location.hash = "/trending";
const trendNews = document.querySelector("#action_area");
const otherNews = document.querySelector(".other_news");

window.onhashchange = () => {
  const buttonUp = document.querySelector(".scroll_up__button");
  buttonUp.classList.toggle("scroll_up__button_hidden");
  const categoriesMenu = document.querySelector(".categories_menu");
  categoriesMenu.classList.add("categories_menu__hidden");
  const burgerIcon = document.querySelector(".header__burger_icon");
  burgerIcon.classList.remove("hide");
  const crossIcon = document.querySelector(".header__burger_cross_icon");
  crossIcon.classList.add("hide");
  const menu = document.querySelector(".menu__list");
  menu.classList.add("menu__list_hidden");

  trendNews.innerHTML = "";
  otherNews.innerHTML = "";

  switch (location.hash) {
    case "#/trending":
      getFreshOfArticles("trending", trendNews);
      getArticles("trending", otherNews);
      scrollUpButton(otherNews);
      break;

    case "#/sport":
      getFreshOfArticles("sport", trendNews);
      getArticles("sport", otherNews);
      scrollUpButton(trendNews);
      break;

    case "#/world":
      getFreshOfArticles("world", trendNews);
      getArticles("world", otherNews);
      scrollUpButton(otherNews);
      break;

    case "#/covid":
      getFreshOfArticles("covid", trendNews);
      getArticles("covid", otherNews);
      scrollUpButton(trendNews);
      break;
    case "#/business":
      getFreshOfArticles("business", trendNews);
      getArticles("business", otherNews);
      scrollUpButton(trendNews);
      break;

    case "#/politics":
      getFreshOfArticles("politics", trendNews);
      getArticles("politics", otherNews);
      scrollUpButton(trendNews);
      break;
    case "#/science":
      getFreshOfArticles("science", trendNews);
      getArticles("science", otherNews);
      scrollUpButton(trendNews);
      break;

    case "#/religion":
      getFreshOfArticles("religion", trendNews);
      getArticles("religion", otherNews);
      scrollUpButton(trendNews);
      break;

    case "#/health":
      getFreshOfArticles("health", trendNews);
      getArticles("health", otherNews);
      scrollUpButton(trendNews);
      break;

    default:
      trendNews.innerHTML = "";
      otherNews.innerHTML = "";
      getArticleById(getPath());
      break;
  }
};

async function getFreshOfArticles(category, root) {
  showSpinner();
  const resultOfFetch = await fetch(
    `https://content.guardianapis.com/search?q=${category}&show-tags=all&page-size=20&show-fields=all&order-by=relevance&api-key=5ef33414-1934-47dc-9892-5d09ab7c00da`
  )
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      return response;
    });

  const articles = resultOfFetch.response.results;
  let fresh = 0;
  let neededIndex = 0;

  articles.map((article, index) => {
    const date = new Date(article.webPublicationDate);
    if (fresh < date) {
      fresh = date;
      neededIndex = index;
    }
  });

  const freshTrending = articles[neededIndex];
  const imageUrl = freshTrending.fields.main.split('"')[5];

  root.insertAdjacentHTML(
    "afterbegin",
    `<article class="main_news">
        <div class="main_news__text_area">
        <a id="main_news__title" href="">    
          <h3 class="main_news__title">${freshTrending.fields.headline}</h3>
        </a>
     
          <p class="main_news__text">${freshTrending.fields.bodyText}</p>
          <div class="main_news__date_area">
            <p class="main_news__date">${formatDate(
              freshTrending.webPublicationDate
            )}</p>
            <a class="main_news__link" href="">Read more</a>
          </div>
        </div>
        <div class="main_news__image_area">
          <a id="main_news__image" href=""> 
            <img class="main_news__image" src="${imageUrl}"/>
          </a>
        </div>
      </article>`
  );
  const title = document.querySelector("#main_news__title");
  title.addEventListener("click", (e) => {
    e.preventDefault();
    location.hash = freshTrending.id;
  });

  const image = document.querySelector("#main_news__image");
  image.addEventListener("click", (e) => {
    e.preventDefault();
    location.hash = freshTrending.id;
  });

  const link = document.querySelector(".main_news__link");
  link.addEventListener("click", (e) => {
    e.preventDefault();
    location.hash = freshTrending.id;
  });
}

async function getArticles(category, root) {
  const resultOfFetch = await fetch(
    `https://content.guardianapis.com/search?q=${category}&show-tags=all&page-size=20&show-fields=all&order-by=relevance&api-key=5ef33414-1934-47dc-9892-5d09ab7c00da`
  )
    .then((response) => response.json())
    .then((response) => {
      hideSpinner();
      return response;
    });
  const articles = resultOfFetch.response.results;
  let fresh = 0;
  let dontNeededIndex = 0;

  articles.map((article, index) => {
    const date = new Date(article.webPublicationDate);
    if (fresh < date) {
      fresh = date;
      dontNeededIndex = index;
    }
  });

  articles.splice(dontNeededIndex, 1);
  const list = document.createElement("ul");
  list.classList.add("other_news__list");

  articles.map((i) => {
    const article = i.fields;
    const { headline, bodyText, firstPublicationDate } = article;

    const img = article.main.split('"')[5];

    const item = document.createElement("li");
    item.classList.add("other_news__item");

    const div = document.createElement("div");
    div.classList.add("other_news__date_area");

    const p = document.createElement("p");
    p.classList.add("other_news__date");
    p.textContent = formatDate(firstPublicationDate);

    const link = document.createElement("a");
    link.setAttribute("id", i.id);
    link.setAttribute("href", "");
    link.classList.add("other_news__link");
    link.textContent = "Read more";
    link.addEventListener("click", (e) => {
      e.preventDefault();
      location.hash = i.id;
    });

    const articleTag = document.createElement("article");
    const otherNewsImageArea = document.createElement("div");
    otherNewsImageArea.classList.add("other_news__image_area");

    const imageLink = document.createElement("a");

    imageLink.addEventListener("click", (e) => {
      e.preventDefault();
      location.hash = e.target.id;
    });
    const otherNewsImage = document.createElement("img");
    otherNewsImage.setAttribute("id", i.id);
    otherNewsImage.setAttribute("src", img);

    imageLink.appendChild(otherNewsImage);
    otherNewsImageArea.appendChild(imageLink);

    const otherNewsTitle = document.createElement("h2");
    otherNewsTitle.setAttribute("id", i.id);
    otherNewsTitle.classList.add("other_news__title");
    otherNewsTitle.textContent = headline;

    const otherNewsTitleLink = document.createElement("a");
    otherNewsTitleLink.appendChild(otherNewsTitle);
    otherNewsTitleLink.addEventListener("click", (e) => {
      e.preventDefault();
      location.hash = e.target.id;
    });

    const otherNewsTextArea = document.createElement("div");
    otherNewsTextArea.classList.add("other_news__text_area");
    otherNewsTextArea.insertAdjacentHTML(
      "afterbegin",
      `<p class='other_news__text'>${bodyText}</p>`
    );

    div.appendChild(p);
    div.appendChild(link);
    articleTag.appendChild(otherNewsImageArea);
    articleTag.appendChild(otherNewsTitleLink);
    articleTag.appendChild(otherNewsTextArea);
    articleTag.appendChild(div);
    item.appendChild(articleTag);
    list.appendChild(item);
  });

  root.appendChild(list);
}

async function getArticleById(id) {
  showSpinner();
  const result = await fetch(
    `https://content.guardianapis.com/search?q=${id}&show-tags=all&page-size=20&show-fields=all&order-by=relevance&api-key=5ef33414-1934-47dc-9892-5d09ab7c00da`
  )
    .then((response) => response.json())
    .then((response) => {
      hideSpinner();
      return response.response.results.find((item) => item.id === id);
    });

  const article = result.fields;
  const { headline, byline, firstPublicationDate, body } = article;

  const imageUrl = article.main.split('"')[5];

  const mainDiv = document.querySelector("#action_area");
  mainDiv.insertAdjacentHTML(
    "afterbegin",
    `
    <div class='main_article__image_area'> 
      <img class="main_article__image" src=${imageUrl} />
    </div>

    <div class="article_container">
      <h1 class="main_article__title">${headline}</h1>

      <div id="target">
        <div class="main_article__author_area">
          <p>
            <span class="main_article__author">Written by ${byline}</span>
            <span class='main_article__date'>${formatDate(
              firstPublicationDate
            )}</span>
            </p>
        </div>
     

        <div class="main_article__text">${body}</div>
    </div>
    </div>`
  );

  const target = document.querySelector("#target");
  scrollUpButton(target);
}

// -----------------------------------------------------

function getPath() {
  const hash = location.hash;
  const arr = hash.split("");
  arr.splice(0, 1);
  const path = arr.join("");
  return path;
}

function formatDate(date) {
  const publicDate = new Date(date);
  const formatDate = publicDate.toDateString();
  const formatDateArr = formatDate.split(" ");
  formatDateArr.splice(0, 1);

  if (formatDateArr[1][1] === "1") {
    formatDateArr[1] = formatDateArr[1] + "st";
  } else if (formatDateArr[1][1] === "2") {
    formatDateArr[1] = formatDateArr[1] + "nd";
  } else if (formatDateArr[1][1] === "3") {
    formatDateArr[1] = formatDateArr[1] + "rd";
  } else {
    formatDateArr[1] = formatDateArr[1] + "th";
  }

  return formatDateArr.join(" ");
}

// ------------------------------------------------------------

function scrollUpButton(target) {
  const options = {
    root: document.querySelector("#scrollArea"),
    rootMargin: "0px",
    threshold: 0.2,
  };

  const up = document.querySelector(".scroll_up__button");
  up.classList.add("scroll_up__button_hidden");

  const header = document.querySelector(".header");
  up.addEventListener("click", () => {
    header.scrollIntoView({ block: "center", behavior: "smooth" });
  });

  const callback = function (entries, observer) {
    up.classList.toggle("scroll_up__button_hidden");
  };
  const observer = new IntersectionObserver(callback, options);

  observer.observe(target);
}

// ------------------------------------------------------------
const loadingDiv = document.querySelector("#loading");
function showSpinner() {
  loadingDiv.style.visibility = "visible";
}

function hideSpinner() {
  loadingDiv.style.visibility = "hidden";
}
// -------------------------------------------------------------
// Бургер_______
const burger = document.querySelector(".header__burger_button");
burger.addEventListener("click", () => {
  menuHandler();
});

const categories = document.querySelector("#categories");
const categoriesMenu = document.querySelector(".categories_menu");

function menuHandler() {
  const burgerIcon = document.querySelector(".header__burger_icon");
  burgerIcon.classList.toggle("hide");

  const crossIcon = document.querySelector(".header__burger_cross_icon");
  crossIcon.classList.toggle("hide");

  const menu = document.querySelector(".menu__list");
  menu.classList.toggle("menu__list_hidden");

  categories.classList.remove("categories_active");

  categoriesMenu.classList.add("categories_menu__hidden");
}

// -------------------------------------------------------------
// Меню категорий_____

categories.addEventListener("mouseenter", () => {
  categories.classList.toggle("categories_active");
  categoriesMenuHandler();
});

function categoriesMenuHandler() {
  categoriesMenu.classList.toggle("categories_menu__hidden");
}

// -------------------------------------------------------------
