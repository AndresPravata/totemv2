import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg.jpg";

const routes = ['Ventas', 'Veterinarios'];

const Totem = () => {
  const navigate = useNavigate();

  const generalHandler = (route: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    navigate(`/${route}`);
  };

  const pageInfo = {
    title: "Veterinaria Dr.Luffi",
    logoSrc: "logo.svg",
    logoAlt: "logo",
  }

  return (
    <section
      className="overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-zinc-950 to-black w-full flex items-center mx-auto flex-col h-screen sm:px-16 px-6"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="flex flex-col gap-20 mt-14">
        <div className="flex justify-center items-center flex-col gap-12 mt-6">
          <img
            src={pageInfo.logoSrc}
            alt={pageInfo.logoAlt}
            className="rounded-full w-60 h-60 object-cover"
          />
          <h1
            className=" text-white lg:text-[50px] sm:text-[45px] xs:text-[35px] text-[55px] font-bold uppercase text-center"
            style={{ WebkitTextStroke: "2px black" }}
          >
            {pageInfo.title}
          </h1>
        </div>

        <div className="flex items-center justify-center gap-10 flex-col xs:flex-row">
          {routes.map((route) => {
            return (
              <div className="grid gap-8 items-start justify-center">
                <div className="h-full w-full bg-gray-500 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 border border-gray-100">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-600 to-sky-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-500 group-hover:duration-500  animate-tilt"></div>
                    <Button
                      className="relative px-7 py-4 bg-transparent rounded-lg leading-none flex items-center divide-x divide-gray-600 text-2xl uppercase w-52 h-15 hover:bg-black"
                      size={"sm"}
                      onMouseDown={generalHandler(route)}
                      onClick={generalHandler(route)}
                    >
                      {route}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Totem;