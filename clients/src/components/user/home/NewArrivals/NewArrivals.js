import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import {
  newArrOne,
  newArrTwo,
  newArrThree,
  newArrFour,
} from "../../../../assets/images/index";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";
import { adminAxiosInstance, userAxiosInstance } from "../../../../redux/constants/AxiosInstance";
import toast from "react-hot-toast";


const NewArrivals = () => {

  const [products, setProducts] = useState([])
  useEffect(()=>{
    (async()=>{
      try{

        let response = await userAxiosInstance.get('/listAllProducts');
        setProducts(response.data);
      }
      catch(error){
        console.log(error)
        toast.error('product fetch failed')
      }
      
    })()
  },[])
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };
  return (
    <div className="w-full pb-16">
      <Heading heading="New Arrivals" />
      <Slider {...settings}>

          {products.length && products?.map(product=>{
            return(
              <div className="px-2">
                <Product
                  {...product}
                />
              </div>  
            )
          })}
        
      </Slider>
    </div>
  );
};

export default NewArrivals;
