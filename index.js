if (window.location.pathname === "/") {
  getFreshOFTrending();
}

async function getFreshOFTrending() {
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

  const publicDate = new Date(freshTrending.webPublicationDate);
  const formatDate = publicDate.toDateString();
  const formatDateArr = formatDate.split(" ");
  formatDateArr.splice(0, 1);
  formatDateArr[1] = formatDateArr[1] + "th";
  const resultDate = formatDateArr.join(" ");
  const date = document.querySelector(".main_news__date");
  date.textContent = resultDate;

  const image = document.querySelector(".main_news__image");

  const imageUrl = freshTrending.fields.main.split('"')[5];
  image.setAttribute("src", imageUrl);
}
