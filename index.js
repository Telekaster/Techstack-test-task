location.hash = "/trending";
const mainDiv = document.querySelector("#action_area");

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

  const target = document.querySelector("#action_area");

  // mainDiv.innerHTML = "";

  switch (location.hash) {
    case "#/trending":
      getFreshOfArticles("trending", mainDiv);
      getArticles("trending");
      // const target = document.querySelector("#action_area");
      scrollUpButton(target);
      break;

    case "#/sport":
      getFreshOfArticles("sport", mainDiv);
      // const mainDiv = document.querySelector("#action_area");
      mainDiv.innerHTML = "";
      getArticles("sport");
      // const target = document.querySelector("#action_area");
      scrollUpButton(target);
      break;

    default:
      // const mainDiv = document.querySelector("#action_area");
      mainDiv.innerHTML = "";
      getArticleById(getPath());
      break;
  }
};

async function getFreshOfArticles(category, root) {
  console.log(root);
  console.log(category);
  showSpinner();
  const resultOfFetch = await fetch(
    `https://content.guardianapis.com/search?q=${category}&show-tags=all&page-size=20&show-fields=all&order-by=relevance&api-key=5ef33414-1934-47dc-9892-5d09ab7c00da`
  )
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      hideSpinner();
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
        <h2 class="hidden">Fresh news</h2>
        <div class="main_news__text_area">
          <h3 class="main_news__title">${freshTrending.fields.headline}</h3>
          <p class="main_news__text">${freshTrending.fields.bodyText}</p>
          <div class="main_news__date_area">
            <p class="main_news__date">${formatDate(
              freshTrending.webPublicationDate
            )}</p>
            <a class="main_news__link" href="">Read more</a>
          </div>
        </div>
        <div class="main_news__image_area">
          <img class="main_news__image" src="${imageUrl}"/>
        </div>
      </article>`
  );

  // const title = document.querySelector(".main_news__title");
  // title.textContent = freshTrending.fields.headline;

  // const text = document.querySelector(".main_news__text");
  // text.textContent = freshTrending.fields.bodyText;

  // const date = document.querySelector(".main_news__date");
  // date.textContent = formatDate(freshTrending.webPublicationDate);

  // const image = document.querySelector(".main_news__image");
  // image.setAttribute("src", imageUrl);

  // const link = document.querySelector(".main_news__link");
  // link.setAttribute("id", `/${freshTrending.id}`);

  // link.addEventListener("click", (e) => {
  //   e.preventDefault();
  //   location.hash = freshTrending.id;
  // });

  const link = document.querySelector(".main_news__link");
  link.addEventListener("click", (e) => {
    e.preventDefault();
    location.hash = freshTrending.id;
  });
}

async function getArticles(category) {
  const resultOfFetch = await fetch(
    `https://content.guardianapis.com/search?q=${category}&show-tags=all&page-size=20&show-fields=all&order-by=relevance&api-key=5ef33414-1934-47dc-9892-5d09ab7c00da`
  )
    .then((response) => response.json())
    .then((response) => {
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

  const list = document.querySelector(".other_news__list");

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
    articleTag.insertAdjacentHTML(
      "afterbegin",
      `
      <div class="other_news__image_area">
        <img class="other_news__image" src=${img}></img>
      </div >

      <h3 class='other_news__title'>${headline}</h3>
      <div class='other_news__text_area'>
        <p class='other_news__text'>${bodyText}</p>
      </div>


      `
    );
    div.appendChild(p);
    div.appendChild(link);
    articleTag.appendChild(div);
    item.appendChild(articleTag);
    list.appendChild(item);
  });
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
// Меню категорий
categories.addEventListener("click", () => {
  categories.classList.toggle("categories_active");
  categoriesMenuHandler();
});

function categoriesMenuHandler() {
  categoriesMenu.classList.toggle("categories_menu__hidden");
}

// -------------------------------------------------------------
