
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        // Check admin session from localStorage first for quick check
        const isAdminLoggedIn = localStorage.getItem("adminAuth") === "true";

        if (!isAdminLoggedIn) {
          // If not logged in, redirect to admin login
          navigate("/admin/login");
          return;
        }

        // If we have the localStorage flag set, let's also verify in the database
        const { data, error } = await supabase
          .from("admin_users")
          .select("username")
          .single();

        if (error || !data) {
          // If there's an issue with the database check, log out and redirect
          console.error("Admin authentication error:", error);
          localStorage.removeItem("adminAuth");
          toast({
            title: "Authentication error",
            description: "Please login again.",
            variant: "destructive",
          });
          navigate("/admin/login");
        }
      } catch (error) {
        console.error("Admin auth check failed:", error);
        toast({
          title: "Authentication error",
          description: "Please login again.",
          variant: "destructive",
        });
        navigate("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAuth();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-white">Verifying admin access...</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
