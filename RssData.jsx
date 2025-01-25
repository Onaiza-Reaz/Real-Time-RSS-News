import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RssData.css";

const entertainmentChannels = [
  { value: "all", label: "All Channels" },
  { value: "The-News-RSS", label: "The News" },
  { value: "Geo-News-RSS", label: "Geo News" },
  { value: "CNN-RSS", label: "CNN" },
  { value: "Dailymail-RSS", label: "Dailymail" },
  { value: "Mirror-Lifestyle-RSS", label: "Mirror Lifestyle" },
  { value: "Hollywood-Life-RSS", label: "Hollywood Life" },
  { value: "Entertainment-News-RSS", label: "Entertainment News" },
  { value: "EOL-Online-RSS", label: "EOL Online RSS" },
  { value: "ET-Online-RSS", label: "ET Online RSS" },
  { value: "Variety-RSS", label: "Variety RSS" },
];

const sportsChannels = [
  { value: "all", label: "All Channels" },
  { value: "The-News-RSS", label: "The News" },
  { value: "Geo-News-RSS", label: "Geo News" },
  { value: "ARY-News-RSS", label: "ARY News" }
];

const normalizeChannel = (channel) => {
  const mapping = {
    "TV & showbiz | Mail Online": "Dailymail-RSS",
    "E! Online (US) - Top Stories": "EOL-Online-RSS",
    "Entertainment News, Events & Reviews - Us Weekly": "Entertainment-News-RSS",
    "Mirror - Lifestyle": "Mirror-Lifestyle-RSS",
    "Variety": "Variety-RSS",
    "The News International - Entertainment": "The-News-RSS",
    "GEO NEWS - Entertainment": "Geo-News-RSS",
    "CNN.com - RSS Channel - Entertainmen": "CNN-RSS",
    "Lifestyle": "ET-Online-RSS",
    "Hollywood Life": "Hollywood-Life-RSS",
    "Sports News- ARY News": "ARY-News-RSS"
  };

  return mapping[channel] || channel;
};

const renderArticles = (articles, section) => {
  if (articles.length === 0) {
    return <p>No articles found for this channel.</p>;
  }

  return articles.map((article, index) => (
    <div className="article" key={`${section}-${index}`}>
      <h2>{article.title}</h2>
      <p>
        <strong>Published:</strong> {article.pubDate}
      </p>
      <p>
        <strong>Channel:</strong> {article.channel}
      </p>
      <a href={article.link} target="_blank" rel="noopener noreferrer">
        Read more
      </a>
    </div>
  ));
};

const ArticleSection = ({
  section,
  articles,
  loading,
  channel,
  setChannel,
  category,
  setCategory,
  error,
}) => (
  <div className="section-container">
    <h1>Articles</h1>
    <label htmlFor={`category-select-${section}`}>Select Category:</label>
    <select
      id={`category-select-${section}`}
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    >
      <option value="entertainment">Entertainment</option>
      <option value="sports">Sports</option>
    </select>

    <label htmlFor={`channel-select-${section}`}>Select Channel:</label>
    <select
      id={`channel-select-${section}`}
      value={channel}
      onChange={(e) => setChannel(e.target.value)}
    >
      {(category === "entertainment" ? entertainmentChannels : sportsChannels).map(
        (option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        )
      )}
    </select>

    {error && <p className="error">{error}</p>}
    <div id={`articles-list-${section}`} className="articles-list">
      {loading ? <p>Loading articles...</p> : renderArticles(articles, section)}
    </div>
  </div>
);

