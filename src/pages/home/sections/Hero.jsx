import CircularGallery from "@/components/ui/Slider/Slider";
import { Button } from "@ui";

const Hero = () => {
  return (
    <section className="hero">
      {/* <div className="hero-container"> */}
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
                <Button variant="underline-arrow" to="/product">Collections</Button>
              </div>
            </div>
          </div>
          <div className="hero-imageContent">
            <CircularGallery
              bend={-2.5}
              textColor="#000"
              borderRadius={0.05}
              scrollEase={0.02}
              itemSize={1.25}
              itemPadding={4}
              showText={false}
              lazyLoad={false}
              ariaLabel="Featured products gallery"
            />
          </div>
        </div>
      {/* </div> */}
    </section>
  );
};

export default Hero;
