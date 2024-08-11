import { useEffect, useState } from "react";
import axios from "axios";
import { HOST, socketConnection } from "@/lib/utils";
import toast from "react-hot-toast";

export interface Turn {
  id: number;
  nombre_turno: string | null;
  createdAt: Date;
  fecha_hora_inicio: Date;
  fecha_hora_fin: Date;
  veterinario?: {
    nombre: string | null;
  }
  estado: string;
}

interface TurnState {
  actual: Turn | null;
  siguiente: Turn | null;
}

interface BoxProps {
  boxID: number;
  controlPanelN?: number;
  title: string;
}

const Box: React.FC<BoxProps> = ({ boxID, controlPanelN = 1, title }) => {
  const cardStateArray = Array(boxID + controlPanelN).fill(false);
  const [isPresent, setIsPresent] = useState(cardStateArray);
  const [amountState, setAmountState] = useState(0);
  const [turnState, setTurnState] = useState<TurnState>({
    actual: null,
    siguiente: null,
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(`${HOST}/turnos/turnosBox/BOX${boxID === 4 ? 'C' : boxID}`);
      const cantidad = await axios.get(`${HOST}/turnos/cantidadTurnos/${boxID}`);

      setAmountState(cantidad.data);

      setTurnState({
        actual: response.data[0],
        siguiente: response.data[1],
      });
      socketConnection?.emit("actualizarTurnos");
    } catch (error) {
      console.error("Error trying to update shifts", error);
    }
  };

  const next = async () => {
    try {
      if (turnState.actual == null) {
        await axios.put(
          `${HOST}/turnos/${turnState.siguiente == null ? 0 : turnState.siguiente.id
          }`,
          {
            estado: "Actual",
          }
        );
      } else {
        await axios.put(
          `${HOST}/turnos/${turnState.actual == null ? 0 : turnState.actual.id
          }`,
          {
            estado: "Finalizado",
          }
        );

        await axios.put(
          `${HOST}/turnos/${turnState.siguiente == null ? 0 : turnState.siguiente.id
          }`,
          {
            estado: "Actual",
          }
        );
      }

      fetchData();
    } catch (error) {
      console.error("Error trying to update shifts", error);
    }
  };

  const start = async () => {
    try {
      const response = await axios.put(
        `${HOST}/turnos/${turnState.actual == null ? 0 : turnState.actual.id
        }`,
        {
          fecha_hora_inicio: new Date(),
          estado: "Iniciado",
        }
      );
      toast.success("Turn Started");
      setTurnState({ ...turnState, actual: response.data });
    } catch (error) {
      console.error("Error trying to update shifts", error);
    }
  };

  const end = async () => {
    try {
      const response = await axios.put(
        `${HOST}/turnos/${turnState.actual == null ? 0 : turnState.actual.id
        }`,
        {
          fecha_hora_fin: new Date(),
          estado: "Finalizado",
        }
      );
      toast.success("Turn Finished");
      setTurnState({ ...turnState, actual: response.data });
    } catch (error) {
      console.error("Error trying to update shifts", error);
    }
  };

  useEffect(() => {
    if (boxID !== 4) {
      isPresent.forEach((value, key) => {
        if (key >= boxID) {
          let savedState = localStorage.getItem(`cardN${key}`);
          setIsPresent(prevState => {
            const newState = [...prevState];
            newState[key] = savedState === 'present';
            return newState;
          });
        }
      });
    }

    fetchData();
  }, []);

  useEffect(() => {
    /* if (boxID !== 4) {
      Array(controlPanelN).fill(0).forEach((value, key) => {
        socketConnection.on(`cardState${boxID + key}`, (connState) => {
          setIsPresent(prevState => {
            const newState = [...prevState];
            newState[boxID + key] = connState === 'present';
            return newState;
          });
          localStorage.setItem(`cardN${boxID + key}`, connState);
        });
      });
    } */

    socketConnection.on("consultarBox", (boxState) => {
      if (boxState[3] == boxID) {
        setTurnState({
          actual: boxState[0],
          siguiente: boxState[1],
        });
        setAmountState(boxState[2]);
      }
    });
  }, []);

  const handlePresentClick = (ProfessionalID = 0) => {
    setIsPresent(prevState => {
      const newState = [...prevState];
      newState[ProfessionalID + boxID] = true;
      return newState;
    });
    socketConnection?.emit(`cardOn`, boxID + ProfessionalID);
    localStorage.setItem(`cardN${boxID + ProfessionalID}`, "present");
  };

  const handleAbsentClick = (ProfessionalID = 0) => {
    setIsPresent(prevState => {
      const newState = [...prevState];
      newState[ProfessionalID + boxID] = false;
      return newState;
    });
    socketConnection?.emit(`cardOff`, boxID + ProfessionalID);
    localStorage.setItem(`cardN${boxID + ProfessionalID}`, "absent");
  };

  return (
    <section className="overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-zinc-950 to-black w-full flex items-center mx-auto flex-col h-screen sm:px-16 px-6">
      <div className="flex flex-col gap-20">
        <div className="flex justify-center items-center flex-col gap-5 mt-6">
          <h1 className=" text-white lg:text-[60px] sm:text-[50px] xs:text-[40px] text-[40px] font-bold uppercase text-center">
            Box {boxID}
          </h1>
          <div className=" justify-center items-center flex flex-col gap-5">
            <div className=" justify-center items-center flex gap-5">
              {Array(controlPanelN).fill(0).map((value, key) => {
                return (
                  <div key={key}>
                    {(boxID !== 4) ? <><p className=" text-white text-lg">{title + (boxID + key)}</p>
                      <div className="flex gap-6">
                        <button
                          onClick={() => handlePresentClick(key)}
                          style={{ backgroundColor: isPresent[boxID + key] ? "green" : "grey" }}
                          className="p-3 rounded-lg text-slate-950 font-medium uppercase"
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleAbsentClick(key)}
                          style={{ backgroundColor: !isPresent[boxID + key] ? "red" : "grey" }}
                          className="p-3 rounded-lg text-slate-950 font-medium uppercase"
                        >
                          Absent
                        </button>
                      </div></> : <></>}
                  </div>
                );
              })}
            </div>
            <div className="table-container rounded-lg border-2 border-white mt-5 overflow-hidden">
              <table className="text-white text-lg divide-white divide-y-2 w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-r-2 border-white font-normal">
                      Current Turn
                    </th>
                    <th className="px-4 py-2 border-r-2 border-white font-normal">
                      Next Turn
                    </th>
                    <th className="px-4 py-2 font-normal">Waiting</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-r-2 border-white text-center font-bold">
                      {turnState.actual?.nombre_turno ?? "NULL"}
                    </td>
                    <td className="px-4 py-2 border-r-2 border-white text-center font-bold">
                      {turnState.siguiente?.nombre_turno ?? "NULL"}
                    </td>
                    <td className="px-4 py-2 text-center font-bold">
                      {amountState ?? "NULL"}
                    </td>
                  </tr>
                  {(boxID !== 4) ? <tr>
                    <td className="px-4 py-2 border-r-2 border-white text-center font-bold">
                      {turnState.actual?.veterinario?.nombre ?? "NULL"}
                    </td>
                    <td className="px-4 py-2 border-r-2 border-white text-center font-bold">
                      {turnState.siguiente?.veterinario?.nombre ?? "NULL"}
                    </td>
                    <td className="px-4 py-2 text-center font-bold">
                      {amountState ?? "NULL"}
                    </td>
                  </tr> : <></>}
                </tbody>
              </table>
            </div>
            <div className="flex gap-6 mt-6">
              <button
                className="p-3 rounded-lg text-slate-950 font-medium uppercase bg-blue-500"
                onClick={() => start()}
              >
                Start Turn
              </button>
              <button
                className="p-3 rounded-lg text-slate-950 font-medium uppercase bg-yellow-300"
                onClick={() => end()}
              >
                Finish Turn
              </button>
              <button
                className="p-3 rounded-lg text-slate-950 font-medium uppercase bg-green-400"
                onClick={() => next()}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Box;
