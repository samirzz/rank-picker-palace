
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

// Reset password schema
const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ResetPasswordFormProps = {
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setAuthMode: React.Dispatch<React.SetStateAction<"login" | "signup" | "reset-password">>;
};

const ResetPasswordForm = ({ setErrorMessage, setAuthMode }: ResetPasswordFormProps) => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/auth?mode=update-password`,
      });
      
      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage("Password reset email sent. Please check your inbox.");
        toast({
          title: "Reset email sent",
          description: "Check your inbox for a password reset link",
        });
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {successMessage ? (
        <div className="text-center space-y-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-md p-4 mb-6">
            <p className="text-green-200 text-sm">{successMessage}</p>
          </div>
          <Button 
            variant="outline" 
            className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
            onClick={() => setAuthMode("login")}
          >
            Back to Login
          </Button>
        </div>
      ) : (
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
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-mlbb-purple to-mlbb-darkpurple hover:opacity-90"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
            
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className="text-mlbb-lightpurple hover:text-white text-sm transition-colors"
              >
                Back to Login
              </button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ResetPasswordForm;
