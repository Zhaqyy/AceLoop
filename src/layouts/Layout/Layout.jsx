import './Layout.scss';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
};

export default Layout;

