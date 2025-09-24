import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HomeHeader from "@/components/HomeHeader"; // Import the new header component

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-4">
      <HomeHeader /> {/* Use the new header component */}
      <div className="text-center mb-8">
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Start building your amazing project here!
        </p>
      </div>
      <div className="flex space-x-4 mb-8">
        <Link to="/">
          <Button size="lg" className="text-lg px-8 py-4">Go to 3D Print Calculator</Button>
        </Link>
        {/* The settings button is now part of HomeHeader */}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;