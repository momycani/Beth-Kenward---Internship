import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "./carousel.css";


const HOT_COLLECTIONS_URL = "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections";

function PrevArrow({ className, style, onClick }) {
  return (
    <button
      type="button"
      aria-label="Previous"
      className={className}
      onClick={onClick}
      style={{...style }}
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
      style={{...style }}
    >
      <span className="arrow-next" aria-hidden="true">›</span>
    </button>
  );
}

const HotCollections = () => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);  
  const [collections, setCollections] = useState ([]);  
  const [showSkeleton, setShowSkeleton] = useState(false);
  
  useEffect(() => {
  const el = sectionRef.current;

  if (!el) {
    setInView(true);
    return;
  }
  if (!("IntersectionObserver" in window)) {
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
    {
      threshold: 0,                 
      rootMargin: "0px 0px 200px 0px",
    }
  );

  observer.observe(el);
  return () => observer.disconnect();
}, []);

  useEffect(() => {
    if (!inView) return;
    
  setShowSkeleton(true);
    const timerId = setTimeout(() => setShowSkeleton(false), 3000);

    return () => clearTimeout(timerId);
  }, [inView]);

  useEffect(() => {
    if (!inView) return;
    if (collections.length > 0) return;

  fetch(HOT_COLLECTIONS_URL)
    .then((res) => res.json())
    .then((data) => setCollections(data))
    .catch((err)=> console.error(err));      
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
      {breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      {breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      {breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <section ref={sectionRef} id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          {showSkeleton ? (
          <Slider {...settings}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`sk-${i}`}>
                <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
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
              </div>
            ))}
          </Slider>
        ) : (
          <Slider {...settings}>
            {collections.map((item) => (
              <div key={item.id}>
                <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                  <div className="nft_coll">
                    <div className="nft_wrap">
                      <Link to="/item-details">
                        <img src={item.nftImage} className="lazy img-fluid" alt={item.title} />
                      </Link>
                    </div>
                    <div className="nft_coll_pp">
                      <Link to="/author">
                        <img className="lazy pp-coll" src={item.authorImage} alt="author" />
                      </Link>
                      <i className="fa fa-check"></i>
                    </div>
                    <div className="nft_coll_info">
                      <Link to="/explore">
                        <h4>{item.title}</h4>
                      </Link>
                      <span>ERC-{item.code}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )
      }
        </div>
      </div>  
    </section>

    )}


export default HotCollections;
