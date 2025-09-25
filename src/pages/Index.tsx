import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HomeHeader from "@/components/HomeHeader";
import { useTranslation } from "react-i18next"; // Import useTranslation

const Index = () => {
  const { t } = useTranslation(); // Initialize useTranslation

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-4">
      <HomeHeader />
      <div className="text-center mb-8">
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {t('home.startBuilding')} {/* Use translated text */}
        </p>
      </div>
      <div className="flex space-x-4 mb-8">
        <Link to="/">
          <Button size="lg" className="text-lg px-8 py-4">{t('home.goToCalculator')}</Button> {/* Use translated text */}
        </Link>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;