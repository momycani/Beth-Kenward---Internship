import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "./carousel.css";
import Countdown from "./Countdown";

const NEW_ITEMS_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems";

function PrevArrow({ className, style, onClick }) {
  return (
    <button
      type="button"
      aria-label="Previous"
      className={className}
      onClick={onClick}
      style={{ ...style }}
    >
      <span className="arrow-prev" aria-hidden="true">‹</span>
    </button>
  );
}

function NextArrow({ className, style, onClick }) {
  return (
    <button
      type="button"
      aria-label="Next"
      className={className}
      onClick={onClick}
      style={{ ...style }}
    >
      <span className="arrow-next" aria-hidden="true">›</span>
    </button>
  );
}

function NewItems() {
  const sectionRef = useRef(null);

  const [inView, setInView] = useState(false);
  const [collections, setCollections] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(false);
    
  useEffect(() => {
    const el = sectionRef.current;

    if (!el || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px 200px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    if (!inView) return;
    setShowSkeleton(true);
    const t = setTimeout(() => setShowSkeleton(false), 3000);
    return () => clearTimeout(t);
  }, [inView]);
  
  useEffect(() => {
    if (!inView) return;
    if (collections.length > 0) return;

    fetch(NEW_ITEMS_URL)
      .then((r) => r.json())
      .then((data) => setCollections(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [inView, collections.length]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  const skeletonSlides = Array.from({ length: 8 }).map((_, i) => (
    <div key={`sk-${i}`}>
      <div className="nft__item skeleton">
        <div className="author_list_pp">
          <div className="sk-avatar" />
        </div>

        <div className="de_countdown">
          <div className="sk-pill" />
        </div>

        <div className="nft__item_wrap">
          <div className="sk-image" />
        </div>

        <div className="nft__item_info">
          <div className="sk-line sk-title" />
          <div className="sk-line sk-price" />
          <div className="sk-like" />
        </div>
      </div>
    </div>
  ));

  const realSlides = collections.map((item) => (
    <div key={item.nftId ?? item.id}>
      <div className="nft__item">
        <div className="author_list_pp">
          <Link to={`/author/${item.authorId}`}>
            <img className="lazy" src={item.authorImage} alt="Author" />
            <i className="fa fa-check" />
          </Link>
        </div>

        <div className="de_countdown"><Countdown expiryDate={item.expiryDate} />
        </div>

        <div className="nft__item_wrap">
          <Link to={`/item-details/${item.nftId}`} state={{ item }}>
            <img
              src={item.nftImage}
              className="lazy nft__item_preview"
              alt={item.title}
            />
          </Link>
        </div>

        <div className="nft__item_info">
          <Link to={`/item-details/${item.nftId}`}>
            <h4>{item.title}</h4>
          </Link>
          <div className="nft__item_price">{item.price} ETH</div>
          <div className="nft__item_like">
            <i className="fa fa-heart" />
            <span>{item.likes}</span>
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <section ref={sectionRef} id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          <div className="col-lg-12">
            <Slider {...settings}>
              {showSkeleton
                ? Array.from({ length: 8 }).map((_, i) => (
                    <div key={`sk-${i}`}>
                      <div className="nft_coll skeleton-card">
                        <div className="nft_wrap">
                          <div className="skeleton skeleton-img" />
                        </div>
                        <div className="nft_coll_info">
                          <div className="skeleton skeleton-line title" />
                          <div className="skeleton skeleton-line code" />
                        </div>
                      </div>
                    </div>
                  ))
                : realSlides}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NewItems;