
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Mail, Key, User, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }).optional(),
});

const Auth = () => {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

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

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    setErrorMessage(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        setErrorMessage(error.message);
      } else {
        toast({
          title: "Logged in successfully",
          description: "Welcome back!",
        });
        navigate('/');
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSignupSubmit = async (values: z.infer<typeof signupSchema>) => {
    setLoading(true);
    setErrorMessage(null);
    
    try {
      // Create user with just email and password
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            username: values.username || null,
          },
          // Disable email confirmation for easier testing
          emailRedirectTo: window.location.origin,
        },
      });
      
      console.log("Signup response:", { data, error });
      
      if (error) {
        setErrorMessage(error.message);
      } else if (data?.user) {
        if (data.user.identities && data.user.identities.length === 0) {
          // Email already exists
          setErrorMessage("This email is already registered. Please log in instead.");
          setAuthMode("login");
        } else {
          // Account successfully created
          if (data.session) {
            // User was automatically logged in
            toast({
              title: "Account created successfully",
              description: "You are now logged in.",
            });
            navigate('/');
          } else {
            // Email confirmation might be required by Supabase settings
            toast({
              title: "Account created successfully",
              description: "Please check your email to confirm your account before logging in.",
            });
            setAuthMode("login");
          }
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="glass-panel overflow-hidden relative p-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-mlbb-purple/30 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-mlbb-gold/20 rounded-full filter blur-3xl opacity-10"></div>
          
          <div className="text-center mb-6 relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {authMode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              {authMode === "login" 
                ? "Log in to access your boosting services" 
                : "Sign up to get started with MLBooster"}
            </p>
          </div>
          
          {errorMessage && (
            <Alert variant="destructive" className="bg-red-500/10 border border-red-500/30 rounded-md mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-200 text-sm">{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          {authMode === "login" ? (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            {...field}
                            placeholder="your@email.com"
                            type="email"
                            className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            {...field}
                            placeholder="••••••••"
                            type="password"
                            className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-mlbb-purple to-mlbb-darkpurple hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            {...field}
                            placeholder="your@email.com"
                            type="email"
                            className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Username (optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            {...field}
                            placeholder="username"
                            className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            {...field}
                            placeholder="••••••••"
                            type="password"
                            className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-mlbb-purple to-mlbb-darkpurple hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            </Form>
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
        </div>
      </div>
    </div>
  );
};

export default Auth;
