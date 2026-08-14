import { useEffect, useMemo, useState } from "react";
import "./App.css";

const categories = ["All", "India", "World", "Sports", "Tech", "Business"];

const fallbackImage =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState("latest");

  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setApiError("");

        const API_KEY = import.meta.env.VITE_API_KEY;

        if (!API_KEY) {
          throw new Error(
            "VITE_API_KEY nahi mili. .env file check karo."
          );
        }

        const response = await fetch(
  "https://api.currentsapi.services/v1/latest-news?language=en&page_size=20",
  {
    headers: {
      Authorization: API_KEY,
    },
  }
);

        const data = await response.json();

        console.log(JSON.stringify(data, null, 2));

        if (!response.ok) {
          throw new Error(
            data.message || "API request failed"
          );
        }

        if (!data.news || !Array.isArray(data.news)) {
          throw new Error("API se news data nahi mila.");
        }

        const formattedNews = data.news.map((article, index) => {
          let articleCategory = "World";

          const text = `
            ${article.title || ""}
            ${article.description || ""}
            ${(article.category || []).join(" ")}
          `.toLowerCase();

          if (
            text.includes("india") ||
            text.includes("indian") ||
            text.includes("delhi") ||
            text.includes("mumbai")
          ) {
            articleCategory = "India";
          } else if (
            text.includes("sport") ||
            text.includes("cricket") ||
            text.includes("football") ||
            text.includes("tennis")
          ) {
            articleCategory = "Sports";
          } else if (
            text.includes("technology") ||
            text.includes("tech") ||
            text.includes("ai") ||
            text.includes("artificial intelligence")
          ) {
            articleCategory = "Tech";
          } else if (
            text.includes("business") ||
            text.includes("market") ||
            text.includes("finance") ||
            text.includes("stock")
          ) {
            articleCategory = "Business";
          }

          return {
            id: article.id || index,
            category: articleCategory,
            title: article.title || "No title available",
            description:
              article.description || "No description available.",
            image: article.image || fallbackImage,
            time: article.published
              ? new Date(article.published).toLocaleString()
              : "Recently",
            trending: index < 5,
            url: article.url || "#",
          };
        });

        setNewsData(formattedNews);
      } catch (error) {
        console.error("Currents API Error:", error);

        setApiError(
          error.message || "News fetch nahi ho payi."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = useMemo(() => {
    let news = [...newsData];

    if (page === "trending") {
      news = news.filter((item) => item.trending);
    }

    if (category !== "All") {
      news = news.filter(
        (item) => item.category === category
      );
    }

    if (search.trim()) {
      const text = search.toLowerCase();

      news = news.filter(
        (item) =>
          item.title.toLowerCase().includes(text) ||
          item.description.toLowerCase().includes(text) ||
          item.category.toLowerCase().includes(text)
      );
    }

    return news;
  }, [category, search, page, newsData]);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      {/* HEADER */}
      <header className="header">
        <div className="container header-inner">
          <div
            className="logo"
            onClick={() => setPage("latest")}
          >
            NEWS<span>24</span>
          </div>

          <nav>
            <button
              className={
                page === "latest" ? "nav-active" : ""
              }
              onClick={() => setPage("latest")}
            >
              Latest
            </button>

            <button
              className={
                page === "trending" ? "nav-active" : ""
              }
              onClick={() => setPage("trending")}
            >
              🔥 Trending
            </button>
          </nav>

          <button
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
            title="Change theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <p className="eyebrow">YOUR DAILY NEWS</p>

            <h1>
              Stay informed.
              <br />
              <span>Stay ahead.</span>
            </h1>

            <p className="hero-text">
              Latest stories, trending topics and important
              updates — all in one place.
            </p>
          </div>

          <div className="hero-badge">
            <strong>24</strong>

            <span>
              HOURS
              <br />
              OF NEWS
            </span>
          </div>
        </div>
      </section>

      {/* SEARCH + CATEGORIES */}
      <section className="controls">
        <div className="container">
          <div className="search-box">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search news..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button onClick={() => setSearch("")}>
                ✕
              </button>
            )}
          </div>

          <div className="categories">
            {categories.map((item) => (
              <button
                key={item}
                className={
                  category === item
                    ? "category-active"
                    : ""
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS */}
      <main className="main container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              {page === "trending"
                ? "🔥 TRENDING NOW"
                : "LATEST NEWS"}
            </p>

            <h2>
              {page === "trending"
                ? "What's trending"
                : "Top stories"}
            </h2>
          </div>

          <span className="story-count">
            {filteredNews.length} stories
          </span>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="no-news">
            <div>⏳</div>
            <h3>Loading latest news...</h3>
            <p>Please wait.</p>
          </div>
        )}

        {/* API ERROR */}
        {!loading && apiError && (
          <div className="no-news">
            <div>⚠️</div>

            <h3>News load nahi hui</h3>

            <p>{apiError}</p>

            <button
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {/* NEWS GRID */}
        {!loading &&
          !apiError &&
          filteredNews.length > 0 && (
            <div className="news-grid">
              {filteredNews.map((news) => (
                <article
                  className="news-card"
                  key={news.id}
                  onClick={() =>
                    setSelectedNews(news)
                  }
                >
                  <div
                    className="image-wrapper"
                    onClick={(e) => {
                      e.stopPropagation();

                      setSelectedImage(news.image);
                    }}
                  >
                    <img
                      src={news.image}
                      alt={news.title}
                      onError={(e) => {
                        e.currentTarget.src =
                          fallbackImage;
                      }}
                    />

                    <span className="category-tag">
                      {news.category}
                    </span>

                    {news.trending && (
                      <span className="trending-tag">
                        🔥 Trending
                      </span>
                    )}

                    <div className="image-view">
                      🔍
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="card-meta">
                      <span>{news.time}</span>

                      <span>•</span>

                      <span>News24</span>
                    </div>

                    <h3>{news.title}</h3>

                    <p>{news.description}</p>

                    <button
                      className="read-more"
                      onClick={(e) => {
                        e.stopPropagation();

                        setSelectedNews(news);
                      }}
                    >
                      Read story →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

        {/* NO RESULTS */}
        {!loading &&
          !apiError &&
          filteredNews.length === 0 && (
            <div className="no-news">
              <div>🔎</div>

              <h3>No news found</h3>

              <p>
                Try another search or category.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setPage("latest");
                }}
              >
                Show all news
              </button>
            </div>
          )}
      </main>

      {/* FOOTER */}
      <footer>
        <div className="container footer-inner">
          <div className="logo">
            NEWS<span>24</span>
          </div>

          <p>
            © 2026 News24. All rights reserved.
          </p>

          <p className="footer-small">
            Fast • Simple • Reliable
          </p>
        </div>
      </footer>

      {/* NEWS DETAIL MODAL */}
      {selectedNews && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedNews(null)}
        >
          <div
            className="news-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() =>
                setSelectedNews(null)
              }
            >
              ✕
            </button>

            <img
              src={selectedNews.image}
              alt={selectedNews.title}
              onClick={() =>
                setSelectedImage(
                  selectedNews.image
                )
              }
              onError={(e) => {
                e.currentTarget.src =
                  fallbackImage;
              }}
            />

            <div className="modal-content">
              <span className="modal-category">
                {selectedNews.category}
              </span>

              <h2>{selectedNews.title}</h2>

              <p className="modal-time">
                {selectedNews.time} • News24
              </p>

              <p>
                {selectedNews.description}
              </p>

              <p>
                News24 brings you important stories
                from India and around the world. Check
                back regularly for the latest updates,
                trending topics and breaking stories.
              </p>

              {selectedNews.url &&
                selectedNews.url !== "#" && (
                  <a
                    href={selectedNews.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="read-more"
                  >
                    Read full story →
                  </a>
                )}
            </div>
          </div>
        </div>
      )}

      {/* IMAGE LIGHTBOX */}
      {selectedImage && (
        <div
          className="image-modal"
          onClick={() =>
            setSelectedImage(null)
          }
        >
          <button
            className="image-close"
            onClick={() =>
              setSelectedImage(null)
            }
          >
            ✕
          </button>

          <img
            src={selectedImage}
            alt="News"
            onClick={(e) =>
              e.stopPropagation()
            }
            onError={(e) => {
              e.currentTarget.src =
                fallbackImage;
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;