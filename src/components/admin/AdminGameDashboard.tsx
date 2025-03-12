
import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Settings, 
  Users, 
  Package, 
  BarChart, 
  LogOut,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Game {
  id: string;
  name: string;
  image: string;
}

const games: Record<string, Game> = {
  "mlbb": {
    id: "mlbb",
    name: "Mobile Legends",
    image: "https://images.unsplash.com/photo-1627396184389-b4414ae2062a?q=80&w=1000&auto=format&fit=crop"
  },
  "pubg": {
    id: "pubg",
    name: "PUBG Mobile",
    image: "https://images.unsplash.com/photo-1614294149528-cc5eff90511a?q=80&w=1000&auto=format&fit=crop"
  },
  "coc": {
    id: "coc",
    name: "Clash of Clans",
    image: "https://images.unsplash.com/photo-1640245539773-4c1a4a3a5be7?q=80&w=1000&auto=format&fit=crop"
  },
  "codm": {
    id: "codm",
    name: "Call of Duty Mobile",
    image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=1000&auto=format&fit=crop"
  }
};

const AdminGameDashboard: React.FC = () => {
  const { gameId } = useParams<{ gameId?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Get current game
  const currentGame = gameId ? games[gameId] : null;
  
  if (!currentGame) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Game Not Found</h2>
          <Button
            onClick={() => navigate("/admin/dashboard")}
            className="bg-mlbb-purple hover:bg-mlbb-purple/90"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/admin/login");
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-mlbb-purple/20 flex">
      {/* Sidebar */}
      <div className="w-64 bg-black/80 border-r border-mlbb-purple/20 hidden md:block">
        <div className="p-4 border-b border-mlbb-purple/20">
          <h2 className="text-xl font-bold text-mlbb-purple truncate">{currentGame.name}</h2>
          <p className="text-gray-400 text-sm">Admin Panel</p>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
                  activeTab === "overview" 
                    ? "bg-mlbb-purple/20 text-mlbb-purple" 
                    : "text-gray-400 hover:bg-black/40 hover:text-white"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Overview</span>
              </button>
            </li>
            <li>
              <Link
                to={`/admin/orders/${gameId}`}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
                  activeTab === "orders" 
                    ? "bg-mlbb-purple/20 text-mlbb-purple" 
                    : "text-gray-400 hover:bg-black/40 hover:text-white"
                }`}
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Orders</span>
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("boosters");
                  toast({
                    title: "Coming Soon",
                    description: "Booster management will be available soon.",
                  });
                }}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
                  activeTab === "boosters" 
                    ? "bg-mlbb-purple/20 text-mlbb-purple" 
                    : "text-gray-400 hover:bg-black/40 hover:text-white"
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Boosters</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("packages");
                  toast({
                    title: "Coming Soon",
                    description: "Package management will be available soon.",
                  });
                }}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
                  activeTab === "packages" 
                    ? "bg-mlbb-purple/20 text-mlbb-purple" 
                    : "text-gray-400 hover:bg-black/40 hover:text-white"
                }`}
              >
                <Package className="h-4 w-4" />
                <span>Packages</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("analytics");
                  toast({
                    title: "Coming Soon",
                    description: "Analytics will be available soon.",
                  });
                }}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
                  activeTab === "analytics" 
                    ? "bg-mlbb-purple/20 text-mlbb-purple" 
                    : "text-gray-400 hover:bg-black/40 hover:text-white"
                }`}
              >
                <BarChart className="h-4 w-4" />
                <span>Analytics</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("settings");
                  toast({
                    title: "Coming Soon",
                    description: "Game settings will be available soon.",
                  });
                }}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
                  activeTab === "settings" 
                    ? "bg-mlbb-purple/20 text-mlbb-purple" 
                    : "text-gray-400 hover:bg-black/40 hover:text-white"
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
            </li>
          </ul>
          
          <div className="mt-8 pt-4 border-t border-gray-700/50">
            <Link to="/admin/dashboard">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-400 hover:text-white hover:bg-black/40"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Games
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="w-full justify-start mt-2 text-gray-400 hover:text-white hover:bg-red-500/20"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile header */}
        <header className="md:hidden bg-black/60 border-b border-mlbb-purple/20">
          <div className="container px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Link to="/admin/dashboard">
                <Button variant="ghost" className="p-1">
                  <ArrowLeft className="h-5 w-5 text-gray-300" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-mlbb-purple">{currentGame.name}</h1>
            </div>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-gray-300 hover:text-white hover:bg-red-500/20"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Mobile navigation */}
          <div className="px-4 pb-2 overflow-x-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger 
                  value="orders" 
                  onClick={() => navigate(`/admin/orders/${gameId}`)}
                >
                  Orders
                </TabsTrigger>
                <TabsTrigger value="boosters">Boosters</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </header>
        
        {/* Content */}
        <main className="container mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              {currentGame.name} Dashboard
            </h2>
            <Button
              className="bg-mlbb-purple hover:bg-mlbb-purple/90"
              onClick={() => navigate(`/admin/orders/${gameId}`)}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Manage Orders
            </Button>
          </div>
          
          {/* Overview Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-black/40 border border-gray-700 rounded-lg p-4">
              <h3 className="text-gray-400 text-sm mb-2">Pending Orders</h3>
              <p className="text-3xl font-bold text-white">12</p>
              <p className="text-sm text-green-400 mt-2">↑ 8% from last week</p>
            </div>
            <div className="bg-black/40 border border-gray-700 rounded-lg p-4">
              <h3 className="text-gray-400 text-sm mb-2">Active Boosters</h3>
              <p className="text-3xl font-bold text-white">8</p>
              <p className="text-sm text-gray-400 mt-2">2 currently online</p>
            </div>
            <div className="bg-black/40 border border-gray-700 rounded-lg p-4">
              <h3 className="text-gray-400 text-sm mb-2">Revenue (This Month)</h3>
              <p className="text-3xl font-bold text-mlbb-gold">$2,450</p>
              <p className="text-sm text-green-400 mt-2">↑ 12% from last month</p>
            </div>
          </div>
          
          {/* Recent Orders */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Recent Orders</h3>
              <Button 
                variant="outline" 
                className="text-sm"
                onClick={() => navigate(`/admin/orders/${gameId}`)}
              >
                View All
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-black/20 border border-gray-700 rounded-lg">
                <thead className="bg-black/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Boost Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {[
                    {
                      id: "ORD-1234",
                      customer: "Alex Johnson",
                      boostType: "Gold to Diamond",
                      status: "Processing",
                      price: "$85"
                    },
                    {
                      id: "ORD-1235",
                      customer: "Sarah Williams",
                      boostType: "Bronze to Gold",
                      status: "Pending",
                      price: "$65"
                    },
                    {
                      id: "ORD-1236",
                      customer: "Michael Brown",
                      boostType: "Silver to Platinum",
                      status: "Completed",
                      price: "$70"
                    }
                  ].map((order, i) => (
                    <tr key={i} className="hover:bg-black/40">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                        {order.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-white">
                        {order.customer}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                        {order.boostType}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === "Completed" ? "bg-green-900/50 text-green-400" :
                          order.status === "Processing" ? "bg-blue-900/50 text-blue-400" :
                          "bg-yellow-900/50 text-yellow-400"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-mlbb-gold">
                        {order.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Game-specific Settings */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Quick Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/40 border border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Rank Pricing</h4>
                <p className="text-sm text-gray-400 mb-3">
                  Configure rank boosting prices for {currentGame.name}
                </p>
                <Button 
                  className="bg-mlbb-purple hover:bg-mlbb-purple/90"
                  onClick={() => navigate("/admin/dashboard")}
                >
                  Configure Pricing
                </Button>
              </div>
              <div className="bg-black/40 border border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Booster Assignment</h4>
                <p className="text-sm text-gray-400 mb-3">
                  Assign boosters to pending orders
                </p>
                <Button 
                  className="bg-mlbb-purple hover:bg-mlbb-purple/90"
                  onClick={() => navigate(`/admin/orders/${gameId}`)}
                >
                  Assign Boosters
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminGameDashboard;
