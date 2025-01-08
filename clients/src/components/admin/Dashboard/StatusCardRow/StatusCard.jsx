import React, { useEffect, useMemo, useState } from 'react'
import {DollarSign, Package, Users, TrendingUp}  from "lucide-react"
import CollectionCard from '../Card/CollectionCard'
import { adminAxiosInstance } from '../../../../redux/constants/AxiosInstance';

const StatusCard = () => {
    const [orders, setOrders] = useState();
    const [products, setProducts] = useState();
    const [categories, setCategories] = useState();
    const [isTotalRevenue, setIsTotalRevenue] = useState(false)
    const fetchOrders = async() =>{

        try{
            let orders = await adminAxiosInstance.get('/orders');
            setOrders(orders.data);
        }
        catch(error){
            console.log(error);
        }   
    }
    const fetchProductsAndCategorie = async() =>{

        try{
            let product = await adminAxiosInstance.get('/productList');
            let category = await adminAxiosInstance.get('/listCategory')
            setProducts(product.data);
            setCategories(category.data)
        }
        catch(error){
            console.log(error);
        }   
    }
    
    const totalRevenew = useMemo(()=>{
        if (!orders) return 
        setIsTotalRevenue(false)
        return orders.reduce((sum, item)=>{
            sum += item.orderStatus === "Delivered" ? item.totalAmount : 0
            return sum  
        },0)
    },[orders])

    

    useEffect(()=>{
        fetchOrders();
        fetchProductsAndCategorie()
    },[])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        
        <CollectionCard 
            Sign={DollarSign}
            persentage={"+2.5% from last month"}
            total={`₹${totalRevenew}`}
            type={"Total Revenue"}
            loading={isTotalRevenue}
        />
        {/* Orders Card */}
        
        <CollectionCard 
            Sign={Users}
            persentage={"+5% from last month"}
            total={orders?.length}
            type={"Total Orders"}
            loading={orders ? false: true}
        />

        {/* Products Card */}
        
        <CollectionCard 
            Sign={Package}
            persentage={`In ${categories?.length} main Categories`}
            total={products?.length}
            type={"Total Products"}
            loading={products ? false :  true}
        />
        {/* Monthly Earning Card */}
        
        <CollectionCard 
            Sign={TrendingUp}
            persentage={"Based in your local time"}
            total={"6,982"}
            type={"Monthly Earning"}
            loading={false}
        />
      </div>
  )
}

export default StatusCard