const RssData = ({ onLogout }) => {
  const navigate = useNavigate();
  const [articlesTopLeft, setArticlesTopLeft] = useState([]);
  const [articlesTopRight, setArticlesTopRight] = useState([]);
  const [articlesBottomLeft, setArticlesBottomLeft] = useState([]);
  const [articlesBottomRight, setArticlesBottomRight] = useState([]);

  const [categoryTopLeft, setCategoryTopLeft] = useState("entertainment");
  const [categoryTopRight, setCategoryTopRight] = useState("entertainment");
  const [categoryBottomLeft, setCategoryBottomLeft] = useState("entertainment");
  const [categoryBottomRight, setCategoryBottomRight] = useState("entertainment");

  const [channelTopLeft, setChannelTopLeft] = useState("all");
  const [channelTopRight, setChannelTopRight] = useState("all");
  const [channelBottomLeft, setChannelBottomLeft] = useState("all");
  const [channelBottomRight, setChannelBottomRight] = useState("all");

  const [loadingTopLeft, setLoadingTopLeft] = useState(false);
  const [loadingTopRight, setLoadingTopRight] = useState(false);
  const [loadingBottomLeft, setLoadingBottomLeft] = useState(false);
  const [loadingBottomRight, setLoadingBottomRight] = useState(false);

  const [errorTopLeft, setErrorTopLeft] = useState(null);
  const [errorTopRight, setErrorTopRight] = useState(null);
  const [errorBottomLeft, setErrorBottomLeft] = useState(null);
  const [errorBottomRight, setErrorBottomRight] = useState(null);

  const fetchArticles = async (section, category, channel) => {
    const setArticles =
      section === "topLeft"
        ? setArticlesTopLeft
        : section === "topRight"
        ? setArticlesTopRight
        : section === "bottomLeft"
        ? setArticlesBottomLeft
        : setArticlesBottomRight;

    const setLoading =
      section === "topLeft"
        ? setLoadingTopLeft
        : section === "topRight"
        ? setLoadingTopRight
        : section === "bottomLeft"
        ? setLoadingBottomLeft
        : setLoadingBottomRight;

    const setError =
      section === "topLeft"
        ? setErrorTopLeft
        : section === "topRight"
        ? setErrorTopRight
        : section === "bottomLeft"
        ? setErrorBottomLeft
        : setErrorBottomRight;

    setLoading(true);
    setError(null);

    try {
      const endpoint =
        category === "entertainment"
          ? "http://127.0.0.1:5000/api/articles"
          : "http://127.0.0.1:5000/api/sports";

      const response = await axios.get(endpoint);
      let articles = response.data.data;

      articles = articles.map((article) => ({
        ...article,
        channel: normalizeChannel(article.channel),
      }));

      if (channel !== "all") {
        articles = articles.filter((article) => article.channel === channel);
      }

      setArticles(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError("Failed to fetch articles. Please try again later.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles("topLeft", categoryTopLeft, channelTopLeft);
    fetchArticles("topRight", categoryTopRight, channelTopRight);
    fetchArticles("bottomLeft", categoryBottomLeft, channelBottomLeft);
    fetchArticles("bottomRight", categoryBottomRight, channelBottomRight);
  }, [
    categoryTopLeft,
    channelTopLeft,
    categoryTopRight,
    channelTopRight,
    categoryBottomLeft,
    channelBottomLeft,
    categoryBottomRight,
    channelBottomRight,
  ]);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div className="rss-data">
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <ArticleSection
        section="topLeft"
        articles={articlesTopLeft}
        loading={loadingTopLeft}
        channel={channelTopLeft}
        setChannel={setChannelTopLeft}
        category={categoryTopLeft}
        setCategory={setCategoryTopLeft}
        error={errorTopLeft}
      />
      <ArticleSection
        section="topRight"
        articles={articlesTopRight}
        loading={loadingTopRight}
        channel={channelTopRight}
        setChannel={setChannelTopRight}
        category={categoryTopRight}
        setCategory={setCategoryTopRight}
        error={errorTopRight}
      />
      <ArticleSection
        section="bottomLeft"
        articles={articlesBottomLeft}
        loading={loadingBottomLeft}
        channel={channelBottomLeft}
        setChannel={setChannelBottomLeft}
        category={categoryBottomLeft}
        setCategory={setCategoryBottomLeft}
        error={errorBottomLeft}
      />
      <ArticleSection
        section="bottomRight"
        articles={articlesBottomRight}
        loading={loadingBottomRight}
        channel={channelBottomRight}
        setChannel={setChannelBottomRight}
        category={categoryBottomRight}
        setCategory={setCategoryBottomRight}
        error={errorBottomRight}
      />
    </div>
  );
};

export default RssData;
