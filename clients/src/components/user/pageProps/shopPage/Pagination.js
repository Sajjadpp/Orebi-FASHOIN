import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Product from "../../home/Products/Product";
import axios from "axios";
import { adminAxiosInstance, userAxiosInstance } from "../../../../redux/constants/AxiosInstance";

const Items = ({ currentItems }) => {
  return (
    <>
      {currentItems?.map((item) => (
        <div key={item._id} className="w-full">
          <Product
            {...item}
          />
        </div>
      ))}
    </>
  );
};

const AsyncPagination = ({ itemsPerPage }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemStart, setItemStart] = useState(1);

  // Function to fetch data from server
  const fetchProducts = async (page) => {
    setLoading(true);
    try {
      // Replace with your API endpoint
      const response = await userAxiosInstance.get(`/listAllProducts`, {
        params: {
          page: page + 1, // Adding 1 because page starts from 0 in ReactPaginate
          limit: itemsPerPage
        }
      });
      console.log(response)
      setItems(response?.data);
      setTotalItems(response?.data.length);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or page changes
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, itemsPerPage]);

  const handlePageClick = (event) => {
    const newPage = event.selected;
    setCurrentPage(newPage);
    setItemStart(newPage * itemsPerPage + 1);
  };

  const pageCount = Math.ceil(totalItems / itemsPerPage);
  const endOffset = itemStart + itemsPerPage - 1;

  if (loading) {
    return (
      <div className="w-full h-40 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mdl:gap-4 lg:gap-10">
        <Items currentItems={items} />
      </div>
      
      <div className="flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
        <ReactPaginate
          nextLabel=""
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel=""
          pageLinkClassName="w-9 h-9 border-[1px] border-lightColor hover:border-gray-500 duration-300 flex justify-center items-center"
          pageClassName="mr-6"
          containerClassName="flex text-base font-semibold font-titleFont py-10"
          activeClassName="bg-black text-white"
        />

        <p className="text-base font-normal text-lightText">
          Products from {itemStart} to {Math.min(endOffset, totalItems)} of{" "}
          {totalItems}
        </p>
      </div>
    </div>
  );
};

// Example of how the API response should be structured
/*
{
  products: [
    {
      _id: string,
      img: string,
      productName: string,
      price: string,
      color: string,
      badge: boolean,
      des: string
    },
    ...
  ],
  total: number // Total number of products
}
*/

export default AsyncPagination;