import { Button } from "@ui";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-textContent">
            <div className="hero-textContentGroup">
              <div className="hero-titleGroup">
                <span className="hero-collection">AceLoop</span>
                <h1 className="hero-title">Discover Timeless Elegance</h1>
              </div>
              <p className="hero-subtitle">
                Transforming your space into a sanctuary of style and
                sophistication.
              </p>
            </div>
            <div className="hero-ctaGroup">
              <div className="hero-ctaButton">
                <Button variant="primary">Shop Collection</Button>
              </div>
              <div className="hero-ctaButton">
                <Button variant="secondary">Explore Products</Button>
              </div>
            </div>
            {/* <div className="hero-stats">
              <div className="hero-statItem">
                <span className="hero-statNumber">10K+</span>
                <span className="hero-statLabel">Happy Customers</span>
              </div>
              <div className="hero-statItem">
                <span className="hero-statNumber">549</span>
                <span className="hero-statLabel">5-Star Reviews</span>
              </div>
              <div className="hero-statItem">
                <span className="hero-statNumber">10</span>
                <span className="hero-statLabel">Year Warranty</span>
              </div>
            </div> */}
          </div>
          <div className="hero-imageContent">
            <div className="hero-imageWrapper">
              <div className="hero-placeholderImage">
                <span className="hero-imageLabel">Hero Product Image</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
