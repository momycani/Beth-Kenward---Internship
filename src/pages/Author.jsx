import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import "../components/home/carousel.css";
import SkeletonLoading from "../components/home/SkeletonLoading";

const Author = () => {
  const { authorId } = useParams();
  const { state } = useLocation();

  const [author, setAuthor] = useState(state?.item ?? null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [baseFollowers, setBaseFollowers] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [authorId]);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);

    fetch(
      `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${encodeURIComponent(
        authorId
      )}`,
      { signal: controller.signal }
    )
      .then((res) => res.json())
      .then((data) => {
        const profile = Array.isArray(data) ? data[0] : data;

    if (!profile) {
      setAuthor(null);
      return;
    }

    // followers from API 
    const baseFollowers = Number(profile.followers) || 0;

    // load saved follow state for THIS author
    const savedIsFollowing = JSON.parse(localStorage.getItem(`follow:${authorId}`))?.isFollowing || false;
   
    setAuthor(profile);
    setIsFollowing(savedIsFollowing);
    setBaseFollowers(baseFollowers);
        
      })
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [authorId]);

    const handleToggleFollow = () => {
      const next = !isFollowing;
      setIsFollowing(next);
      localStorage.setItem(`follow:${authorId}`, JSON.stringify({ isFollowing: next }));
    };

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          style={{ background: `url(${AuthorBanner}) top` }}
        />

        <section aria-label="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                {loading || !author ? (
                  <SkeletonLoading count={1} mode="author" />
                ) : (
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        <img src={author.authorImage} alt={author.authorName} />
                        <i className="fa fa-check"></i>

                        <div className="profile_name">
                          <h4>
                            {author.authorName}
                            <span className="profile_username">@{author.tag}</span>
                            <span id="wallet" className="profile_wallet">
                              {author.address}
                            </span>
                            <button id="btn_copy" title="Copy Text">
                              Copy
                            </button>
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="profile_follow de-flex">
                      <div className="de-flex-col">
                        <div className="profile_follower">
                          {baseFollowers + (isFollowing ? 1 : 0)} followers
                        </div>
                        <button type="button" className="btn-main" onClick={handleToggleFollow}>
                          {isFollowing ? "Unfollow" : "Follow"}                         
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  {loading ? <SkeletonLoading count={8} /> : <AuthorItems />}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;