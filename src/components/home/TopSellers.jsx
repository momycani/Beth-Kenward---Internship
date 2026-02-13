import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./carousel.css";
import SkeletonLoading from "./SkeletonLoading";


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
    const t = setTimeout(() => setShowSkeleton(false), 2000);
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
                {showSkeleton ? (
                  <SkeletonLoading
                    count={12}
                    mode="list"
                    type="seller"
                  />
                ) : (               
                  collections.map((item, index) => (
                      <li key={item.id ?? item.authorName ?? index}>
                        <div className="author_list_pp">
                          <Link to={`/author/${item.authorId}`} state={{ item }}>
                            <img className="lazy pp-author" src={item.authorImage} alt={item.authorName} />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${item.authorId ?? item.id}`} state={{ item }}>
                          {item.authorName}
                          </Link>
                          <span>{item.price} ETH</span>
                        </div>
                      </li>
                    )))}
              </ol>        
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;