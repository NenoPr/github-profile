import { useState, useEffect } from "react";
import type { GitHubUser } from "./types/types";

import SearchIcon from "./assets/Search.svg";
import ShieldIcon from "./assets/Chield_alt.svg";
import NestingIcon from "./assets/Nesting.svg";
import StarIcon from "./assets/Star.svg";

import "./App.css";

type GitHubRepo = {
  id: number;
  name: string;
  description: string | null;
  clone_url: string;
  forks: number;
  stargazers_count: number;
  license: {
    key: string;
  } | null;
};

type userPreview = {
  id: number;
  login: string;
  avatar_url: string;
  name: string | null;
  bio: string | null;
};

function App() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [previewUser, setPreviewUser] = useState<userPreview | null>(null);
  const [query, setQuery] = useState("GitHub");
  const [reposPreview, setReposPreview] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setPreviewUser(null);
      return;
    }

    const timeout = setTimeout(() => {
      handleUserSearch(query);
    }, 800);

    return () => {
      clearTimeout(timeout);
    };
  }, [query]);

  const handleSearch = () => {
    getUser();
  };

  const handleUserSearch = (value: string) => {
    fetch(`https://api.github.com/users/${encodeURIComponent(value)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("User not found");
        }

        return response.json();
      })
      .then((data: userPreview) => {
        setPreviewUser(data);
      })
      .catch((error) => {
        console.error(error);
        setPreviewUser(null);
      });
  };

  const getUser = () => {
    fetch(`https://api.github.com/users/${encodeURIComponent(query)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("User not found");
        }

        return response.json();
      })
      .then((data: GitHubUser) => {
        console.log(data);

        setUser(data);

        // GitHub repo URL requires username/login,
        // not the person's display name.
        getRepos(data.login);
      })
      .catch((error) => {
        console.error(error);

        setUser(null);
        setRepos([]);
      });
  };

  const getRepos = (name: string) => {
    fetch(`https://api.github.com/users/${encodeURIComponent(name)}/repos`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load repositories");
        }

        return response.json();
      })
      .then((data: GitHubRepo[]) => {
        console.log(data);
        setRepos(data);
        setPreviewUser(null);
      })
      .catch((error) => {
        console.error(error);
        setRepos([]);
      });
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
      setPreviewUser(null);
    }
  };

  const displayedRepos = reposPreview ? repos.slice(0, 4) : repos;

  return (
    <>
      <div className="background">
        <div className="search-contanier">
          <img src={SearchIcon} alt="Search" />

          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        {previewUser && (
          <div className="search-user-container">
            <div className="user-search-card">
              <img
                src={previewUser.avatar_url}
                alt=""
                className="image-header-preview"
              />
              <div className="user-search-info">
                <div className="text-2xl">
                  <strong>{previewUser.name}</strong>
                </div>
                <div>{previewUser.bio}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="main-container">
        {user ? (
          <>
            <div className="header-tabs">
              <div className="header-tab-image">
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="image-header"
                />
              </div>

              <div className="header-tab">
                <div className="p-5 text-base">Followers</div>

                <div className="header-separator"></div>

                <div className="p-5 text-base">{user.followers}</div>
              </div>

              <div className="header-tab">
                <div className="p-5 text-base">Following</div>

                <div className="header-separator"></div>

                <div className="p-5 text-base">{user.following}</div>
              </div>

              <div className="header-tab">
                <div className="p-5 text-base">Location</div>

                <div className="header-separator"></div>

                <div className="p-5 text-base">
                  {user.location ?? "Unknown"}
                </div>
              </div>
            </div>

            <div className="middle-text">
              <h1>{user.name ?? user.login}</h1>
              <h3>{user.bio ?? ""}</h3>
            </div>
          </>
        ) : (
          <div className="mt-3">
            <strong>Nothing here yet...</strong>
          </div>
        )}

        <div className="cards-container">
          {displayedRepos.map((repo) => (
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
                {repo.license && (
                  <div className="card-icons-info">
                    <img src={ShieldIcon} alt="License" className="w-10" />

                    <p>{repo.license.key.toUpperCase()}</p>
                  </div>
                )}

                <div className="card-icons-info">
                  <img src={NestingIcon} alt="Forks" className="w-10" />

                  <p>{repo.forks}</p>
                </div>

                <div className="card-icons-info">
                  <img src={StarIcon} alt="Stars" className="w-10" />

                  <p>{repo.stargazers_count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {repos.length > 4 && (
          <div
            onClick={() => setReposPreview((previous) => !previous)}
            className="view-repositories"
          >
            {reposPreview ? "View all repositories" : "Show less"}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
