import Heading from "@/components/ui/Heading/Heading";

const CTA = () => {
  return (
    <section className="cta">
      <Heading
        labelText="JOIN US"
        mainHeading="Tell us what<br/>you’re building"
        subHeading="Work with a team that brings clarity, care, and creativity to every project."
        subHeadingClassName="cta-subheading"
        btnText="Book Now"
        btnUrl="/contact"
        btnVariant="primary"
      />
    </section>
  );
};

export default CTA;