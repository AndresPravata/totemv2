import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { HOST, socketConnection } from "@/lib/utils";
import { Turn } from "./Box";

interface Box {
  title: string;
  boxesN: number;
  shortName: boolean;
}

const audio = new Audio("/sonido-turno.mp3");

const playNotificationSound = () => {
  audio.volume = 0.5;
  audio.currentTime = 0;
  audio.play();
};

const playTurnChangeSound = (box: string, letra: string) => {
  const turno = new Audio(`/voices/${box}/${letra}.mp3`);
  turno.volume = 0.8;
  turno.currentTime = 0;
  turno.play();
};

const Visor: React.FC<{ boxesToShow: Box[] }> = ({ boxesToShow }) => {
  const videoRef = useRef(null);
  const [turnState, setTurnState] = useState<Turn[]>([]);
  const videoPath = '/visor-video.mp4';

  const fetchData = async () => {
    try {
      const response = await axios.get(`${HOST}/turnos/turnosVisor`);
      setTurnState(response.data);
    } catch (error) {
      console.error("Error trying to update shifts", error);
    }
  };

  useEffect(() => {

    socketConnection.on("connect", () => {
      console.log("Conexión socketConnection.IO establecida con éxito");
    });

    socketConnection.on("consultarTurnos", (turnos: Turn[]) => {
      let cambioTurno = turnos
        .map(({ nombre_turno }: Turn) => {
          let turnoSplit = nombre_turno ? nombre_turno.split(" ") : [];
          let box = turnoSplit[1] || "";

          return nombre_turno === localStorage.getItem(`${box}State`) ? null : nombre_turno;
        })
        .find(turno => turno !== null) || null;

      let turnoSplit = cambioTurno ? cambioTurno.split(" ") : [];
      let letra = turnoSplit[0] || "";
      let box = turnoSplit[1] || "";

      turnos.forEach(({ nombre_turno }: Turn) => {
        let turnoSplit = nombre_turno ? nombre_turno.split(" ") : [];
        let box = turnoSplit[1] || "";

        localStorage.setItem(`${box}State`, nombre_turno ?? "null");
      });

      setTurnState(turnos);

      playNotificationSound();

      setTimeout(() => {
        playTurnChangeSound(box, letra);
      }, 2000);
    });

    socketConnection.on("disconnect", () => {
      console.log("Desconexión socketConnection.IO");
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      // @ts-ignore
      videoRef.current.volume = 0.5; // Cambia este valor según sea necesario (0.0 - 1.0)
    }

    fetchData();
  }, []);

  return (
    <div className="flex h-screen">
      <div className="w-[23%] bg-gray-800 text-white p-4 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-zinc-950 to-black text-center gap-12 flex flex-col justify-center">
        <div className="flex flex-col gap-9 ml-10">
          {boxesToShow.map((box, key) => (
            <div className="flex flex-col" key={key}>
              <h2 className="text-4xl mb-2 font-semibold uppercase z-50">
                {box.title}
              </h2>
              {Array.from({ length: box.boxesN }, (_, i) => (
                <div key={i+10} className="rounded-2xl border-2 text-4xl border-white p-6 my-2 font-bold">
                  {box.shortName ? turnState[i]?.nombre_turno?.substring(0, turnState[i].nombre_turno?.indexOf('BOX')) : turnState[i]?.nombre_turno}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="w-[80%] g-gray-800 text-white p-4 overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-900 via-zinc-950 to-black text-center">
        <video
          ref={videoRef}
          className="h-full w-screen"
          loop
          autoPlay
          controls
          src={videoPath}
        ></video>
      </div>
    </div>
  );
};

export default Visor;
