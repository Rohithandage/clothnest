import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  Search, 
  Plus, 
  Trash2, 
  ArrowLeft,
  Sparkles,
  LogOut,
  X,
  CheckCircle2,
  AlertCircle,
  Star,
  ShoppingBag,
  Filter,
  Zap,
  Flame,
  Crown,
  Award,
  BarChart3,
  Eye,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import apiConfig from "@/config/api";

const TrendingProducts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('adminUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    fetchTrendingProducts();
    fetchAllProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiConfig.PRICE_COMPARISON}/categories`);
      if (response.data.success) {
        setCategories(response.data.data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTrendingProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiConfig.PRICE_COMPARISON}/search?trending=true&limit=1000`
      );
      
      if (response.data.success) {
        setTrendingProducts(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching trending products:", error);
      toast({
        title: "Error",
        description: "Failed to fetch trending products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }
      if (searchQuery.trim()) {
        params.append("query", searchQuery.trim());
      }
      params.append("limit", "100");

      const response = await axios.get(
        `${apiConfig.PRICE_COMPARISON}/search?${params.toString()}`
      );

      if (response.data.success) {
        const products = response.data.data || [];
        // Filter out products that are already trending
        const trendingIds = new Set(trendingProducts.map(p => p._id));
        const nonTrendingProducts = products.filter(p => !trendingIds.has(p._id));
        setAllProducts(nonTrendingProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [selectedCategory, searchQuery, trendingProducts]);

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const handleAddToTrending = async (productId) => {
    try {
      const response = await axios.put(
        `${apiConfig.PRICE_COMPARISON}/product/${productId}`,
        { trending: true }
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Product added to trending successfully!",
        });
        fetchTrendingProducts();
        fetchAllProducts();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add product to trending",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromTrending = async (productId) => {
    try {
      const response = await axios.put(
        `${apiConfig.PRICE_COMPARISON}/product/${productId}`,
        { trending: false }
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Product removed from trending successfully!",
        });
        fetchTrendingProducts();
        fetchAllProducts();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to remove product from trending",
        variant: "destructive",
      });
    }
  };

  const handleBulkRemove = async () => {
    if (trendingProducts.length === 0) return;
    
    try {
      const promises = trendingProducts.map(product =>
        axios.put(
          `${apiConfig.PRICE_COMPARISON}/product/${product._id}`,
          { trending: false }
        )
      );
      
      await Promise.all(promises);
      
      toast({
        title: "Success",
        description: `Removed ${trendingProducts.length} products from trending`,
      });
      fetchTrendingProducts();
      fetchAllProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove some products",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const filteredAllProducts = allProducts.filter(product => {
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-red-50/30 to-pink-50/20 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-orange-300/30 via-red-300/20 to-pink-300/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-pink-300/30 via-orange-300/20 to-red-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-200/10 via-red-200/10 to-pink-200/10 rounded-full blur-3xl"></div>
      
      {/* Enhanced Header */}
      <div className="bg-white/95 backdrop-blur-2xl shadow-2xl border-b-2 border-orange-200/50 sticky top-0 z-50 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 via-red-50/30 to-pink-50/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center h-20 md:h-24 py-4">
            <div className="flex items-center gap-4">
              <Link to="/admin/dashboard">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mr-2 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:text-orange-600 transition-all duration-300 rounded-xl border border-transparent hover:border-orange-200 shadow-sm hover:shadow-md"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="font-semibold">Back</span>
                </Button>
              </Link>
              <div className="p-3.5 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl shadow-2xl transform hover:scale-110 hover:rotate-3 transition-all duration-300 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Flame className="h-7 w-7 md:h-9 md:w-9 text-white relative z-10 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg mb-1">
                  Trending Products Management
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block font-semibold">
                  <Crown className="h-3 w-3 inline mr-1 text-orange-500" />
                  Manage trending products displayed on homepage
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              {user && (
                <div className="text-right hidden sm:block bg-white/90 px-5 py-3 rounded-xl shadow-lg border-2 border-gray-200 hover:border-orange-300 transition-all duration-300 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-sm font-black text-gray-900">{user.name || 'Admin'}</p>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{user.email || 'admin@example.com'}</p>
                </div>
              )}
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-2 border-red-200 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:border-red-300 text-red-700 font-bold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-5"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-14 relative z-10">
        {/* Premium Stats Card */}
        <Card className="mb-10 border-0 shadow-2xl bg-gradient-to-br from-white via-orange-50/90 to-red-50/70 hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-2 relative overflow-hidden group">
          {/* Animated gradient overlays */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-300/40 via-red-300/30 to-pink-300/40 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-red-300/30 via-orange-300/20 to-pink-300/30 rounded-full blur-3xl"></div>
          
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
          
          <CardContent className="p-8 sm:p-10 relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-8">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl shadow-2xl transform group-hover:rotate-6 transition-transform duration-500 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 rounded-2xl animate-pulse opacity-50"></div>
                    <TrendingUp className="h-8 w-8 text-white relative z-10" />
                  </div>
                  <div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-2 leading-tight">
                      Trending Products Dashboard
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-3 py-1 shadow-lg">
                        <Award className="h-3 w-3 mr-1" />
                        Active Collection
                      </Badge>
                      <p className="text-gray-600 font-semibold text-sm sm:text-base">
                        Showcasing <span className="font-black text-orange-600 text-lg">{trendingProducts.length}</span> trending products on homepage
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="text-center bg-white/95 backdrop-blur-sm px-8 py-6 rounded-3xl shadow-2xl border-[3px] border-orange-300/50 relative overflow-hidden group/stat">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-red-50/50 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-2 drop-shadow-lg">
                      {trendingProducts.length}
                    </div>
                    <div className="text-sm text-gray-700 font-black uppercase tracking-widest mb-3">Active</div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                      <span className="text-xs text-green-600 font-black">Live</span>
                    </div>
                  </div>
                </div>
                {trendingProducts.length > 0 && (
                  <Button
                    variant="destructive"
                    onClick={handleBulkRemove}
                    className="shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 rounded-2xl px-8 py-7 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 border-0 font-black text-base relative group/btn overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <Trash2 className="h-5 w-5 mr-2 relative z-10" />
                    <span className="relative z-10">Remove All</span>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trending Products Section - Premium */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl shadow-2xl transform hover:rotate-6 transition-transform duration-500 relative group/icon">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 rounded-3xl opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>
                <Sparkles className="h-8 w-8 text-white relative z-10" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-2 leading-tight">
                  Current Trending Products
                </h2>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-4 py-1.5 shadow-lg text-sm">
                    <Crown className="h-3.5 w-3.5 mr-1.5" />
                    Featured Collection
                  </Badge>
                  <p className="text-gray-600 font-semibold">
                    <span className="font-black text-orange-600 text-lg">{trendingProducts.length}</span> products featured on homepage
                  </p>
                </div>
              </div>
            </div>
            {trendingProducts.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-bold text-gray-700">View Analytics</span>
              </div>
            )}
          </div>

          {loading ? (
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-orange-50/60 to-red-50/40 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 to-red-100/20"></div>
              <CardContent className="p-20 text-center relative z-10">
                <div className="inline-flex items-center justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative inline-block animate-spin rounded-full h-20 w-20 border-4 border-orange-200 border-t-orange-600"></div>
                  </div>
                </div>
                <p className="text-gray-700 font-black text-xl mb-2">Loading trending products...</p>
                <p className="text-gray-500 font-medium">Please wait while we fetch the latest data</p>
              </CardContent>
            </Card>
          ) : trendingProducts.length === 0 ? (
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-orange-50/60 to-red-50/40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-pink-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
              <CardContent className="p-20 text-center relative z-10">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-orange-100 via-red-100 to-pink-100 rounded-full mb-8 shadow-2xl transform group-hover:scale-110 transition-transform duration-500">
                  <AlertCircle className="h-16 w-16 text-orange-500" />
                </div>
                <h3 className="text-3xl font-black text-gray-800 mb-4">No Trending Products Yet</h3>
                <p className="text-gray-600 font-bold text-lg mb-3">Start building your trending collection!</p>
                <p className="text-sm text-gray-500 font-medium mb-6">Add products below to make them appear on the homepage</p>
                <div className="flex items-center justify-center gap-2 text-orange-600">
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                  <span className="font-bold">Scroll down to add products</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {trendingProducts.map((product, index) => (
                <Card 
                  key={product._id} 
                  className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 group bg-white relative overflow-hidden transform hover:-translate-y-3 hover:scale-[1.02]"
                >
                  {/* Premium gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 via-red-50/0 to-pink-50/0 group-hover:from-orange-50/60 group-hover:via-red-50/40 group-hover:to-pink-50/60 transition-all duration-700"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/0 to-red-200/0 group-hover:from-orange-200/30 group-hover:to-red-200/30 rounded-full blur-2xl transition-all duration-700"></div>
                  
                  {/* Top rank indicator for top 3 */}
                  {index < 3 && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 z-30"></div>
                  )}
                  
                  <div className="relative">
                    {/* Premium Trending Badge */}
                    <div className="absolute top-4 right-4 z-30">
                      <Badge className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white font-black shadow-2xl px-4 py-2 rounded-full border-[3px] border-white/90 backdrop-blur-sm transform group-hover:scale-110 transition-transform duration-300">
                        <Flame className="h-4 w-4 mr-1.5 animate-pulse" />
                        <span className="text-xs">Trending</span>
                      </Badge>
                    </div>
                    
                    {/* Premium Rank Badge */}
                    <div className="absolute top-4 left-4 z-30">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shadow-2xl border-[3px] border-white/90 backdrop-blur-sm transform group-hover:scale-110 transition-transform duration-300 ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                        index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800' :
                        'bg-gradient-to-br from-gray-700 to-gray-900'
                      }`}>
                        {index === 0 ? <Crown className="h-5 w-5" /> : index + 1}
                      </div>
                    </div>
                    
                    {product.image || (product.images && product.images.length > 0) ? (
                      <div className="relative w-full h-64 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 rounded-t-2xl overflow-hidden group/image">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/0 to-red-100/0 group-hover/image:from-orange-100/20 group-hover/image:to-red-100/20 transition-all duration-500"></div>
                        <img
                          src={product.image || product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-contain p-5 group-hover:scale-[1.15] transition-transform duration-700"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-gray-100 via-gray-150 to-gray-200 rounded-t-2xl flex items-center justify-center group/image">
                        <ShoppingBag className="h-20 w-20 text-gray-300 group-hover/image:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="mb-4">
                      <Badge variant="outline" className="text-xs font-black border-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm">
                        <Star className="h-3 w-3 mr-1.5 text-yellow-500 fill-yellow-500" />
                        {product.brand}
                      </Badge>
                    </div>
                    
                    <h3 className="font-black text-gray-900 mb-4 line-clamp-2 text-base leading-snug group-hover:text-orange-600 transition-colors duration-300 min-h-[3.5rem]">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-5 pb-5 border-b-2 border-gray-100">
                      <div className="flex flex-col gap-2">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">Category</span>
                        <Badge className="text-xs capitalize bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-2 border-blue-200 w-fit font-bold px-2 py-1">
                          {product.category}
                        </Badge>
                      </div>
                      {product.prices && product.prices.length > 0 && (
                        <div className="text-right">
                          <div className="text-2xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent mb-1">
                            ₹{Math.min(...product.prices.map(p => p.price)).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500 font-bold">Best Price</div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl font-bold transition-all duration-300"
                        onClick={() => window.open(`/product/${product._id}`, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl font-black border-0"
                        onClick={() => handleRemoveFromTrending(product._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Add Products Section - Premium */}
        <div className="relative mt-16">
          <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-3xl shadow-2xl transform hover:rotate-6 transition-transform duration-500 relative group/icon">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 rounded-3xl opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>
                <Plus className="h-8 w-8 text-white relative z-10" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-2 leading-tight">
                  Add Products to Trending
                </h2>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold px-4 py-1.5 shadow-lg text-sm">
                    <Zap className="h-3.5 w-3.5 mr-1.5" />
                    Quick Add
                  </Badge>
                  <p className="text-gray-600 font-semibold">
                    Search and select products to feature on homepage
                  </p>
                </div>
              </div>
            </div>
            {filteredAllProducts.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-bold text-gray-700">{filteredAllProducts.length} Available</span>
              </div>
            )}
          </div>

          {/* Premium Search and Filter */}
          <Card className="mb-10 border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50/60 to-indigo-50/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex-1 relative group/search">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100/0 to-indigo-100/0 group-focus-within/search:from-blue-100/30 group-focus-within/search:to-indigo-100/30 rounded-2xl transition-all duration-300"></div>
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 group-focus-within/search:text-blue-600 transition-all duration-300 z-10" />
                  <Input
                    placeholder="Search products by name or brand..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-14 pr-5 py-7 text-base border-2 border-gray-200 focus:border-blue-500 rounded-2xl shadow-lg focus:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm font-semibold relative z-10"
                  />
                </div>
                <div className="relative group/filter">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-100/0 to-pink-100/0 group-hover/filter:from-purple-100/30 group-hover/filter:to-pink-100/30 rounded-2xl transition-all duration-300"></div>
                  <Filter className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 group-hover/filter:text-purple-600 transition-all duration-300 z-10" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-14 pr-12 py-7 text-base border-2 border-gray-200 focus:border-purple-500 rounded-2xl shadow-lg focus:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm font-bold appearance-none cursor-pointer hover:border-purple-300 relative z-10 min-w-[200px]"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {searchQuery && (
                <div className="mt-6 flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-md">
                  <Zap className="h-5 w-5 text-blue-600 animate-pulse" />
                  <span className="font-bold text-gray-700">
                    Found <span className="text-blue-600 text-lg">{filteredAllProducts.length}</span> products matching "{searchQuery}"
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Premium Products List */}
          {filteredAllProducts.length === 0 ? (
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50/60 to-indigo-50/40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
              <CardContent className="p-20 text-center relative z-10">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-full mb-8 shadow-2xl transform group-hover:scale-110 transition-transform duration-500">
                  <Search className="h-16 w-16 text-blue-500" />
                </div>
                <h3 className="text-3xl font-black text-gray-800 mb-4">No Products Found</h3>
                <p className="text-gray-600 font-bold text-lg mb-3">Try adjusting your search or category filter</p>
                <p className="text-sm text-gray-500 font-medium mb-6">Or check if all products are already trending</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="border-2 border-blue-300 hover:bg-blue-50 rounded-xl font-bold"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {filteredAllProducts.map((product) => (
                <Card 
                  key={product._id} 
                  className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 group bg-white relative overflow-hidden transform hover:-translate-y-3 hover:scale-[1.02]"
                >
                  {/* Premium gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-indigo-50/0 to-purple-50/0 group-hover:from-blue-50/60 group-hover:via-indigo-50/40 group-hover:to-purple-50/60 transition-all duration-700"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/0 to-indigo-200/0 group-hover:from-blue-200/30 group-hover:to-indigo-200/30 rounded-full blur-2xl transition-all duration-700"></div>
                  
                  <div className="relative">
                    {product.image || (product.images && product.images.length > 0) ? (
                      <div className="relative w-full h-64 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 rounded-t-2xl overflow-hidden group/image">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/0 to-indigo-100/0 group-hover/image:from-blue-100/20 group-hover/image:to-indigo-100/20 transition-all duration-500"></div>
                        <img
                          src={product.image || product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-contain p-5 group-hover:scale-[1.15] transition-transform duration-700"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-gray-100 via-gray-150 to-gray-200 rounded-t-2xl flex items-center justify-center group/image">
                        <ShoppingBag className="h-20 w-20 text-gray-300 group-hover/image:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="mb-4">
                      <Badge variant="outline" className="text-xs font-black border-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm">
                        {product.brand}
                      </Badge>
                    </div>
                    
                    <h3 className="font-black text-gray-900 mb-4 line-clamp-2 text-base leading-snug group-hover:text-blue-600 transition-colors duration-300 min-h-[3.5rem]">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-5 pb-5 border-b-2 border-gray-100">
                      <div className="flex flex-col gap-2">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">Category</span>
                        <Badge className="text-xs capitalize bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-2 border-purple-200 w-fit font-bold px-2 py-1">
                          {product.category}
                        </Badge>
                      </div>
                      {product.prices && product.prices.length > 0 && (
                        <div className="text-right">
                          <div className="text-2xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent mb-1">
                            ₹{Math.min(...product.prices.map(p => p.price)).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500 font-bold">Best Price</div>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl font-black border-0 text-white text-base py-6 relative group/btn overflow-hidden"
                      onClick={() => handleAddToTrending(product._id)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      <Plus className="h-5 w-5 mr-2 relative z-10" />
                      <span className="relative z-10">Add to Trending</span>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendingProducts;

