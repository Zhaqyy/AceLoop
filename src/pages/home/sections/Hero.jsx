import Heading from "@/components/ui/Heading/Heading";
import CircularGallery from "@/components/ui/Slider/Slider";
import { Button } from "@ui";

const Hero = () => {
  const Images = [
    { image: '/Products/pconfig.webp' },
    { image: '/Products/ppacket.webp' },
    { image: '/Products/plife.webp' },
    { image: '/Products/plife2.webp' },
    { image: '/Products/ppacket2.webp' },
    { image: '/Products/plife3.webp' },
  ]
  return (
    <section className="hero">
      <div className="hero-imageUnderlay"></div>
      {/* <div className="hero-container"> */}
        <div className="hero-content">
          <div className="hero-textContent">
            <Heading
              mainHeading="Discover Timeless Elegance"
              mainHeadingClassName="hero-title"
              subHeadingClassName="hero-subtitle"
              subHeading="Transforming your space into a sanctuary of style and sophistication."
              alignLeft={true}
            />
            <div className="hero-ctaGroup">
              <div className="hero-ctaButton">
                <Button variant="underline-arrow" to="/product" textColor="#f5f5f5" iconColor="#f5f5f5" underlineColor="#f5f5f5">Collections</Button>
              </div>
            </div>
          </div>
          <div className="hero-imageContent">
            <CircularGallery
              images={Images}
              bend={0}
              textColor="#000"
              borderRadius={0.05}
              scrollEase={0.02}
              itemSize={1.25}
              itemPadding={2}
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
