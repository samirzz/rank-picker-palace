
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthContainer from "@/components/auth/AuthContainer";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "reset-password" ? "reset-password" : "login";
  const [authMode, setAuthMode] = useState<"login" | "signup" | "reset-password">(initialMode);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    checkSession();

    // Handle OAuth responses when redirected back from Google
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        toast({
          title: "Logged in successfully",
          description: "Welcome back!",
        });
        navigate('/');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const toggleAuthMode = () => {
    setAuthMode(authMode === "login" ? "signup" : "login");
    setErrorMessage(null);
  };

  const getTitle = () => {
    switch (authMode) {
      case "login": return "Welcome Back";
      case "signup": return "Create Account";
      case "reset-password": return "Reset Password";
      default: return "Welcome";
    }
  };
  
  const getSubtitle = () => {
    switch (authMode) {
      case "login": return "Log in to access your boosting services";
      case "signup": return "Sign up to get started with MLBooster";
      case "reset-password": return "Enter your email to receive a password reset link";
      default: return "";
    }
  };

  return (
    <AuthContainer
      title={getTitle()}
      subtitle={getSubtitle()}
      errorMessage={errorMessage}
    >
      {authMode === "login" ? (
        <LoginForm setErrorMessage={setErrorMessage} setAuthMode={setAuthMode} />
      ) : authMode === "signup" ? (
        <SignupForm setErrorMessage={setErrorMessage} setAuthMode={setAuthMode} />
      ) : (
        <ResetPasswordForm setErrorMessage={setErrorMessage} setAuthMode={setAuthMode} />
      )}
      
      {authMode !== "reset-password" && (
        <div className="text-center mt-6">
          <button 
            onClick={toggleAuthMode} 
            className="text-mlbb-lightpurple hover:text-white text-sm transition-colors"
          >
            {authMode === "login" 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Log in"}
          </button>
        </div>
      )}
    </AuthContainer>
  );
};

export default Auth;
