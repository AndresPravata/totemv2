import { BrowserRouter, Routes, Route } from "react-router-dom";
import Totem from "./components/Totem";
import Veterinarios from "./components/Veterinarios";
import Ventas from "./components/Ventas";
import Box1 from "./components/Box1";
import Box2 from "./components/Box2";
import {
  VeterinarioProvider,
  Veterinario2Provider,
} from "./hooks/useEstadoVeterinario";
import Visor from "./components/Visor";
import Analytics from "./components/Analytics";
import Home from "./components/Home";
import { Toaster } from "react-hot-toast";
import Box4 from "./components/Box4";

function App() {
  return (
    <VeterinarioProvider>
      <Veterinario2Provider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/totem" element={<Totem />} />
            <Route path="/veterinarios" element={<Veterinarios />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/box1" element={<Box1 />} />
            <Route path="/box2" element={<Box2 />} />
            <Route path="/box4" element={<Box4 />} />
            <Route path="/visor" element={<Visor />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </Veterinario2Provider>
    </VeterinarioProvider>
  );
}

export default App;
