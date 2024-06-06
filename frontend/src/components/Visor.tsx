import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { Turno } from "./Box1";
import { HOST, SOCKET } from "@/lib/utils";
import { io } from "socket.io-client";

interface TurnoState {
  Box1: Turno | null;
  Box2: Turno | null;
  Ventas: Turno | null;
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

const Visor = () => {
  const videoRef = useRef(null);
  const [turnoState, setTurnoState] = useState<TurnoState>({
    Box1: null,
    Box2: null,
    Ventas: null,
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(`${HOST}/turnos/turnosVisor`);
      setTurnoState(response.data);
    } catch (error) {
      console.error("Error al obtener los turnos", error);
    }
  };

  useEffect(() => {
    const socket = io(`${SOCKET}`);

    socket.on("connect", () => {
      console.log("Conexión Socket.IO establecida con éxito");
    });

    socket.on("consultarTurnos", (turno) => {
      console.log("turnos recibidos correctamente");

      let turnoBox1 = turno?.Box1?.nombre_turno == localStorage.getItem("BOX1State") ? null : turno?.Box1?.nombre_turno;
      let turnoBox2 = turno?.Box2?.nombre_turno == localStorage.getItem("BOX2State") ? null : turno?.Box2?.nombre_turno;
      let turnoBoxVentas = turno?.Ventas?.nombre_turno == localStorage.getItem("VentasState") ? null : turno?.Ventas?.nombre_turno

      let cambioTurno = turnoBox1;
      cambioTurno = (cambioTurno == null) ? turnoBox2 : cambioTurno;
      cambioTurno = (cambioTurno == null) ? turnoBoxVentas : cambioTurno;

      let turnoSplit = cambioTurno ? cambioTurno.split(" ") : null;
      let box = turnoSplit ? turnoSplit[1] : "";
      let letra = turnoSplit ? turnoSplit[0] : "";

      localStorage.setItem("BOX1State", turno?.Box1?.nombre_turno);
      localStorage.setItem("BOX2State", turno?.Box2?.nombre_turno);
      localStorage.setItem("VentasState", turno?.Ventas?.nombre_turno);

      setTurnoState(turno);

      playNotificationSound();

      setTimeout(() => {
        playTurnChangeSound(box, letra);
      }, 2000);
    });

    socket.on("disconnect", () => {
      console.log("Desconexión Socket.IO");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.5; // Cambia este valor según sea necesario (0.0 - 1.0)
    }

    fetchData();
  }, []);

  return (
    <div className="flex h-screen">
      <div className="w-[23%] bg-gray-800 text-white p-4 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-zinc-950 to-black text-center gap-12 flex flex-col justify-center">
        <div className="flex flex-col gap-9 ml-10">
          <div className="flex flex-col">
            <h2 className="text-4xl mb-2 font-semibold uppercase z-50">
              Veterinaria
            </h2>
            <div className="rounded-2xl border-2 text-4xl border-white p-6 my-2 font-bold">
              {/* GET del turno al que da inicio el veterinario 1 */}
              {turnoState.Box1?.nombre_turno ?? ""}
            </div>
            <div className="rounded-2xl border-2 text-4xl border-white p-6 my-2 font-bold">
              {turnoState.Box2?.nombre_turno ?? ""}
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-4xl mb-2 font-semibold uppercase">Ventas</h2>
            <div className="rounded-2xl border-2 text-4xl border-white p-6 my-2 font-bold">
              {turnoState.Ventas?.nombre_turno?.substring(0, turnoState.Ventas?.nombre_turno?.indexOf("BOX")) ?? ""}
            </div>
          </div>
        </div>

        {/* <div className="flex flex-col">
          <h2 className="text-4xl mb-2 font-semibold uppercase">Peluquería</h2>
          <div className="rounded-2xl border-2 text-3xl border-white p-2 my-2">
            P1 10:30
          </div>
        </div> */}
      </div>
      <div className="w-[80%] g-gray-800 text-white p-4 overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-900 via-zinc-950 to-black text-center">
        <video
          ref={videoRef}
          className="h-full w-screen"
          loop
          autoPlay
          controls
          src="/visor-video.mp4"
        ></video>
      </div>
    </div>
  );
};

export default Visor;
