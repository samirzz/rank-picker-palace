
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type AuthContainerProps = {
  title: string;
  subtitle: string;
  errorMessage: string | null;
  children: React.ReactNode;
};

const AuthContainer = ({ title, subtitle, errorMessage, children }: AuthContainerProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="glass-panel overflow-hidden relative p-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-mlbb-purple/30 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-mlbb-gold/20 rounded-full filter blur-3xl opacity-10"></div>
          
          <div className="text-center mb-6 relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
            <p className="text-gray-400 mt-2 text-sm">{subtitle}</p>
          </div>
          
          {errorMessage && (
            <Alert variant="destructive" className="bg-red-500/10 border border-red-500/30 rounded-md mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-200 text-sm">{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
