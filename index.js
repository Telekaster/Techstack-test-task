const trendNews = document.querySelector("#action_area");
const otherNews = document.querySelector(".other_news");
const div = document.querySelector(".search__area");
const searchInput = document.querySelector(".header__input");
const searchButton = document.querySelector(".header__search_button");
const closeSearchButton = document.querySelector(".close_search__button");
const menu = document.querySelector(".menu__list");
const crossIcon = document.querySelector(".header__burger_cross_icon");
const burgerIcon = document.querySelector(".header__burger_icon");
const categoriesMenu = document.querySelector(".categories_menu");
const buttonUp = document.querySelector(".scroll_up__button");

// let originalText = "";

location.hash = "/trending";

window.onhashchange = () => {
  buttonUp.classList.toggle("scroll_up__button_hidden");
  categoriesMenu.classList.add("categories_menu__hidden");
  burgerIcon.classList.remove("hide");
  crossIcon.classList.add("hide");
  menu.classList.add("menu__list_hidden");
  div.classList.add("search__area_hidden");
  searchButton.classList.remove("header__search_button_hidden");
  closeSearchButton.classList.add("close_search__button_hide");
  searchInput.value = "";

  trendNews.innerHTML = "";
  otherNews.innerHTML = "";

  switch (location.hash) {
    case "#/trending":
      getFreshOfArticles("trending", trendNews);
      getArticles("trending", otherNews);
      scrollUpButton(otherNews);
      setSearchValue();
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
  const resultOfArticles = await fetch(
    `https://content.guardianapis.com/search?q=${category}&show-tags=all&page-size=20&show-fields=all&order-by=relevance&api-key=5ef33414-1934-47dc-9892-5d09ab7c00da`
  )
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      return response;
    });

  const articles = resultOfArticles.response.results;
  let fresh = 0;
  let neededIndex = 0;

  articles.map((article, index) => {
    const date = new Date(article.webPublicationDate);
    if (fresh < date) {
      fresh = date;
      neededIndex = index;
    }
  });

  const freshest = articles[neededIndex];
  const { headline, bodyText, webPublicationDate } = freshest.fields;
  const imageUrl = freshest.fields.main.split('"')[5];

  root.insertAdjacentHTML(
    "afterbegin",
    `<article class="main_news">
        <div class="main_news__text_area">
        <a id="main_news__title" href="">    
          <h3 class="main_news__title">${headline}</h3>
        </a>
     
          <p class="main_news__text">${bodyText}</p>
          <div class="main_news__date_area">
            <p class="main_news__date">${formatDate(webPublicationDate)}</p>
 
            <a class="main_news__link" href="">Read more</a>
          </div>
          ${checkVisitedLinks(freshest.id)}
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
    location.hash = freshest.id;
    setVisitedLinks(freshest.id);
  });

  const image = document.querySelector("#main_news__image");
  image.addEventListener("click", (e) => {
    e.preventDefault();
    location.hash = freshest.id;
    setVisitedLinks(freshest.id);
  });

  const link = document.querySelector(".main_news__link");
  link.addEventListener("click", (e) => {
    e.preventDefault();
    location.hash = freshest.id;
    setVisitedLinks(freshest.id);
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
      setVisitedLinks(i.id);
      location.hash = i.id;
    });

    const articleTag = document.createElement("article");
    const otherNewsImageArea = document.createElement("div");
    otherNewsImageArea.classList.add("other_news__image_area");

    const imageLink = document.createElement("a");

    imageLink.addEventListener("click", (e) => {
      e.preventDefault();
      setVisitedLinks(i.id);
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
      setVisitedLinks(i.id);
      location.hash = e.target.id;
    });

    const otherNewsTextArea = document.createElement("div");
    otherNewsTextArea.classList.add("other_news__text_area");
    otherNewsTextArea.insertAdjacentHTML(
      "afterbegin",
      `<p class='other_news__text'>${bodyText}</p>`
    );

    const viewedDiv = document.createElement("div");
    viewedDiv.classList.add("container");
    viewedDiv.insertAdjacentHTML("afterbegin", checkVisitedLinks(i.id));

    div.appendChild(p);
    div.appendChild(link);
    articleTag.appendChild(otherNewsImageArea);
    articleTag.appendChild(otherNewsTitleLink);
    articleTag.appendChild(otherNewsTextArea);
    articleTag.appendChild(div);
    articleTag.appendChild(viewedDiv);
    item.appendChild(articleTag);
    list.appendChild(item);
  });

  root.appendChild(list);
}

async function getArticleById(id) {
  trendNews.innerHTML = "";
  otherNews.innerHTML = "";
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
  closeSearch();
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
  const publicationDate = new Date(date);
  const today = new Date();
  const result = Math.floor(
    (today.getTime() - publicationDate.getTime()) / 86400000
  );

  if (result) {
    return `${result} days ago`;
  } else {
    return "today";
  }
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

  const callback = function () {
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
// Просмотренные ссылки
function setVisitedLinks(id) {
  const time = new Date().getTime();

  if (!localStorage.getItem("visited")) {
    const linksObj = { [id]: time };
    const linksObjJSON = JSON.stringify(linksObj);
    localStorage.setItem("visited", linksObjJSON);
  } else {
    const linksObjJSON = localStorage.getItem("visited");
    const linksObj = JSON.parse(linksObjJSON);
    const linksObjModify = { ...linksObj, [id]: time };
    const linksObjModifyJSON = JSON.stringify(linksObjModify);
    localStorage.setItem("visited", linksObjModifyJSON);
  }
}

function checkVisitedLinks(id) {
  if (localStorage.getItem("visited")) {
    const linksObjJSON = localStorage.getItem("visited");
    const linksObj = JSON.parse(linksObjJSON);

    for (const key in linksObj) {
      if (key === id) {
        const now = new Date().getTime();
        const minutes = Math.floor((now - linksObj[id]) / 60000);
        return `<p class="main_news__visited">Viewed ${minutes} minutes ago</p>`;
      }
    }
  }
  return `<p class="main_news__visited">Unviewed</p>`;
}

// -------------------------------------------------------------
// Поиск по статье

searchButton.addEventListener("click", () => {
  if (
    location.hash === "#/trending" ||
    location.hash === "#/sport" ||
    location.hash === "#/world" ||
    location.hash === "#/covid" ||
    location.hash === "#/business" ||
    location.hash === "#/politics" ||
    location.hash === "#/science" ||
    location.hash === "#/religion" ||
    location.hash === "#/health"
  ) {
    if (searchInput.value) {
      searchArticle(auto_layout_keyboard(searchInput.value));
    }
  } else {
    if (searchInput.value) {
      searchByKeyWords(auto_layout_keyboard(searchInput.value));
    }
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && searchInput.value.length !== 0) {
    if (
      location.hash === "#/trending" ||
      location.hash === "#/sport" ||
      location.hash === "#/world" ||
      location.hash === "#/covid" ||
      location.hash === "#/business" ||
      location.hash === "#/politics" ||
      location.hash === "#/science" ||
      location.hash === "#/religion" ||
      location.hash === "#/health"
    ) {
      if (searchInput.value) {
        searchArticle(auto_layout_keyboard(searchInput.value));
      }
    } else {
      if (searchInput.value) {
        searchByKeyWords(auto_layout_keyboard(searchInput.value));
      }
    }
  }

  if (e.key === "Escape") {
    closeSearch();
    cancelSearchByKeyWords();
  }
});

async function searchArticle(value) {
  div.innerHTML = "";

  const result = await fetch(
    `https://content.guardianapis.com/search?q=${value}&show-tags=all&page-size=20&show-fields=all&order-by=relevance&api-key=5ef33414-1934-47dc-9892-5d09ab7c00da`
  )
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });

  const list = document.createElement("ul");
  list.classList.add("search__list");

  const findedArticles = result.response.results;

  if (findedArticles.length > 0) {
    findedArticles.map((article) => {
      const { headline } = article.fields;

      const item = document.createElement("li");
      item.setAttribute("id", article.id);
      item.classList.add("search__item");
      const link = document.createElement("a");
      link.classList.add("search__link");
      link.setAttribute("id", article.id);
      link.textContent = headline;
      link.addEventListener("click", (e) => {
        getArticleById(article.id);
        e.preventDefault();
        location.hash = article.id;
        setVisitedLinks(article.id);
      });

      item.appendChild(link);
      list.appendChild(item);
    });
  } else {
    list.insertAdjacentHTML(
      "afterbegin",
      '<p class="warning">No exact matches found</p>'
    );
  }

  searchButton.classList.add("header__search_button_hidden");
  closeSearchButton.classList.remove("close_search__button_hide");
  div.appendChild(list);
  div.classList.remove("search__area_hidden");

  localStorage.setItem("searchValue", value);
}

