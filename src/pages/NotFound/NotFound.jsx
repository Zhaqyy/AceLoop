import { Button } from '@/components/ui';
import './NotFound.scss';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">Page not found</p>
        <p className="not-found-description">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Button variant="primary" to="/">
            Go Home
          </Button>
          <Button variant="secondary" to="/product">
            View Product
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

