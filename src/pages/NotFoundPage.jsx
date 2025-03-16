import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import { PiWarningDuotone } from 'react-icons/pi';
import { MdSpaceDashboard } from 'react-icons/md';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-xl w-full text-center">
        <PiWarningDuotone className="text-7xl mx-auto mb-2 md:mb-4 text-red-600 dark:text-red-400" />
        <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-red-600 dark:text-red-400">404 Error</h1>
        <h2 className="mt-2 md:mt-4 text-3xl sm:text-4xl  font-bold text-primary-600 dark:text-primary-400">Page Not Found</h2>
        <p className="mt-1 sm:mt-2 text-base sm:text-lg text-gray-600 dark:text-gray-400">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-4 md:mt-6">
          <Link
            to="/"
            className="btn btn-primary inline-flex items-center"
          >
            <MdSpaceDashboard className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 