import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { WalletProvider } from './context/WalletContext';
import { PokemonProvider } from './context/PokemonContext'; 
import Landing from './pages/Landing';
import Marketplace from './pages/Marketplace';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MarketplaceProvider } from './context/MarketplaceContext';
import Profile from './pages/Profile';
import Training from './pages/Training';
import { NotificationProvider } from './context/NotificationContext';
import { TrainingProvider } from './context/TrainingContext';
import Documentation from './pages/Documentation';
import ScrollToTop from './components/ScrollToTop';
import { PokeCoinProvider } from './context/PokeCoinContext';
import TradingPage from './pages/TradingPage';
import UnityGame from './components/UnityGame';

function App() {
  return (
    <Router>
      <WalletProvider>
        <PokeCoinProvider>
          <NotificationProvider>
            <PokemonProvider>
              <TrainingProvider>
                <MarketplaceProvider>
                  <ScrollToTop />
                  <div className="min-h-screen bg-gray-100">
                    <Navbar />
                    <Routes>
                      <Route path="/" element={<Landing />} />
                      <Route path="/marketplace" element={<Marketplace />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/training" element={<Training />} />
                      <Route path="/docs" element={<Documentation />} />
                      <Route path="/trading" element={<TradingPage />} />
                      <Route path="/game" element={<UnityGame />} />
                    </Routes>
                    <Footer/>
                  </div>
                </MarketplaceProvider>
              </TrainingProvider>
            </PokemonProvider>
          </NotificationProvider>
        </PokeCoinProvider>
      </WalletProvider>
    </Router>
  );
}

export default App;