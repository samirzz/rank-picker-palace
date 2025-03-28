
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EmailSettingsEditor: React.FC = () => {
  const [gmailUser, setGmailUser] = useState("");
  const [gmailAppPassword, setGmailAppPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmailSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("configuration")
          .select("*")
          .in("id", ["gmail_user", "gmail_app_password_masked"]);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const settings = data.reduce((acc, item) => {
            acc[item.id] = item.value;
            return acc;
          }, {} as Record<string, string>);

          setGmailUser(settings.gmail_user || "");
          // We don't actually fetch the real password, just an indication if it's set
          setGmailAppPassword(settings.gmail_app_password_masked ? "••••••••" : "");
          setInitialized(true);
        }
      } catch (error) {
        console.error("Error fetching email settings:", error);
        toast({
          title: "Error",
          description: "Failed to load email settings.",
          variant: "destructive",
        });
      }
    };

    fetchEmailSettings();
  }, [toast]);

  const handleSave = async () => {
    try {
      setLoading(true);

      // Validate inputs
      if (!gmailUser) {
        toast({
          title: "Validation Error",
          description: "Gmail user is required.",
          variant: "destructive",
        });
        return;
      }

      // Prepare updates
      const updates = [
        {
          id: "gmail_user",
          value: gmailUser,
        },
      ];

      // Only update the password if it's changed (not the masked value)
      if (gmailAppPassword && !gmailAppPassword.includes("•")) {
        updates.push({
          id: "gmail_app_password",
          value: gmailAppPassword,
        });
        
        // Also update the masked indicator
        updates.push({
          id: "gmail_app_password_masked",
          value: "true",
        });
      }

      // Upsert the configuration values
      const { error } = await supabase
        .from("configuration")
        .upsert(updates, { onConflict: "id" });

      if (error) {
        throw error;
      }

      toast({
        title: "Settings Saved",
        description: "Email settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving email settings:", error);
      toast({
        title: "Error",
        description: "Failed to save email settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!initialized) {
    return (
      <div className="glass-panel p-4 md:p-6">
        <p className="text-white text-center">Loading email settings...</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-4 md:p-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="gmailUser" className="block text-white mb-2">
            Gmail Address
          </label>
          <Input
            id="gmailUser"
            type="email"
            value={gmailUser}
            onChange={(e) => setGmailUser(e.target.value)}
            placeholder="example@gmail.com"
            className="bg-gray-800 text-white"
          />
          <p className="text-gray-400 text-sm mt-1">
            The Gmail address used to send order confirmation emails
          </p>
        </div>

        <div>
          <label htmlFor="gmailAppPassword" className="block text-white mb-2">
            Gmail App Password
          </label>
          <Input
            id="gmailAppPassword"
            type="password"
            value={gmailAppPassword}
            onChange={(e) => setGmailAppPassword(e.target.value)}
            placeholder="Enter app password"
            className="bg-gray-800 text-white"
          />
          <p className="text-gray-400 text-sm mt-1">
            App password generated from your Google account (not your regular Gmail password)
          </p>
          <a
            href="https://myaccount.google.com/apppasswords"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            How to create an app password
          </a>
        </div>

        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {loading ? "Saving..." : "Save Email Settings"}
        </Button>
      </div>
    </div>
  );
};

export default EmailSettingsEditor;
