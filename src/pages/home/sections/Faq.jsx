import Heading from "@/components/ui/Heading/Heading";
import Accordion from "@/components/ui/Accordion";


const Faq = () => {
  const faqItems = [
    {
      heading: "What is the difference between a product and a service?",
      description:
        "A product is a physical item that can be sold, while a service is a intangible offering that can be provided.",
    },
    {
      heading: "What is the difference between a product and a service?",
      description:
        "A product is a physical item that can be sold, while a service is a intangible offering that can be provided.",
    },
    {
      heading: "What is the difference between a product and a service?",
      description:
        "A product is a physical item that can be sold, while a service is a intangible offering that can be provided.",
    },
  ];
  return (
    <section className="faq">
      <Heading
        labelText="FAQ"
        mainHeading="Answers to the questions we hear most often."
        alignLeft={true}
        containerClassName="faq-heading"
      />
      <div className="faq-accordion-wrapper">
        <Accordion items={faqItems} allowMultiple={false} showBorders={false}/>
      </div>
    </section>
  );
};

export default Faq;
