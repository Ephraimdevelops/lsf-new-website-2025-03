
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[50vh] flex items-center justify-center bg-neutral-light py-20">
        <div className="text-center max-w-md px-4">
          <div className="text-primary text-7xl font-bold mb-6">404</div>
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="text-neutral-gray mb-8">
            We're sorry, the page you requested could not be found. Please check the URL or return to the homepage.
          </p>
          <Link to="/" className="btn-primary inline-block">
            Return to Homepage
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