// -------------------------------------------------------------
// Закрытие поиска
closeSearchButton.addEventListener("click", () => {
  closeSearch();
  cancelSearchByKeyWords();
});

function closeSearch() {
  searchButton.classList.remove("header__search_button_hidden");
  div.classList.add("search__area_hidden");
  closeSearchButton.classList.add("close_search__button_hide");
  searchInput.value = "";
  localStorage.removeItem("searchValue");
}

function setSearchValue() {
  if (localStorage.getItem("searchValue")) {
    if (location.hash === "#/trending") {
      searchInput.value = localStorage.getItem("searchValue");
      searchArticle(localStorage.getItem("searchValue"));
    }
  }
}

// -------------------------------------------------------------
// Игнорирование раскладки

function auto_layout_keyboard(str) {
  const replacer = {
    й: "q",
    ц: "w",
    у: "e",
    к: "r",
    е: "t",
    н: "y",
    г: "u",
    ш: "i",
    щ: "o",
    з: "p",
    х: "[",
    ъ: "]",
    ф: "a",
    ы: "s",
    в: "d",
    а: "f",
    п: "g",
    р: "h",
    о: "j",
    л: "k",
    д: "l",
    ж: ";",
    э: "'",
    я: "z",
    ч: "x",
    с: "c",
    м: "v",
    и: "b",
    т: "n",
    ь: "m",
    б: ",",
    ю: ".",
    ".": "/",
  };

  let result = "";

  const stringArr = str.split("");

  stringArr.map((item, index) => {
    if (replacer[item.toLowerCase()]) {
      stringArr[index] = replacer[item.toLowerCase()];
    }
    result = stringArr.join("");
  });
  return result;
}
// -------------------------------------------------------------
// Поиск внутри статьи

function searchByKeyWords(value) {
  searchButton.classList.add("header__search_button_hidden");
  closeSearchButton.classList.remove("close_search__button_hide");

  const articleContainer = document.querySelector(".article_container");

  const text = articleContainer.innerHTML;
  localStorage.setItem("originalText", text);

  const textArr = text.split(" ");

  textArr.map((item, index) => {
    if (item === value) {
      textArr[index] = `<span class='text_find'>${item}</span>`;
    }
  });

  const markedText = textArr.join(" ");
  articleContainer.innerHTML = markedText;
}

function cancelSearchByKeyWords() {
  const hash = location.hash.split("");
  hash.splice(0, 1);
  const id = hash.join("");
  getArticleById(id);
}
