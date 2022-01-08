location.hash = "/trending";

window.onhashchange = () => {
  if (location.hash === "#/trending") {
    getFreshOfTrending();
    getTrending();
  } else {
    const mainDiv = document.querySelector("#action_area");
    mainDiv.innerHTML = "";
    getArticleById(getPath());
  }
};

async function getFreshOfTrending() {
  const resultOfFetch = await fetch(
    "https://content.guardianapis.com/search?q=trending&show-tags=all&page-size=20&show-fields=all&order-by=relevance&api-key=5ef33414-1934-47dc-9892-5d09ab7c00da"
  )
    .then((response) => response.json())
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
  const title = document.querySelector(".main_news__title");
  title.textContent = freshTrending.fields.headline;

  const text = document.querySelector(".main_news__text");
  text.textContent = freshTrending.fields.bodyText;

  const date = document.querySelector(".main_news__date");
  date.textContent = formatDate(freshTrending.webPublicationDate);

  const image = document.querySelector(".main_news__image");
  const imageUrl = freshTrending.fields.main.split('"')[5];
  image.setAttribute("src", imageUrl);

  const link = document.querySelector(".main_news__link");
  link.setAttribute("id", `/${freshTrending.id}`);

  link.addEventListener("click", (e) => {
    e.preventDefault();
    location.hash = freshTrending.id;
  });
}

async function getTrending() {
  const resultOfFetch = await fetch(
    "https://content.guardianapis.com/search?q=trending&show-tags=all&page-size=20&show-fields=all&order-by=relevance&api-key=5ef33414-1934-47dc-9892-5d09ab7c00da"
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
    item.insertAdjacentHTML(
      "afterbegin",
      `<article>
      <div class="other_news__image_area">
        <img class="other_news__image" src=${img}></img>
      </div >

      <h3 class='other_news__title'>${headline}</h3>
      <div class='other_news__text_area'>
     
          <p class='other_news__text'>${bodyText}</p>
      </div>
      <div class='other_news__date_area'>
          <p class='other_news__date'>${formatDate(firstPublicationDate)}</p>
          <a class='other_news__link' href='#' id = "${i.id}";>Read more</a>
      </div></article>`
    );
    list.appendChild(item);
  });
}

async function getArticleById(id) {
  const result = await fetch(
    `https://content.guardianapis.com/search?q=${id}&show-tags=all&page-size=20&show-fields=all&order-by=relevance&api-key=5ef33414-1934-47dc-9892-5d09ab7c00da`
  )
    .then((response) => response.json())
    .then((response) => {
      // console.log(response.response.results.find((item) => item.id === id));
      return response.response.results.find((item) => item.id === id);
    });
  // console.log(result);
  const article = result.fields;
  console.log(article);

  const imageUrl = article.main.split('"')[5];
  console.log(imageUrl);

  const mainDiv = document.querySelector("#action_area");
  mainDiv.insertAdjacentHTML(
    "afterbegin",
    `<div class='main_article__image_area'> 
      <img class="main_article__image" src=${imageUrl} />
    </div>`
  );
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
