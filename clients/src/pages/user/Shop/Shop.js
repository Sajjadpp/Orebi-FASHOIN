import React, { useState, useEffect } from 'react';
import Product from '../../../components/user/home/Products/Product';
import axios from 'axios';
import { Search } from 'lucide-react'; // Import search icon
import { userAxiosInstance } from '../../../redux/constants/AxiosInstance';

const Shop = () => {
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    productsPerPage: 6
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const fetchProducts = async (params = {}) => {
    try {
      const response = await userAxiosInstance.get('/products', {
        params: {
          page: params.page || currentPage,
          limit: 6,
          sortBy: params.sortBy || sortBy,
          category: params.category || selectedCategory,
          search: params.search !== undefined ? params.search : searchQuery
        }
      });

      if (response.data.status === 'success') {
        setProducts(response.data.data.products);
        setPagination(response.data.data.pagination);
        setCategories(response.data.data.categories);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Debounce search function
  let searchTimeout;
  const handleSearch = (value) => {
    setSearchQuery(value);
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts({ search: value, page: 1 });
    }, 500); // Wait 500ms after user stops typing
  };

  // Handle page changes with transition
  const handlePageChange = (newPage) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      fetchProducts({ page: newPage });
      setIsTransitioning(false);
    }, 300);
  };

  // Handle category changes with transition
  const handleCategoryChange = (category) => {
    console.log(category,"categoru")
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedCategory(category);
      setCurrentPage(1);
      fetchProducts({ category, page: 1 });
      setIsTransitioning(false);
    }, 300);
  };

  // Handle sort changes with transition
  const handleSortChange = (newSortBy) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSortBy(newSortBy);
      fetchProducts({ sortBy: newSortBy, page: 1 });
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
                {/* Search Section */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Products</h2>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search products..."
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

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

                {/* Filters Section */}
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
                Showing {products.length} of {pagination.totalProducts} products
              </div>

              {/* Product Grid with Transition */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}>
                {products.map((product) => (
                  <Product key={product._id} {...product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
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
                  {[...Array(pagination.totalPages)].map((_, idx) => (
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
                    onClick={() => handlePageChange(Math.min(currentPage + 1, pagination.totalPages))}
                    disabled={currentPage === pagination.totalPages || isTransitioning}
                    className={`px-4 py-2 rounded-md transition-all duration-200 ${
                      currentPage === pagination.totalPages || isTransitioning
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