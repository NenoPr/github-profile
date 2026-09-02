import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [user, setUser] = useState({ default: "Default" });
  const [repos, setRepos] = useState({ default: "Default" });
  const [query, setQuery] = useState("GitHub");
  const [reposPreview, setReposPreview] = useState(true);

  const handleSearch = () => {
    getUser();
  };

  const getUser = () => {
    fetch(`https://api.github.com/users/${encodeURIComponent(query)}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUser(data);
        getRepos(data.name);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getRepos = (name) => {
    fetch(`https://api.github.com/users/${encodeURIComponent(name)}/repos`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setRepos(data);
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
        {/* <div className="flex flex-row gap-3 search-info">
          <img
            src={user.avatar_url ? user.avatar_url : ""}
            className="image-avatar"
            alt=""
          />
          <div className="flex flex-col align-center justify-items-center justify-center text-left gap-1">
            <div>
              <strong className="text-white">{user.name}</strong>
            </div>
            <div>{user.bio ? user.bio : ""}</div>
          </div>
        </div> */}
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
            <div className="p-5 text-base">Followers</div>
            <div className="header-separator"></div>
            <div className="p-5 text-base">
              {user.followers ? user.followers : "NaN"}
            </div>
          </div>
          <div className="header-tab">
            <div className="p-5 text-base">Following</div>
            <div className="header-separator"></div>
            <div className="p-5 text-base">
              {user.following ? user.following : "NaN"}
            </div>
          </div>
          <div className="header-tab">
            <div className="p-5 text-base">Location</div>
            <div className="header-separator"></div>
            <div className="p-5 text-base">
              {user.location ? user.location : "NaN"}
            </div>
          </div>
        </div>
        <div className="middle-text">
          <h1 className="">{user.name}</h1>
          <h3>{user.bio}</h3>
        </div>
        <div className="cards-container">
          {Array.isArray(repos)
            ? reposPreview === true
              ? repos.slice(0, 4).map((repo) => (
                  <div
                    className="card"
                    key={repo.id}
                    onClick={() => window.open(repo.clone_url, "_blank")}
                  >
                    <div className="card-info">
                      <p>
                        <strong className="text-2xl">{repo.name}</strong>
                      </p>
                      <p>{repo.description}</p>
                    </div>
                    <div className="card-icons">
                      {repo.license ? (
                        <div className="card-icons-info">
                          <img
                            src={`../src/assets/Chield_alt.svg`}
                            alt=""
                            className="w-10"
                          />
                          <p>{repo.license.key.toUpperCase()}</p>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="card-icons-info">
                        <img
                          src={`../src/assets/Nesting.svg`}
                          alt=""
                          className="w-10"
                        />
                        <p>{repo.forks}</p>
                      </div>
                      <div className="card-icons-info">
                        <img
                          src={`../src/assets/Star.svg`}
                          alt=""
                          className="w-10"
                        />
                        <p>{repo.stargazers_count}</p>
                      </div>
                    </div>
                  </div>
                ))
              : repos.map((repo) => (
                  <div className="card" key={repo.id}>
                    <div className="card-info">
                      <p>
                        <strong className="text-2xl">{repo.name}</strong>
                      </p>
                      <p>{repo.description}</p>
                    </div>
                    <div className="card-icons">
                      {repo.license ? (
                        <div className="card-icons-info">
                          <img
                            src={`../src/assets/Chield_alt.svg`}
                            alt=""
                            className="w-10"
                          />
                          <p>{repo.license.key.toUpperCase()}</p>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="card-icons-info">
                        <img
                          src={`../src/assets/Nesting.svg`}
                          alt=""
                          className="w-10"
                        />
                        <p>{repo.forks}</p>
                      </div>
                      <div className="card-icons-info">
                        <img
                          src={`../src/assets/Star.svg`}
                          alt=""
                          className="w-10"
                        />
                        <p>{repo.stargazers_count}</p>
                      </div>
                    </div>
                  </div>
                ))
            : ""}
        </div>
        <div
          onClick={() => setReposPreview(!reposPreview)}
          className="view-repositories"
        >
          {reposPreview ? "View all repositories" : "Show less"}
        </div>
      </div>
    </>
  );
}

export default App;
