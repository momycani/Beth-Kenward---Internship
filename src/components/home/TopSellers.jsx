import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./carousel.css";


const TOP_SELLERS_URL = "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers";

const TopSellers = () => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [collections, setCollections] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [, forceTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => forceTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);
 
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

    fetch(TOP_SELLERS_URL)
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
    responsive: [
      { breakpoint: 990, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 745, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 470, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-md-12">
              <ol className="author_list">
                {showSkeleton ? new Array(12).fill(0).map((_, index) => (
                      <li key={index} className="author_skeleton">
                        <div className="author_list_pp">
                          <div className="skeleton-avatar" />
                        </div>
                        <div className="author_list_info">
                          <div className="skeleton-line short" />
                          <div className="skeleton-line" />
                        </div>
                      </li>
                    ))
                  : collections.map((item, index) => (
                      <li key={item.id ?? item.authorName ?? index}>
                        <div className="author_list_pp">
                          <Link to="/author">
                            <img className="lazy pp-author" src={item.authorImage} alt={item.authorName} />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to="/author">{item.authorName}</Link>
                          <span>{item.price} ETH</span>
                        </div>
                      </li>
                    ))}
              </ol>
        
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
