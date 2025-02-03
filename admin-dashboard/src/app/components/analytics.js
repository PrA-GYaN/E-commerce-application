import { useState, useEffect } from 'react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

export const Analytics = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/getProductsApi');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                console.log('Products:', data);
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/getCategoriesApi');
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                setCategories(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchProducts();
        fetchCategories();
    }, []);

    const totalCategoriesAndProducts = [
        { name: 'Categories', value: categories.length },
        { name: 'Products', value: products.length }
    ];

    // 
    const stockData = products.map(product => ({
        name: product.name,
        totalStock: product.initialStock,
        availableStock: product.availableStock,
    }));

    // Filter products based on selected category and search term
    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory ? product.categoryId === parseInt(selectedCategory) : true;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="p-6 space-y-8">
            {loading ? (

                    <div className="flex-col gap-4 w-full h-96 flex items-center justify-center">
                      <div
                        className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full"
                      >
                        <div
                          className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"
                        ></div>
                      </div>
                    </div>

            ) : error ? (
                <div className="text-center text-red-500 font-semibold">Error: {error}</div>
            ) : categories.length === 0 && products.length === 0 ? (
                <div className="text-center text-lg font-semibold">No data available</div>
            ) : (
                <>
                    {/* Total Categories & Products */}
                    <div className="text-center text-2xl font-bold text-gray-800 mb-6">
                        <h2>Total Number of Categories & Products</h2>
                    </div>
                    <ChartContainer config={{ theme: 'light', color: '#8884d8' }}>
                        <ResponsiveContainer width="100%" height={Math.max(200, 100 + totalCategoriesAndProducts.length * 15)}>
                            <BarChart data={totalCategoriesAndProducts}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                    {/* Total Stock & Available Stock */}
                    <div className="text-center text-2xl font-bold text-gray-800 mb-6">
                        <h2>Total Stock and Available Stock of Products</h2>
                    </div>
                    <ChartContainer config={{ theme: 'light', color: '#82ca9d' }}>
                        <ResponsiveContainer width="100%" height={Math.max(200, 100 + stockData.length * 15)}>
                            <BarChart data={stockData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="totalStock" fill="#82ca9d" barSize={30} />
                                <Bar dataKey="availableStock" fill="#8884d8" barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                    {/* Category Filter */}
                    <div className="flex justify-between items-center mt-6 bg-gray-50 p-4 rounded-lg shadow-md">
                        <div className="text-xl text-gray-700 font-semibold">Filter by Category:</div>
                        <select
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            value={selectedCategory}
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Search Feature */}
                    <div className="mt-6 flex justify-between items-center">
                        <div className="text-xl text-gray-700 font-semibold">Search Products:</div>
                        <input
                            type="text"
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Search products"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Products Table */}
                    <div className="mt-8">
                        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                            <table className="min-w-full table-auto text-gray-700">
                                <thead className="bg-gray-200 text-gray-600">
                                    <tr>
                                        <th className="p-3 text-left font-medium">Name</th>
                                        <th className="p-3 text-left font-medium">Category</th>
                                        <th className="p-3 text-left font-medium">Stock</th>
                                        <th className="p-3 text-left font-medium">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="p-4 text-center text-gray-500">No products found.</td>
                                        </tr>
                                    ) : (
                                        filteredProducts.map((product) => (
                                            <tr key={product.id} className="border-b hover:bg-gray-50">
                                                <td className="p-3">{product.name}</td>
                                                <td className="p-3">{categories.find(cat => cat.id === product.categoryId)?.name || 'N/A'}</td>
                                                <td className="p-3">{product.availableStock}</td>
                                                <td className="p-3">{product.description}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};