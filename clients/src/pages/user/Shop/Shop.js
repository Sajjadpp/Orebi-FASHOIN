import React, { useState, useMemo, useEffect } from 'react';
import Product from '../../../components/user/home/Products/Product';
import { useSelector } from 'react-redux';
import { fetchData } from '../../../services/fetchData/fetchData';

  

const Shop = () => {
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState([]);

  
  const fetchProduct = async() =>{
    let response = await fetchData('listAllProducts', {})
    console.log(response)
    setProducts(response)
  }

  useEffect(()=>{
    fetchProduct()
  },[])
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 3;
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Extract unique categories from products
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = selectedCategory === 'all' 
      ? products 
      : products.filter(p => p.category === selectedCategory);

    switch(sortBy) {
      case 'price-asc':
        return filtered.sort((a, b) => a.currentPrice - b.currentPrice);
      case 'price-desc':
        return filtered.sort((a, b) => b.currentPrice - a.currentPrice);
      case 'name-asc':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return filtered.sort((a, b) => b.name.localeCompare(a.name));
      case 'new':
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return filtered;
    }
  }, [products, sortBy, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );
// Handle page changes with transition
const handlePageChange = (newPage) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsTransitioning(false);
    }, 300);
  };

  // Handle category changes with transition
  const handleCategoryChange = (category) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedCategory(category);
      setCurrentPage(1);
      setIsTransitioning(false);
    }, 300);
  };

  // Handle sort changes with transition
  const handleSortChange = (newSortBy) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSortBy(newSortBy);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sticky Sidebar */}
          <aside className="md:w-64 flex-shrink-0">
            <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
              <div className="bg-white rounded-lg shadow p-6">
                {/* Sort Section */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Sort By</h2>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                    <option value="new">New Arrivals</option>
                  </select>
                </div>

                {/* Categories Section */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 ${
                          selectedCategory === category
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filters remain the same */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="inStock" 
                        className="h-4 w-4 text-gray-900 rounded border-gray-300"
                      />
                      <label htmlFor="inStock" className="ml-2 text-gray-700">
                        In Stock Only
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-6 text-gray-600">
                Showing {currentProducts.length} of {filteredAndSortedProducts.length} products
              </div>

              {/* Product Grid with Transition */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}>
                {currentProducts.map((product) => (
                  <Product key={product._id} {...product} />
                ))}
              </div>

              {/* Pagination with Transitions */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1 || isTransitioning}
                    className={`px-4 py-2 rounded-md transition-all duration-200 ${
                      currentPage === 1 || isTransitioning
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePageChange(idx + 1)}
                      disabled={isTransitioning}
                      className={`px-4 py-2 rounded-md transition-all duration-200 ${
                        currentPage === idx + 1
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages || isTransitioning}
                    className={`px-4 py-2 rounded-md transition-all duration-200 ${
                      currentPage === totalPages || isTransitioning
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;