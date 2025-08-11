import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; // Layout bileşenini import et
import Dashboard from './pages/Dashboard'; // Dashboard bileşenini import et
import BranchesPage from './pages/BranchesPage'; // Şubeler sayfası için placeholder

// İlk kurulumdaki ana sayfa içeriğini kaldırıyoruz
// import Versions from './components/Versions'; // Eğer Versions'ı Dashboard'a taşımadıysan, burada tutabilirsin veya silebilirsin.
// import logo from './assets/electron.svg';

function App(): React.JSX.Element {
  // Backend bağlantı ve şirket çekme mantığı kaldırıldı, artık Dashboard'a yerleşebilir
  // veya daha global bir state yönetimi ile yapılabilir.
  // Şimdilik sadece routing üzerine odaklanıyoruz.

  return (
    <BrowserRouter>
      <Layout> {/* Tüm rotaları Layout içinde sarmalıyoruz */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/branches" element={<BranchesPage />} /> {/* Şubeler sayfası rotası */}
          {/* Diğer sayfalar için rotalar buraya eklenecek */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App
