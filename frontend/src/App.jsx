import Navbar from './components/Navbar.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <AppRoutes />
      </main>
    </>
  );
}

export default App;
