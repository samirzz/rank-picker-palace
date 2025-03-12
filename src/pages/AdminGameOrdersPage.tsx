
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Check, 
  Clock, 
  Download, 
  MessageCircle, 
  Search, 
  Shield, 
  Star, 
  Users, 
  User,
  Filter,
  ChevronDown,
  AlignLeft,
  AlertCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Order interface
interface GameOrder {
  id: string;
  gameId: string;
  customerId: string;
  customerName: string;
  currentRank: string;
  targetRank: string;
  boostMode: "solo" | "duo";
  addOns: {
    priority: boolean;
    streaming: boolean;
  };
  status: "pending" | "processing" | "completed" | "cancelled";
  price: number;
  createdAt: string;
  assignedBooster?: string;
  progress?: number;
  estimatedCompletion?: string;
}

// Booster interface
interface Booster {
  id: string;
  name: string;
  games: string[];
  totalOrders: number;
  completedOrders: number;
  rating: number;
  status: "available" | "busy" | "offline";
}

// Mock data for orders
const mockOrders: GameOrder[] = [
  {
    id: "order-1",
    gameId: "pubg",
    customerId: "user-1",
    customerName: "Alex Johnson",
    currentRank: "Gold",
    targetRank: "Diamond",
    boostMode: "solo",
    addOns: {
      priority: true,
      streaming: false,
    },
    status: "processing",
    price: 85,
    createdAt: "2023-07-10T10:30:00Z",
    assignedBooster: "booster-1",
    progress: 60,
    estimatedCompletion: "2023-07-13"
  },
  {
    id: "order-2",
    gameId: "pubg",
    customerId: "user-2",
    customerName: "Sarah Williams",
    currentRank: "Bronze",
    targetRank: "Gold",
    boostMode: "duo",
    addOns: {
      priority: false,
      streaming: true,
    },
    status: "pending",
    price: 65,
    createdAt: "2023-07-11T14:20:00Z"
  },
  {
    id: "order-3",
    gameId: "pubg",
    customerId: "user-3",
    customerName: "Michael Brown",
    currentRank: "Silver",
    targetRank: "Platinum",
    boostMode: "solo",
    addOns: {
      priority: false,
      streaming: false,
    },
    status: "completed",
    price: 70,
    createdAt: "2023-07-08T09:15:00Z",
    assignedBooster: "booster-2",
    progress: 100,
    estimatedCompletion: "2023-07-11"
  },
  {
    id: "order-4",
    gameId: "codm",
    customerId: "user-4",
    customerName: "Jennifer Clark",
    currentRank: "Elite",
    targetRank: "Master",
    boostMode: "solo",
    addOns: {
      priority: true,
      streaming: true,
    },
    status: "processing",
    price: 95,
    createdAt: "2023-07-09T16:45:00Z",
    assignedBooster: "booster-3",
    progress: 40,
    estimatedCompletion: "2023-07-14"
  },
  {
    id: "order-5",
    gameId: "pubg",
    customerId: "user-5",
    customerName: "David Wilson",
    currentRank: "Platinum",
    targetRank: "Crown",
    boostMode: "duo",
    addOns: {
      priority: true,
      streaming: false,
    },
    status: "cancelled",
    price: 110,
    createdAt: "2023-07-07T11:30:00Z"
  }
];

// Mock data for boosters
const mockBoosters: Booster[] = [
  {
    id: "booster-1",
    name: "John Doe",
    games: ["pubg", "mlbb", "codm"],
    totalOrders: 127,
    completedOrders: 120,
    rating: 4.8,
    status: "busy"
  },
  {
    id: "booster-2",
    name: "Jane Smith",
    games: ["pubg", "coc"],
    totalOrders: 95,
    completedOrders: 92,
    rating: 4.7,
    status: "available"
  },
  {
    id: "booster-3",
    name: "Mike Johnson",
    games: ["codm", "pubg"],
    totalOrders: 78,
    completedOrders: 76,
    rating: 4.9,
    status: "available"
  },
  {
    id: "booster-4",
    name: "Sara Williams",
    games: ["mlbb", "pubg", "codm"],
    totalOrders: 156,
    completedOrders: 150,
    rating: 4.6,
    status: "offline"
  }
];

const AdminGameOrdersPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("orders");
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get filtered orders
  const getFilteredOrders = () => {
    let filtered = mockOrders;
    
    // Filter by game
    if (gameId) {
      filtered = filtered.filter(order => order.gameId === gameId);
    }
    
    // Filter by status
    if (orderFilter !== "all") {
      filtered = filtered.filter(order => order.status === orderFilter);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        order => 
          order.id.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.currentRank.toLowerCase().includes(query) ||
          order.targetRank.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };
  
  // Get filtered boosters
  const getFilteredBoosters = () => {
    let filtered = mockBoosters;
    
    // Filter by game if gameId is specified
    if (gameId) {
      filtered = filtered.filter(booster => booster.games.includes(gameId));
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        booster => booster.name.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };
  
  // Assign booster to order
  const assignBooster = (orderId: string, boosterId: string) => {
    // In a real app, this would make an API call
    toast({
      title: "Booster Assigned",
      description: "Booster has been successfully assigned to this order.",
    });
  };
  
  // Update order status
  const updateOrderStatus = (orderId: string, status: GameOrder["status"]) => {
    // In a real app, this would make an API call
    toast({
      title: "Order Updated",
      description: `Order status has been changed to ${status}.`,
    });
  };
  
  // Get game name from ID
  const getGameName = (id: string) => {
    const games: Record<string, string> = {
      "pubg": "PUBG Mobile",
      "mlbb": "Mobile Legends",
      "coc": "Clash of Clans",
      "codm": "Call of Duty Mobile"
    };
    
    return games[id] || id;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-mlbb-purple/20">
      <header className="bg-black/60 border-b border-mlbb-purple/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-mlbb-purple">
            Admin Dashboard: {gameId ? getGameName(gameId) : "All Games"}
          </h1>
          
          <div className="flex items-center gap-2">
            <Link to="/admin/dashboard">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 md:py-8">
        <Tabs defaultValue="orders" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="boosters">Boosters</TabsTrigger>
          </TabsList>
          
          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search orders..."
                    className="pl-10 bg-black/20 border-gray-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="relative">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 bg-black/20 border-gray-700"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Status: {orderFilter === "all" ? "All" : orderFilter}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  
                  <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-black/90 border border-gray-700">
                    <div className="py-1">
                      {["all", "pending", "processing", "completed", "cancelled"].map((status) => (
                        <button
                          key={status}
                          className={`block px-4 py-2 text-sm w-full text-left ${
                            orderFilter === status 
                              ? "bg-mlbb-purple/20 text-white" 
                              : "text-gray-300 hover:bg-gray-800"
                          }`}
                          onClick={() => setOrderFilter(status)}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Button 
                  className="flex items-center gap-2 bg-mlbb-purple hover:bg-mlbb-purple/90"
                  onClick={() => {
                    toast({
                      title: "Export Successful",
                      description: "Orders data has been exported to CSV.",
                    });
                  }}
                >
                  <Download className="h-4 w-4" />
                  <span>Export Orders</span>
                </Button>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-black/40">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Rank Boost
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Mode
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-black/20 divide-y divide-gray-700">
                  {getFilteredOrders().map((order) => (
                    <tr key={order.id} className="hover:bg-black/40">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                        {order.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {order.customerName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {order.currentRank} → {order.targetRank}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          {order.boostMode === "solo" ? (
                            <User className="h-4 w-4 text-mlbb-purple" />
                          ) : (
                            <Users className="h-4 w-4 text-mlbb-purple" />
                          )}
                          <span>{order.boostMode === "solo" ? "Solo" : "Duo"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-mlbb-gold">
                        ${order.price}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === "completed" ? "bg-green-900/50 text-green-400" :
                          order.status === "processing" ? "bg-blue-900/50 text-blue-400" :
                          order.status === "pending" ? "bg-yellow-900/50 text-yellow-400" :
                          "bg-red-900/50 text-red-400"
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-mlbb-purple hover:bg-mlbb-purple/20"
                            title="View Details"
                          >
                            <AlignLeft className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-mlbb-purple hover:bg-mlbb-purple/20"
                            title="Message Customer"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          
                          {order.status === "pending" && (
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-green-500 hover:bg-green-500/20"
                              title="Start Processing"
                              onClick={() => updateOrderStatus(order.id, "processing")}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {order.status === "processing" && (
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-green-500 hover:bg-green-500/20"
                              title="Mark as Completed"
                              onClick={() => updateOrderStatus(order.id, "completed")}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {(order.status === "pending" || order.status === "processing") && (
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-red-500 hover:bg-red-500/20"
                              title="Cancel Order"
                              onClick={() => updateOrderStatus(order.id, "cancelled")}
                            >
                              <AlertCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {getFilteredOrders().length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">No orders found matching your filters.</p>
              </div>
            )}
          </TabsContent>
          
          {/* Boosters Tab */}
          <TabsContent value="boosters">
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search boosters..."
                  className="pl-10 bg-black/20 border-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button 
                className="flex items-center gap-2 bg-mlbb-purple hover:bg-mlbb-purple/90"
                onClick={() => {
                  toast({
                    title: "Add Booster",
                    description: "Feature coming soon!",
                  });
                }}
              >
                <User className="h-4 w-4" />
                <span>Add Booster</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredBoosters().map((booster) => (
                <div 
                  key={booster.id} 
                  className="border border-gray-700 rounded-lg overflow-hidden bg-black/20"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{booster.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <span className="text-mlbb-gold flex items-center">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            {booster.rating}
                          </span>
                          <span>•</span>
                          <span>{booster.completedOrders} orders</span>
                        </div>
                      </div>
                      
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        booster.status === "available" ? "bg-green-900/50 text-green-400" :
                        booster.status === "busy" ? "bg-yellow-900/50 text-yellow-400" :
                        "bg-gray-700/50 text-gray-400"
                      }`}>
                        {booster.status.charAt(0).toUpperCase() + booster.status.slice(1)}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-sm text-gray-400 mb-1">Games:</div>
                      <div className="flex flex-wrap gap-2">
                        {booster.games.map((game) => (
                          <div key={game} className="px-2 py-1 bg-gray-800 rounded text-xs">
                            {getGameName(game)}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <div>Success Rate: {Math.round((booster.completedOrders / booster.totalOrders) * 100)}%</div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-700 px-4 py-3 flex justify-between">
                    <Button 
                      variant="ghost" 
                      className="text-mlbb-purple hover:bg-mlbb-purple/20 text-sm"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    
                    <Button
                      className="bg-mlbb-purple hover:bg-mlbb-purple/90 text-white text-sm"
                      onClick={() => {
                        if (activeTab === "orders" && getFilteredOrders().length > 0) {
                          const pendingOrder = getFilteredOrders().find(o => o.status === "pending");
                          if (pendingOrder) {
                            assignBooster(pendingOrder.id, booster.id);
                          }
                        } else {
                          toast({
                            title: "No pending orders",
                            description: "There are no pending orders to assign.",
                          });
                        }
                      }}
                      disabled={booster.status !== "available"}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Assign Order
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {getFilteredBoosters().length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">No boosters found matching your search.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminGameOrdersPage;
