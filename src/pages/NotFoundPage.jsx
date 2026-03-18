import { Link } from "react-router-dom";
import "./NotFoundPage.css";

function NotFoundPage() {
  return (
    <div className="page page-not-found">
      <h2 className="not-found-title">404 - Natural 1</h2>
      <p className="not-found-text">This page has been lost to the Weave.</p>
      
      <Link to="/" className="btn-return">
        Return to the Tavern
      </Link>
    </div>
  );
}

export default NotFoundPage;