import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SkeletonLoading from "../home/SkeletonLoading"; 
import Countdown from "../home/Countdown";

const AuthorItems = () => {
  const { authorId } = useParams();
  const [profile, setProfile] = useState(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

        setProfile(profile);

        const extracted = profile?.nftCollection ?? [];

        setItems(Array.isArray(extracted) ? extracted : []);
      })

      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [authorId]);

  if (loading) {
    return (
      <div className="de_tab_content">
        <div className="tab-1">
          <div className="row">
            <SkeletonLoading count={8} />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="de_tab_content">
        <div className="tab-1">
          <div className="row">
            <div className="col-12" style={{ padding: 16 }}>
              No items found for this author.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row author-grid">
          {items.map((item) => {
            const nftId = item.nftId;

            return (
              <div className="author-col" key={nftId}>
                <div className="nft__item">
                  <div className="author_list_pp">
                    <Link to={`/author/${authorId}`}>
                      <img
                        className="lazy"
                        src={profile?.authorImage}
                        alt={profile?.authorName} />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>
                    {item.expiryDate && (
                      <div className="de_countdown">
                        <Countdown expiryDate={item.expiryDate} />
                      </div>
                    )}
                  <div className="nft__item_wrap">
                    <div className="nft__item_extra">
                      <div className="nft__item_buttons">
                        <button>Buy Now</button>
                        <div className="nft__item_share">
                          <h4>Share</h4>
                          <a href="#" target="_blank" rel="noreferrer">
                            <i className="fa fa-facebook fa-lg"></i>
                          </a>
                          <a href="#" target="_blank" rel="noreferrer">
                            <i className="fa fa-twitter fa-lg"></i>
                          </a>
                          <a href="#">
                            <i className="fa fa-envelope fa-lg"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                   
                    <Link to={`/item/${nftId}`} state={{ item }}>
                      <img
                        src={item.nftImage}
                        className="lazy nft__item_preview"
                        alt={item.title}
                      />
                    </Link>
                  </div>

                  <div className="nft__item_info">
                    <Link to={`/item/${nftId}`} state={{ item }}>
                      <h4>{item.title}</h4>
                    </Link>
                    <div className="nft__item_price">{item.price} ETH</div>
                    <div className="nft__item_like">
                      <i className="fa fa-heart"></i>
                      <span>{item.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AuthorItems;