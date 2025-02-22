import React from 'react';
import AdditionalInfo from '../Components/Product/AdditonInfo/AdditionalInfo';
import Product from '../Components/Product/ProductMain/Product';
import RelatedProducts from '../Components/Product/RelatedProducts/RelatedProducts';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();
  return (
    <>
      <Product id={id} />
      {/* <AdditionalInfo />
      <RelatedProducts /> */}
    </>
  );
};

export default ProductDetails;
