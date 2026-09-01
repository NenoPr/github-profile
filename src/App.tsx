import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [user, setUser] = useState({});
  const [query, setQuery] = useState("GitHub");

  const handleSearch = () => {
    fetch(`https://api.github.com/users/${encodeURIComponent(query)}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUser(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log("Enter pressed");
      handleSearch();
    }
  };

  return (
    <>
      <div className="background">
        <div className="search-contanier">
          <img src="../src/assets/Search.svg" alt="" />
          <input
            type="text"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex flex-row gap-3 search-info">
          <img
            src={user.avatar_url ? user.avatar_url : ""}
            className="image-avatar"
            alt=""
          />
          <div className="flex flex-col align-center justify-items-center justify-center text-left gap-1">
            <div>
              <strong className="text-white">GitHub</strong>
            </div>
            <div>{user.bio ? user.bio : ""}</div>
          </div>
        </div>
      </div>
      <div className="main-container">
        <div className="header-tabs">
          <div className="header-tab-image">
            <img
              src={user.avatar_url ? user.avatar_url : ""}
              alt=""
              className="image-header"
            />
          </div>
          <div className="header-tab">
            <div className="p-5">Followers</div>
            <div className="header-separator"></div>
            <div className="p-5">{user.followers ? user.followers : "NaN"}</div>
          </div>
          <div className="header-tab">
            <div className="p-5">Following</div>
            <div className="header-separator"></div>
            <div className="p-5">{user.following ? user.following : "NaN"}</div>
          </div>
          <div className="header-tab">
            <div className="p-5">Location</div>
            <div className="header-separator"></div>
            <div className="p-5">{user.location ? user.location : "NaN"}</div>
          </div>
        </div>
        <div className="middle-text">
          <h1 className="">GitHub</h1>
          <h3>How people build software.</h3>
        </div>
        <div className="cards-container">
          <div className="github-card"></div>
        </div>
      </div>
    </>
  );
}

export default App;
