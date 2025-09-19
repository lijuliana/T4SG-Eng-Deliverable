import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import AnimalSpeedGraph from "../animal-speed-graph";

export default function VisualizationPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <TypographyH2>Animal Speed Visualization</TypographyH2>
        <p className="mt-2 text-gray-600">
          Interactive bar chart showing the relationship between animal speeds and their diets.
          Data has been cleaned and processed to show the top 20 fastest animals by diet type.
        </p>
      </div>
      
      <Separator className="my-6" />
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <AnimalSpeedGraph />
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <p>
          <strong>Data Source:</strong> Cleaned animal dataset with speed and diet information
        </p>
        <p>
          <strong>Visualization:</strong> D3.js bar chart with interactive tooltips and color-coded diet categories
        </p>
        <p>
          <strong>Note:</strong> Hover over bars to see detailed information about each animal
        </p>
      </div>
    </div>
  );
}
