import Hero from './sections/Hero';
import Who from './sections/Who';
import Services from './sections/Services';
import './home.scss';

const Home = () => {
  return (
    <>
      <Hero />
      <Who />
      <Services />
      {/* Add more sections here as needed */}
    </>
  );
};

export default Home;

