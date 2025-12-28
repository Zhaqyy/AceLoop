import Hero from './sections/Hero';
import Who from './sections/Who';
import Services from './sections/Services';
import Works from './sections/Works';
import Faq from './sections/Faq';
import CTA from './sections/CTA';
import './home.scss';

const Home = () => {
  return (
    <>
      <Hero />
      <Who />
      <Services />
      <Works />
      <Faq />
      <CTA />
      {/* Add more sections here as needed */}
    </>
  );
};

export default Home;

