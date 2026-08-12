import { useMemo, useState } from "react";
import "./App.css";

const newsData = [
  {
    id: 1,
    category: "India",
    title: "India is entering a new era of digital growth",
    description:
      "Technology, startups and digital services are changing the way people work, learn and do business across India.",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
    time: "10 min ago",
    trending: true,
  },
  {
    id: 2,
    category: "World",
    title: "World leaders focus on technology and economic growth",
    description:
      "Countries around the world are looking at new opportunities in technology, trade and sustainable development.",
    image:
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80",
    time: "25 min ago",
    trending: true,
  },
  {
    id: 3,
    category: "Sports",
    title: "Big match brings fans together",
    description:
      "Sports fans are getting ready for another exciting contest as teams prepare for a high-energy match.",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    time: "35 min ago",
    trending: true,
  },
  {
    id: 4,
    category: "Tech",
    title: "Artificial intelligence is changing everyday technology",
    description:
      "From smartphones to education and business, AI is becoming an important part of modern digital life.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    time: "45 min ago",
    trending: true,
  },
  {
    id: 5,
    category: "Business",
    title: "Businesses prepare for a new digital economy",
    description:
      "Companies are investing in technology and new ideas to build faster and smarter businesses.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
    time: "1 hour ago",
    trending: false,
  },
  {
    id: 6,
    category: "India",
    title: "Young entrepreneurs build innovative startups",
    description:
      "A new generation of entrepreneurs is creating products and services for India's rapidly growing digital market.",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80",
    time: "1 hour ago",
    trending: false,
  },
  {
    id: 7,
    category: "Tech",
    title: "The future of smartphones is becoming smarter",
    description:
      "New mobile technologies are making smartphones more powerful, useful and connected than ever.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    time: "2 hours ago",
    trending: false,
  },
  {
    id: 8,
    category: "Sports",
    title: "Young athletes make their mark",
    description:
      "Emerging sporting talent is attracting attention with impressive performances and determination.",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
    time: "2 hours ago",
    trending: false,
  },
];

const categories = ["All", "India", "World", "Sports", "Tech", "Business"];

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState("latest");
  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredNews = useMemo(() => {
    let news = [...newsData];

    if (page === "trending") {
      news = news.filter((item) => item.trending);
    }

    if (category !== "All") {
      news = news.filter((item) => item.category === category);
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
  }, [category, search, page]);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      {/* HEADER */}
      <header className="header">
        <div className="container header-inner">
          <div className="logo" onClick={() => setPage("latest")}>
            NEWS<span>24</span>
          </div>

          <nav>
            <button
              className={page === "latest" ? "nav-active" : ""}
              onClick={() => setPage("latest")}
            >
              Latest
            </button>

            <button
              className={page === "trending" ? "nav-active" : ""}
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
              Latest stories, trending topics and important updates — all in
              one place.
            </p>
          </div>

          <div className="hero-badge">
            <strong>24</strong>
            <span>HOURS<br />OF NEWS</span>
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
              <button onClick={() => setSearch("")}>✕</button>
            )}
          </div>

          <div className="categories">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "category-active" : ""}
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
              {page === "trending" ? "🔥 TRENDING NOW" : "LATEST NEWS"}
            </p>

            <h2>
              {page === "trending" ? "What's trending" : "Top stories"}
            </h2>
          </div>

          <span className="story-count">
            {filteredNews.length} stories
          </span>
        </div>

        {filteredNews.length > 0 ? (
          <div className="news-grid">
            {filteredNews.map((news) => (
              <article
                className="news-card"
                key={news.id}
                onClick={() => setSelectedNews(news)}
              >
                <div
                  className="image-wrapper"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(news.image);
                  }}
                >
                  <img src={news.image} alt={news.title} />

                  <span className="category-tag">
                    {news.category}
                  </span>

                  {news.trending && (
                    <span className="trending-tag">🔥 Trending</span>
                  )}

                  <div className="image-view">🔍</div>
                </div>

                <div className="card-content">
                  <div className="card-meta">
                    <span>{news.time}</span>
                    <span>•</span>
                    <span>News24</span>
                  </div>

                  <h3>{news.title}</h3>

                  <p>{news.description}</p>

                  <button className="read-more">
                    Read story →
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="no-news">
            <div>🔎</div>
            <h3>No news found</h3>
            <p>Try another search or category.</p>

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

          <p>© 2026 News24. All rights reserved.</p>

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
              onClick={() => setSelectedNews(null)}
            >
              ✕
            </button>

            <img
              src={selectedNews.image}
              alt={selectedNews.title}
              onClick={() => setSelectedImage(selectedNews.image)}
            />

            <div className="modal-content">
              <span className="modal-category">
                {selectedNews.category}
              </span>

              <h2>{selectedNews.title}</h2>

              <p className="modal-time">
                {selectedNews.time} • News24
              </p>

              <p>{selectedNews.description}</p>

              <p>
                News24 brings you important stories from India and around
                the world. Check back regularly for the latest updates,
                trending topics and breaking stories.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE LIGHTBOX */}
      {selectedImage && (
        <div
          className="image-modal"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="image-close"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>

          <img
            src={selectedImage}
            alt="News"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default App;