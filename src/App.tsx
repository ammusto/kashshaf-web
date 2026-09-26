import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Corpus from './pages/Corpus';
import BookPage from './pages/BookPage';
import AuthorPage from './pages/AuthorPage';
import Download from './pages/Download';
import Docs from './pages/Docs';
import About from './pages/About';
import { BooksProvider } from './contexts/BooksContext';

function App() {
  return (
    <BrowserRouter>
      <BooksProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/corpus" element={<Corpus />} />
            <Route path="/book/:id" element={<BookPage />} />
            <Route path="/author/:id" element={<AuthorPage />} />
            <Route path="/download" element={<Download />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
      </BooksProvider>
    </BrowserRouter>
  );
}

export default App;
