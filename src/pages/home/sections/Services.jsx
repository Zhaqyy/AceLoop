import Heading from "@/components/ui/Heading/Heading";
import Gallery from "@/components/ui/Gallery/Gallery";

const Services = () => {
  const projects = [
    {
      title: "Product Packetshot",
      src: "/Products/pconfig.webp",
      color: "#000000",
    },
    {
      title: "Lifestyle Staging",
      src: "/Products/ppacket2.webp",
      color: "#2c2c2c",
    },
    {
      title: "Marketing",
      src: "/Products/ppacket.webp",
      color: "#EFE8D3",
    },
    {
      title: "3D Visualization",
      src: "/Products/plife.webp",
      color: "#EFE8D3",
    },
    {
      title: "Web Design & Development",
      src: "/Products/plife2.webp",
      color: "#706D63",
    }
  ];

  return (
    <section className="services">
      <Heading
        mainHeading="Where Imagination<br/>Meets Reality"
        alignLeft={true}
      />
      <Gallery projects={projects} />
    </section>
  );
};

export default Services;
