
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if already logged in
    const adminAuth = localStorage.getItem("adminAuth");
    if (adminAuth) {
      navigate("/admin/game-selection");
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    // Simple mock authentication - In production, use a proper auth service
    setTimeout(() => {
      if (username === "admin" && password === "password") {
        localStorage.setItem("adminAuth", JSON.stringify({ username, timestamp: Date.now() }));
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard.",
        });
        navigate("/admin/game-selection");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password.",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-mlbb-purple/30 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-panel p-6 md:p-8 rounded-lg shadow-xl border border-mlbb-purple/20">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Login</h1>
            <p className="text-gray-400 mt-2">Enter your credentials to access the dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-black/50 border-gray-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black/50 border-gray-700"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              variant="gradient"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>For demo purposes, use: admin / password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
