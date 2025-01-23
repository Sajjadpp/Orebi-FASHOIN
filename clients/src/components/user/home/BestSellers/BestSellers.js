import React, { useEffect, useState } from "react";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import {
  bestSellerOne,
  bestSellerTwo,
  bestSellerThree,
  bestSellerFour,
} from "../../../../assets/images/index";
import { userAxiosInstance } from "../../../../redux/constants/AxiosInstance";

const BestSellers = () => {
  const [products, setProducts] = useState([]);

  const fetchShoes = async() =>{

    try{
      let response = await userAxiosInstance.get('/products',{
        params: {
          page: 1,
          limit: 15,
          category: "casual shoe",
          sortBy:'featured'
        }
      })
      console.log(response.data);
      setProducts(response.data.data.products)
    }
    catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    fetchShoes()
  },[])

  return (
    <div className="w-full pb-20">
      <Heading heading="Shoes" />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
        {products?.length && 
          products.map((product,i) =>(
            <Product {...product} key={i}/>
          )) 
        }
      </div>
    </div>
  );
};

export default BestSellers;
