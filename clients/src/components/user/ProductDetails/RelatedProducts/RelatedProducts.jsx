import React, { useEffect, useState } from 'react'
import Product from '../../home/Products/Product'
import { userAxiosInstance } from '../../../../redux/constants/AxiosInstance'

const RelatedProducts = ({category, _id}) => {
    const [relatedProducts, setRelatedProduct] = useState([{}])
    useEffect(()=>{
        (async()=>{
        
          try{
            const response = await userAxiosInstance.get("/relatedProduct",{
              params:{
                category:category,
                thisProduct:_id
              }
            })
            setRelatedProduct(response.data)
          }
          catch(error){
            console.log(error)
          }
      })()
    },[_id])
  return (
    <div>
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
            <Product {...product}/>
            ))}
            {relatedProducts.length && "N/A "}
        </div>
    </div>
  )
}

export default RelatedProducts
