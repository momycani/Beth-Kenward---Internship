import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import EthImage from "../images/ethereum.svg";
import { stableNumberFromId } from "../utils/fakeData";

const LOREM_OPTIONS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
];

const ItemDetails = () => {
  const { nftId } = useParams();
  const { state } = useLocation();
  const [item, setItem] = useState(state?.item ?? null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [nftId]);
  
  useEffect(() => {
    if (item) return;
    
    fetch(`/api/item-details?nftId=${nftId}`)
      .then(res => res.json())
      .then(setItem)
      .catch(console.error);
  }, [item, nftId]);

  if (!item) {
    return (
      <div style={{ padding: 32 }}>
        <h2>Loading item…</h2>
        <p>If this page was refreshed, please return and select the item again.</p>
        <Link to="/">← Back</Link>
      </div>
    );
  }

  function pseudoRandomViews(id, min = 50, max = 500) {
  let hash = 0;
  for (let i = 0; i < String(id).length; i++) {
    hash = String(id).charCodeAt(i) + ((hash << 5) - hash);
  }
  return min + (Math.abs(hash) % (max - min + 1));
}

function getRandomDescription(id) {
  if (!id) return LOREM_OPTIONS[0];

  let hash = 0;
  const str = String(id);

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % LOREM_OPTIONS.length;
  return LOREM_OPTIONS[index];
}

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              
              <div className="col-md-6 text-center">
                <img
                  src={item.nftImage}
                  className="img-fluid img-rounded mb-sm-30 nft-image"
                  alt={item.title}
                />
              </div>
             
              <div className="col-md-6">
                <div className="item_info">
                  <h2>{item.title}</h2>

                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i>
                      {item.views ?? pseudoRandomViews(item.nftId)}
                    </div>
                    <div className="item_info_like">
                      <i className="fa fa-heart"></i>
                      {item.likes ?? stableNumberFromId(item.nftId ?? item.id, 10, 300)}
                    </div>
                  </div>

                  <p>
                    {item.description ?? getRandomDescription(item.nftId)}                                          
                  </p>
                 
                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${item.authorId}`}>
                            <img className="lazy" src={item.authorImage} alt="" />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${item.authorId}`}>
                            {item.authorName ?? "Creator"}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <h6>Creator</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${item.authorId}`}>
                            <img className="lazy" src={item.authorImage} alt="" />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${item.authorId}`}>
                            {item.authorName ?? "Creator"}
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="spacer-40"></div>

                    <h6>Price</h6>
                    <div className="nft-item-price">
                      <img src={EthImage} alt="" />
                      <span>{item.price}</span>
                    </div>
                  </div>

                  <p style={{ marginTop: 24 }}>
                    <Link to="/">← Back</Link>
                  </p>

                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;

