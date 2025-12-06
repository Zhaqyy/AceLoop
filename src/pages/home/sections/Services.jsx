import Heading from "@/components/ui/Heading/Heading";
import Gallery from "@/components/ui/Gallery/Gallery";

const Services = () => {
  const projects = [
    {
      title: "Product Packetshot",
      src: "/Products/pconfig.webp",
      color: "#000000",
    //   description: "we create high-end visuals for your furniture and product design."
    },
    {
      title: "Lifestyle Staging",
      src: "/Products/ppacket2.webp",
      color: "#2c2c2c",
    //   description: "sophisticated lifestyle staging for your products."
    },
    {
      title: "Marketing",
      src: "/Products/ppacket.webp",
      color: "#EFE8D3",
    //   description: "marketing and advertising for your products."
    },
    {
      title: "3D Visualization",
      src: "/Products/plife.webp",
      color: "#EFE8D3",
    //   description: "3D visualization for your products."
    },
    {
      title: "Web Design & Development",
      src: "/Products/plife2.webp",
      color: "#706D63",
    //   description: "web design and development for your products."
    }
  ];

  return (
    <section className="services">
      <Heading
        // labelText="Services"
        mainHeading="Where Imagination<br/>Meets Reality"
        alignLeft={true}
        // subHeading="Our services are designed to help you create high-end visuals for your furniture and product design."
        // subHeadingClassName="services-subheading"
      />
      <Gallery projects={projects} />
    </section>
  );
};

export default Services;