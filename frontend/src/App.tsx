import { BrowserRouter, Routes, Route } from "react-router-dom";
import Totem from "@/components/Totem";
import TurnPanel from "@/components/TurnPanel";
import Box from "@/components/Box";
import {
  StateProvider,
} from "@/hooks/useStateProvider";
import Visor from "@/components/Visor";
import Analytics from "@/components/Analytics";
import Home from "@/components/Home";
import { Toaster } from "react-hot-toast";

const boxesToShow = [
  {
    title: 'Veterinarios',
    boxesN: 2,
    shortName: false
  },
  {
    title: 'Ventas',
    boxesN: 1,
    shortName: true
  }
];

const dataBoxArray = [
  {
    ProfessionalID: 1,
    box: 1,
    img: "veterinario1.png",
    alt: 'Veterinario 1',
  },
  {
    ProfessionalID: 2,
    box: 2,
    img: "veterinario2.png",
    alt: 'Veterinario 2',
  },
  {
    ProfessionalID: 3,
    box: 2,
    img: "veterinario2.png",
    alt: 'Veterinario 3',
  },
];

const salesDataBox = [
  {
    ProfessionalID: 0,
    box: 4,
    img: "ventas.png",
    alt: 'Ventas',
  }
];

const routes = [
  { path: '/', component: <Home /> },
  { path: '/Totem', component: <Totem /> },
  { path: '/Visor', component: <Visor boxesToShow={boxesToShow} /> },
  { path: '/Analytics', component: <Analytics /> },
  { path: '/Box1', component: <Box boxID={1} title='Presencia de Veterinario ' /> },
  { path: '/Box2', component: <Box boxID={2} controlPanelN={2} title='Presencia de Veterinario ' /> },
  { path: '/Box4', component: <Box boxID={4} title='Ventas' /> },
  { path: '/Ventas', component: <TurnPanel dataBoxArray={salesDataBox} numBoxes={0} showSalesCard={true} title="Sales Turns" /> },
  { path: '/Veterinarios', component: <TurnPanel dataBoxArray={dataBoxArray} numBoxes={2} showSalesCard={false} title="" /> }
];

function App() {
  return (
    <StateProvider>
      <BrowserRouter>
        <Routes>
          {routes.map((route, key) => <Route key={key} path={route.path} element={route.component} />)}
        </Routes>
        <Toaster />
      </BrowserRouter>
    </StateProvider>
  );
}

export default App;
