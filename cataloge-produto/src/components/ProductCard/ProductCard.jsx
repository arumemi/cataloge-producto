import React from "react";
import "./ProductCard.css";

function ProductCard({ name, price, image, description }) {
  return (
    <article className="product-card">
      {image && (
        <img
          className="product-card__image"
          src={image}
          alt={name}
          loading="lazy"
        />
      )}

      <div className="product-card__body">
        <h3 className="product-card__name">{name}</h3>
        <p className="product-card__price">${price}</p>
        {description && (
          <p className="product-card__description">{description}</p>
        )}
      </div>
    </article>
  );
}

export default ProductCard;
