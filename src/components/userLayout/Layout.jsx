import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AuthRedirect from "../auth/AuthRedirect";

const Layout = () => {
  return (
    <AuthRedirect>
      <div
        className="flex flex-col min-h-screen relative overflow-hidden"
        style={{
          backgroundImage: "url('/matwana.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Background overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary-50/90 via-gray-50/90 to-primary-100/90 dark:from-gray-900/90 dark:via-gray-800/95 dark:to-primary-800/95"
          style={{ zIndex: "0" }}
        ></div>

        {/* Decorative background elements */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: "1" }}
        >
          {/* Medical themed shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-100/30 to-blue-100/20 dark:from-teal-900/20 dark:to-blue-900/10 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-tr from-blue-100/30 to-teal-100/20 dark:from-blue-900/20 dark:to-teal-900/10 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>

          {/* Heartbeat line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent dark:via-teal-400/10"></div>

          {/* Animated pulse circles */}
          <div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-teal-100/10 to-blue-100/5 dark:from-teal-900/5 dark:to-blue-900/2 rounded-full blur-2xl opacity-40 animate-pulse"
            style={{ animationDuration: "15s" }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-blue-100/10 to-purple-100/5 dark:from-blue-900/5 dark:to-purple-900/2 rounded-full blur-2xl opacity-30 animate-pulse"
            style={{ animationDuration: "20s" }}
          ></div>
        </div>

        {/* Content */}
        
        <main className="flex-grow relative" style={{ zIndex: "2" }}>
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <svg width="100%" height="100%">
              <pattern
                id="admin-grid"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M40 0 L0 0 L0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-admin-500 dark:text-admin-400"
                />
              </pattern>
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="url(#admin-grid)"
              />
            </svg>
          </div>
          <Navbar />
          <Outlet />
          
        <Footer />
        </main>
      </div>
    </AuthRedirect>
  );
};

export default Layout;
