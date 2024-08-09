import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HOST, socketConnection } from "@/lib/utils";
import toast from "react-hot-toast";

const boxes = ['Box1', 'Box2', 'Box4'];
const routes = ['Totem', ...boxes, 'Visor', 'Reset', 'Analytics'];

const OptionComponent = () => {
  const navigate = useNavigate();

  const generalHandler = (route: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    navigate(`/${route}`);
  };

  const handleReset = async () => {

    await axios.put(
      `${HOST}/turnos/all/day`,
      {
        estado: "Finalizado",
      }
    );

    boxes.forEach((box) => {
      localStorage.removeItem(`turno${box}`);

      socketConnection.emit("actualizarBox", { box: box.toUpperCase });
    })

    socketConnection.emit("actualizarTurnos");

    toast.success("Se ha restablecido la aplicación correctamente");
  };

  return (
    <div className="flex items-center justify-center gap-10 flex-col md:flex-row">
      {routes.map((route) => {
        return (
          <div className="grid gap-8 items-start justify-center">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-600 to-sky-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-500 group-hover:duration-500  animate-tilt"></div>
              <Button
                className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600 text-2xl uppercase w-52 h-15 hover:bg-black"
                size={"sm"}
                onClick={route === 'Reset' ? handleReset : generalHandler(route)}
              >
                {route}
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  );
};

const Home = () => {

  const pageInfo = {
    title: "Veterinaria Dr.Luffi",
    logoSrc: "logo.svg",
    logoAlt: "logo",
  }

  return (
    <section className="overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-zinc-950 to-black w-full flex items-center mx-auto flex-col h-screen sm:px-16 px-6">
      <div className="flex flex-col gap-20">
        <div className="flex justify-center items-center gap-12 mt-6">
          <img
            src={pageInfo.logoSrc}
            alt={pageInfo.logoAlt}
            className="rounded-full w-24 h-24 object-cover"
          />
          <h1 className=" text-white lg:text-[50px] sm:text-[40px] xs:text-[30px] text-[35px] font-bold uppercase text-center">
            {pageInfo.title}
          </h1>
        </div>
        <OptionComponent />
      </div>
    </section>
  );
};

export default Home;
