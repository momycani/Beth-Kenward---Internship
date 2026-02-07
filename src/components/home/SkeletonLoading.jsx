import React from "react";

const SkeletonLoading = ({ count = 4 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
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
    </>
  );
};

export default SkeletonLoading;

