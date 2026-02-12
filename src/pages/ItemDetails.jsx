import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EthImage from "../images/ethereum.svg";
import SkeletonLoading from "../components/home/SkeletonLoading";

const ITEM_DETAILS_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails";

function ItemDetails() {
  const { nftId } = useParams();

  const [item, setItem] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"
  const [error, setError] = useState("");

  const ownerId = item?.ownerId ?? item?.authorId;
  const ownerImage = item?.ownerImage ?? item?.authorImage;
  const ownerName = item?.ownerName ?? item?.authorName ?? "Owner";

  const creatorId = item?.creatorId ?? item?.authorId;
  const creatorImage = item?.creatorImage ?? item?.authorImage;
  const creatorName = item?.creatorName ?? item?.authorName ?? "Creator";


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [nftId]);

  useEffect(() => {
    if (!nftId) return;

    const controller = new AbortController();

    async function load() {
      try {
        setStatus("loading");
        setError("");

        const res = await fetch(`${ITEM_DETAILS_URL}?nftId=${encodeURIComponent(nftId)}`, 
        { signal: controller.signal }
        );

        if (!res.ok) throw new Error(`Request failed (${res.status})`);

        const data = await res.json();
        const normalized = Array.isArray(data) ? data[0] : data;

        setItem(normalized);
        setStatus("ready");
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error(err);
        setError(err.message || "Something went wrong.");
        setStatus("error");
      }
    }

    load();
    return () => controller.abort();
  }, [nftId]);

  if (!item) {
  return (
    <section className="mt90 sm-mt-0">
      <div className="container">
        <SkeletonLoading mode="details" />
      </div>
    </section>
  );
}

  if (status === "error") {
    return (
      <div style={{ padding: 32 }}>
        <h2>Couldn’t load item</h2>
        <p>{error}</p>
        <Link to="/">← Back</Link>
      </div>
    );
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
                  <h2>{item.title} #{item.tag}</h2>

                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i> {item.views}
                    </div>
                    <div className="item_info_like">
                      <i className="fa fa-heart"></i> {item.likes}
                    </div>
                  </div>

                  <p>{item.description}</p>

                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${ownerId}`} state={{ item }}>
                            <img className="lazy" src={ownerImage} alt={ownerName} />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${ownerId}`}>{ownerName}</Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <h6>Creator</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${creatorId}`} state={{ item }}>
                            <img
                              className="lazy"
                              src={creatorImage}
                              alt={creatorName}
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${creatorId}`}>{creatorName}</Link>
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
}

export default ItemDetails;