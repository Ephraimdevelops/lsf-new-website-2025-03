
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '../components/layout/Layout';

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="text-9xl font-bold text-primary mb-4">404</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-neutral-gray mb-8 max-w-lg mx-auto">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              variant="default" 
              size="lg"
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Go Back
            </Button>
            <Link to="/">
              <Button 
                variant="outline" 
                size="lg"
                className="flex items-center justify-center gap-2"
              >
                <Home size={18} />
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
