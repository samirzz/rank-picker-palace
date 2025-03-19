
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Mail, Key, User } from "lucide-react";

// Signup schema with properly optional username
const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }).optional(),
});

type SignupFormProps = {
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setAuthMode: React.Dispatch<React.SetStateAction<"login" | "signup">>;
};

const SignupForm = ({ setErrorMessage, setAuthMode }: SignupFormProps) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setLoading(true);
    setErrorMessage(null);
    
    try {
      // Process username value - if empty string, set to null or undefined
      const username = values.username ? values.username : null;
      
      // Create user with email and password
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            username: username,
          },
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
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
                    autoComplete="email"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
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
                    autoComplete="username"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
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
                    autoComplete="new-password"
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
  );
};

export default SignupForm;
