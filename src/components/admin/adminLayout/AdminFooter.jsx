import { Link } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";

const AdminFooter = () => {
  const { darkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border-t mt-auto py-3.5`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img className="h-8 w-auto mr-2" src="/mwulogo.png" alt="CrewAfya" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {currentYear} CrewAfya. All rights reserved.
            </span>
          </div>
          <div className="flex space-x-6">
            <Link
              to="/admin/help"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-admin-600 dark:hover:text-admin-400"
            >
              Help Center
            </Link>
            <Link
              to="/admin/documentation"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-admin-600 dark:hover:text-admin-400"
            >
              Documentation
            </Link>
            <Link
              to="/admin/privacy"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-admin-600 dark:hover:text-admin-400"
            >
              Privacy
            </Link>
            <Link
              to="/admin/terms"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-admin-600 dark:hover:text-admin-400"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
