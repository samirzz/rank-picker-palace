
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const LoadingPanel: React.FC = () => {
  return (
    <Card className="glass-panel border-mlbb-purple/20">
      <CardContent className="p-6">
        <div className="flex justify-center items-center h-32 text-white">
          Loading hero data...
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingPanel;
