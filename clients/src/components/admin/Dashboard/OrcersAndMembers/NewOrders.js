import React, { useEffect, useState } from 'react'
import Card from '../Card/Card';
import { adminAxiosInstance } from '../../../../redux/constants/AxiosInstance';
import { formatTimestampToDate } from '../../../../services/DateMaker/DateMaker';
import { getStatusColor } from '../../../../services/ColorStatus/ColorStatus';

const NewOrders = () => {
    

    const [orders, setOrders] = useState([]);

    const fetchOrders = async() =>{

        try{
            let orders = await adminAxiosInstance.get('/orders');
            setOrders(orders.data);
        }
        catch(error){
            console.log(error);
        }   
    }

    useEffect(()=>{
        fetchOrders();
    },[])

  return (
    <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Latest Orders</h3>
        <div className="overflow-x-auto">
        <table className="w-full">
            <thead>
            <tr className="text-left text-sm text-gray-600">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
            </tr>
            </thead>
            <tbody className="text-sm">
            {orders.reverse().splice(0,5).map((order) => (
                <tr key={order._id} className="border-t">
                <td className="py-3 text-blue-600">{order._id.slice(0,3)}</td>
                <td className="py-3 text-gray-800">{order.userId.name}</td>
                <td className="py-3 text-gray-600">{formatTimestampToDate(order.createdAt)}</td>
                <td className="py-3 text-gray-800">{order.totalAmount}</td>
                <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                    </span>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </Card>
  )
}

export default NewOrders
