import React from "react";
import "./carousel.css"

function SkeletonLoading({
  count = 8,
  mode = "grid",
  type = "item",
  colClassName = "col-lg-3 col-md-6 col-sm-6 col-xs-12",
}) {
  // list mode (TopSellers)
  if (mode === "list") {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <SellerCard key={`sk-seller-${i}`} />
        ))}
      </>
    );
  }

  let Card;
  if (type === "collection") Card = <CollectionCard />;
  else if (type === "seller") Card = <SellerCard />;
  else Card = <ItemCard />;

  // slider mode (react-slick)
  if (mode === "slider") {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={`sk-${type}-${i}`}>{Card}</div>
        ))}
      </>
    );
  }

  // grid mode
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={`sk-${type}-${i}`} className={colClassName}>
          {Card}
        </div>
      ))}
    </>
  );
}

function CollectionCard() {
  return (
    <div className="nft_coll skeleton-card">
      <div className="nft_wrap">
        <div className="skeleton skeleton-img" />
      </div>
      <div className="nft_coll_info">
        <div className="skeleton skeleton-line title" />
        <div className="skeleton skeleton-line code" />
      </div>
    </div>
  );
}

function ItemCard() {
  return (
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
  );
}

function SellerCard() {
  return (
    <li className="author_skeleton">
      <div className="author_list_pp">
        <div className="skeleton-avatar" />
      </div>
      <div className="author_list_info">
        <div className="skeleton-line short" />
        <div className="skeleton-line" />
      </div>
    </li>
  );
}


export default SkeletonLoading;

