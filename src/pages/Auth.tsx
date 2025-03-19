
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthContainer from "@/components/auth/AuthContainer";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

const Auth = () => {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    checkSession();
  }, [navigate]);

  const toggleAuthMode = () => {
    setAuthMode(authMode === "login" ? "signup" : "login");
    setErrorMessage(null);
  };

  const getTitle = () => authMode === "login" ? "Welcome Back" : "Create Account";
  const getSubtitle = () => authMode === "login" 
    ? "Log in to access your boosting services" 
    : "Sign up to get started with MLBooster";

  return (
    <AuthContainer
      title={getTitle()}
      subtitle={getSubtitle()}
      errorMessage={errorMessage}
    >
      {authMode === "login" ? (
        <LoginForm setErrorMessage={setErrorMessage} />
      ) : (
        <SignupForm setErrorMessage={setErrorMessage} setAuthMode={setAuthMode} />
      )}
      
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
    </AuthContainer>
  );
};

export default Auth;
