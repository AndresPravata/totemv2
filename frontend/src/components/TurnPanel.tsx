import { useNavigate } from "react-router";
import NavBar from "./NavBar";
import { useState, useEffect } from "react";
import {
  useStateProvider
} from "../hooks/useStateProvider";
import axios from "axios";
import { HOST, socketConnection } from "@/lib/utils";
import bgImage from "../assets/bg.jpg";

interface cardSelectedState {
  card: number | null;
  box: number | null;
}

interface DataBoxType {
  ProfessionalID: number;
  box: number;
  img: string;
  alt: string,
}

interface TurnPanelProps {
  dataBoxArray: DataBoxType[];
  numBoxes: number;
  showSalesCard: boolean;
  title: string;
}

const TurnPanel: React.FC<TurnPanelProps> = ({ dataBoxArray, numBoxes, showSalesCard, title }) => {
  const navigate = useNavigate();
  const stateProvider = useStateProvider();

  const [cardSelected, setCardSelected] =
    useState<cardSelectedState>({ card: null, box: null });

  const [amountState, setAmountState] = useState<number[]>([]);

  const postData = async (id: number, box: number, nombre_turno: string) => {
    try {
      if (
        localStorage.getItem(`turnAmountBox${box}`)
      ) {
        await axios.post(`${HOST}/turnos/`, {
          nombre_turno: nombre_turno,
          numero_box: box,
          veterinario_id: box === 4 ? null : id,
          estado: "Actual",
        });
      } else {
        await axios.post(`${HOST}/turnos/`, {
          nombre_turno: nombre_turno,
          numero_box: box,
          veterinario_id: box === 4 ? null : id,
        });
      }
    } catch (error) {
      console.error("Error al obtener los turnos", error);
    }
  };

  const fetchData = async () => {
    try {
      let amounts = [];

      const responses = await Promise.all(
        Array.from({ length: numBoxes }, (_, i) => (i >= 3 ? i + 2 : i + 1))
          .map((boxN) =>
            axios.get(`${HOST}/turnos/cantidadTurnos/${boxN}`)
          )
      );

      amounts = responses.map(response => response.data);
      console.log(amounts);

      if (showSalesCard) {
        const salesAmount = await axios.get(`${HOST}/turnos/cantidadTurnos/4`);

        amounts.push(salesAmount.data);
      }

      setAmountState(amounts);
    } catch (error) {
      console.error("Error al obtener los turnos", error);
    }
  };

  useEffect(() => {
    if (new Date().getHours() === 7) {
      localStorage.clear();
    }

    fetchData();
  }, []);

  const handleVeterinario = (ProfessionalID: number, boxN: number) => {

    if (cardSelected.card === ProfessionalID) {
      setCardSelected({ card: null, box: null });
      localStorage.removeItem("card");
    }

    else {
      setCardSelected({ card: ProfessionalID, box: boxN });
      localStorage.setItem("card", `${ProfessionalID}`);
    }

    setTimeout(() => {
      handleImprimirTurno(ProfessionalID, boxN);
    }, 1);
  };

  const handleImprimirTurno = async (ProfessionalID: number, boxN: number) => {

    if (localStorage.getItem(`turnAmountBox${boxN}`) == "50") {
      localStorage.removeItem(`turnAmountBox${boxN}`);
    }

    localStorage.setItem(
      `turnAmountBox${boxN}`,
      String(
        Number(
          localStorage.getItem(`turnAmountBox${boxN}`) ?? "0"
        ) + 1
      )
    );

    const letters = "ABDEFGHIJKLMNOPQRSTUVWXYZ";
    const letra = boxN === 4 ? "C" : (letters[ProfessionalID - 1] ?? "Z");

    await postData(
      ProfessionalID ?? 0,
      boxN ?? 0,
      `${letra}${localStorage.getItem(`turnAmountBox${boxN}`) ?? "0"} BOX${boxN}`
    );

    const box = `BOX${boxN}`;
    socketConnection.emit("actualizarBox", { box });
    socketConnection.emit("actualizarTurnos");

    navigate("/totem");
  };

  const DataShowBox = (ProfessionalID: number, box: number, img: string, alt: string) => {
    return (
      <div key={ProfessionalID} className="grid gap-3 items-start justify-center">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-600 to-sky-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-500 group-hover:duration-500  animate-tilt"></div>
          <img
            src={img}
            alt={alt}
            onMouseDown={() => (box === 4 && ProfessionalID === 0) ? handleImprimirTurno(ProfessionalID, box) : handleVeterinario(ProfessionalID, box)}
            className={`rounded-lg relative bg-black leading-none flex items-center divide-x divide-gray-600 uppercase px-0 xs:w-[30rem] h-[17rem] transition-all ease-in-out duration-500 cursor-pointer ${stateProvider[`card${ProfessionalID}`] === "absent" && ProfessionalID !== 0
              ? "grayscale pointer-events-none"
              : ""
              }`}
            style={
              cardSelected.card === ProfessionalID
                ? {
                  border: "5px solid white",
                  height: "19rem",
                  width: "32rem",
                }
                : { border: "none" }
            }
          />

          {stateProvider[`card${ProfessionalID}`] === "absent" && ProfessionalID !== 0 && (
            <div className="absolute inset-0 flex p-4 justify-end">
              <span
                className="text-red-600 text-4xl font-bold"
                style={{ WebkitTextStroke: "1.5px black" }}
              >
                ABSENT
              </span>
            </div>
          )}

        </div>

        <p
          className=" uppercase font-bold text-2xl text-white"
          style={{ WebkitTextStroke: "1.5px black" }}
        >
          Waiting Turns: {(box === 4 && ProfessionalID === 0) ? amountState[amountState.length - 1] : amountState[box - 1]}
        </p>
      </div>
    )
  }

  return (
    <section
      className=" bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-zinc-950 to-black w-full flex items-center mx-auto flex-col min-h-[100vh]"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <article className=" w-full min-h-[100vh] mt-5">
        <NavBar />
        <div className="flex flex-col gap-20 mt-8">
          <div className="flex items-center justify-center gap-6 flex-col">
            {title != "" ? <>
              <h1
                className=" uppercase font-bold text-2xl text-white"
                style={{ WebkitTextStroke: "1.5px black" }}
              >
                {title}
              </h1>
            </> : <></>}

            {dataBoxArray.map((data) => DataShowBox(data.ProfessionalID, data.box, data.img, data.alt))}

          </div>
        </div>
      </article>
    </section>
  );
};

export default TurnPanel;