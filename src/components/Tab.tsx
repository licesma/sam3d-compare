import type { FC } from "react";
import "../App.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoCompare from "./VideoCompare";

interface TabProps {
  type: "correct" | "objects" | "position";
}

export const Tab: FC<TabProps> = () => {
  return (
    <div className="flex gap-6 max-w-none w-full">
      <Tabs defaultValue="model" className="w-full flex">
        <TabsList className="mx-auto">
          <TabsTrigger className="w-186 " value="correct">
            Correct Reconstruction
          </TabsTrigger>
          <TabsTrigger value="position">Wrong Position</TabsTrigger>
          <TabsTrigger value="objects">Wrong Objects</TabsTrigger>
        </TabsList>
        <TabsContent value="correct" className="w-full">
          <VideoCompare label="correct" />
        </TabsContent>
        <TabsContent value="position">
          <VideoCompare label="position" />
        </TabsContent>
        <TabsContent value="objects">
          <VideoCompare label="objects" />
        </TabsContent>
      </Tabs>
    </div>
  );
};
