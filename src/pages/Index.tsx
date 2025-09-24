import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession } from "@/context/SessionContext"; // Import useSession
import { useEffect } from "react";

const Index = () => {
  const { session, loading } = useSession(); // Use session and loading from context

  // The SessionContextProvider already handles redirects, but we can add a local check if needed
  // useEffect(() => {
  //   if (!loading && !session) {
  //     // Optionally, do something specific if not logged in, though SessionContextProvider will redirect
  //   }
  // }, [session, loading]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Welcome to Your Blank App</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Start building your amazing project here!
        </p>
      </div>
      <div className="flex space-x-4 mb-8">
        <Link to="/">
          <Button size="lg" className="text-lg px-8 py-4">Go to 3D Print Calculator</Button>
        </Link>
        <Link to="/settings">
          <Button size="lg" variant="outline" className="text-lg px-8 py-4">Settings</Button>
        </Link>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;