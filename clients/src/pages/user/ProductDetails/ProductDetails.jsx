import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumbs from '../../../components/user/pageProps/Breadcrumbs';
import RelatedProducts from '../../../components/user/ProductDetails/RelatedProducts/RelatedProducts';
import Review from '../../../components/user/ProductDetails/Reviews/Review';
import ProductAddress from '../../../components/user/ProductDetails/productAddress/ProductAddress';
import ImagePreview from '../../../components/user/ProductDetails/ImagePreview/ImagePreview';

const ProductDetailsPage = () => {
  const [product, setProduct] = useState({})
  const location = useLocation();

  useEffect(()=>{
    if(!location.state.item) return 
    let sample = JSON.parse(location.state.item)
    setProduct({...sample});
    console.log(sample)
  },[location])



  
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs prevLocation={"shop"} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <ImagePreview product={product}/>
        <ProductAddress product={product}/>
      </div>
      <Review/> 
      <RelatedProducts _id={product._id} category={product.category}/>
    </div>
  );
};

export default React.memo(ProductDetailsPage) ;