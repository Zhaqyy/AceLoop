import { Routes, Route } from 'react-router-dom';
import Layout from '@layouts/Layout/Layout';
import Home from '@pages/home/Home';
import Product from '@pages/product/Product';
import NotFound from '@pages/NotFound/NotFound';
import './App.scss';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
