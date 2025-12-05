import Heading from "@/components/ui/Heading/Heading";
import CircularGallery from "@/components/ui/Slider/Slider";

const Who = () => {
  const images = [
    { image: '/Home/chair.png' },
    { image: '/Home/chair.png' },
    { image: '/Home/chair.png' },
    { image: '/Home/chair.png' },
    // { image: '/Home/chair.png' },
    // { image: '/Home/chair.png' },
  ];

  return (
    <section className="who">
        <Heading
            // labelText="Who We Are"
            mainHeading="High-End Furniture Visualization for Ecommerce & Advertising"
            // subHeading="We're a creative agency focused on clarity and meaning. We build timeless foundations."
          />
      <div className="who-slider-wrapper">
        <CircularGallery
          images={images}
          bend={360}
          textColor="#000"
          borderRadius={0.05}
          scrollEase={0.005}
          itemSize={0.5}
          itemPadding={10}
          showText={false}
          lazyLoad={true}
          seamlessScroll={true}
          disableSnap={true}
          inertiaDeceleration={0.85}
          ariaLabel="360 product view"
        />
        <div className="who-heading-overlay">
          <Heading
            labelText="Who We Are"
            // mainHeading="High-End Furniture Visualization for Ecommerce & Advertising"
            subHeading="We are a global CGI studio focused on crafting high-end visuals for furniture and product design."
            subHeadingClassName="who-subheading"
          />
        </div>
      </div>
    </section>
  );
};

export default Who;
