
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple admin authentication (in a real app, use proper authentication)
    // For demo purposes: username: admin, password: admin123
    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        // Store auth token in localStorage
        localStorage.setItem("adminAuth", "true");
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
          variant: "default",
        });
        navigate("/admin/dashboard");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black to-mlbb-purple/30">
      <div className="w-full max-w-md px-4">
        <div className="glass-panel p-6 md:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-mlbb-purple mb-2">Admin Portal</h1>
            <p className="text-gray-400 text-sm">Login to manage rank pricing</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-black/60 border border-mlbb-purple/30 rounded-md focus:outline-none focus:ring-2 focus:ring-mlbb-purple text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-black/60 border border-mlbb-purple/30 rounded-md focus:outline-none focus:ring-2 focus:ring-mlbb-purple text-white"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-mlbb-purple to-mlbb-darkpurple hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
