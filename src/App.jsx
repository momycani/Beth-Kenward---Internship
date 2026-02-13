import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Explore from "./pages/Explore";
import Author from "./pages/Author";
import ItemDetails from "./pages/ItemDetails";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

function App() {
  return ( 
    <>     
    <Nav />
      <Routes>        
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/author/:authorId" element={<Author />} />
        <Route path="/item/:nftId" element={<ItemDetails />} />
        <Route path="*" element={<div style={{ padding: 24 }}>Page not found</div>} />
      </Routes>
      <Footer />  
    </>  
  );
}

export default App;
