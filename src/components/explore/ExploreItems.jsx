import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Countdown from "../home/Countdown";
import SkeletonLoading from "../home/SkeletonLoading";

const DEFAULT_FILTER = "likes_high_to_low";

const EXPLORE_ITEMS_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore?filter=likes_high_to_low";

function toNumberPrice(p) {
  const n = typeof p === "number" ? p : parseFloat(String(p));
  return Number.isFinite(n) ? n : 0;
}

const ExploreItems = () => {
  const location = useLocation();

  const [items, setItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [filter, setFilter] = useState(DEFAULT_FILTER);

  // Fetch once on mount + show skeleton for 3s
  useEffect(() => {
    const t = setTimeout(() => setShowSkeleton(false), 2000);

    fetch(EXPLORE_ITEMS_URL)
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(console.error);

    return () => clearTimeout(t);
  }, []);

  // Reset dropdown when user returns to /explore
  useEffect(() => {
    if (location.pathname === "/explore") {
      setFilter(DEFAULT_FILTER);
      setVisibleCount(8);
    }
  }, [location.pathname]);

  const sortedItems = useMemo(() => {
    const arr = [...items];

    if (filter === "price_low_to_high") {
      arr.sort((a, b) => toNumberPrice(a.price) - toNumberPrice(b.price));
    } else if (filter === "price_high_to_low") {
      arr.sort((a, b) => toNumberPrice(b.price) - toNumberPrice(a.price));
    } else {
      // Default / Most liked
      arr.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
    }

    return arr;
  }, [items, filter]);

  const visibleItems = sortedItems.slice(0, visibleCount);

  return (
    <>
      <div className="row mb-3">
        <div className="col-12">
          <select
            id="filter-items"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setVisibleCount(8);
            }}
          >
            <option value={DEFAULT_FILTER}>Default</option>
            <option value="price_low_to_high">Price, Low to High</option>
            <option value="price_high_to_low">Price, High to Low</option>
            <option value="likes_high_to_low">Most liked</option>
          </select>
        </div>
      </div>

      <div className="row explore-grid">
        {showSkeleton ? (
          <SkeletonLoading count={8} />
        ) : (
          visibleItems.map((item, index) => {
            const id = item.nftId ?? item.id;
            if (!id) return null;

            return (
              <div
                key={id ?? index}
                className="d-item explore-col"
                style={{ display: "block", backgroundSize: "cover" }}
              >
                <div className="nft__item">
                  <div className="author_list_pp">
                    <Link to={`/author/${item.authorId}`} state={{ item }}>
                      <img
                        className="lazy"
                        src={item.authorImage}
                        alt={item.authorName}
                      />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>

                  <div className="de_countdown">
                    <Countdown expiryDate={item.expiryDate} />
                  </div>

                  <div className="nft__item_wrap">
                    <div className="nft__item_extra">
                      <div className="nft__item_buttons">
                        <button type="button">Buy Now</button>
                        <div className="nft__item_share">
                          <h4>Share</h4>
                          <a href="" target="_blank" rel="noreferrer">
                            <i className="fa fa-facebook fa-lg"></i>
                          </a>
                          <a href="" target="_blank" rel="noreferrer">
                            <i className="fa fa-twitter fa-lg"></i>
                          </a>
                          <a href="">
                            <i className="fa fa-envelope fa-lg"></i>
                          </a>
                        </div>
                      </div>
                    </div>

                    <Link to={`/item/${id}`} state={{ item }}>
                      <img
                        src={item.nftImage}
                        className="lazy nft__item_preview"
                        alt={item.title}
                      />
                    </Link>
                  </div>

                  <div className="nft__item_info">
                    <Link to={`/item/${id}`} state={{ item }}>
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
          })
        )}
      </div>

      <div className="row">
        <div className="col-md-12 text-center">
          {!showSkeleton && visibleCount < sortedItems.length && (
            <button
              type="button"
              id="loadmore"
              className="btn-main lead" data-aos="fade-up" data-aos-delay="50" data-aos-duration="1000"
              onClick={() => setVisibleCount((c) => c + 4)}
            >
              Load more
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ExploreItems;
