import { obtenerActualTurno, obtenerCantidadBox, obtenerInformacionTurno, obtenerSiguienteTurno } from "../helpers/helpers.js";

const cardAmount = 3;
let cardStateArray = Array(cardAmount).fill("absent");

export function configureSocketIO(io) {
  io.on("connection", (socket) => {
    cardStateArray.forEach((estado, index) => {
      socket.emit(`cardState${index + 1}`, estado);
    });

    socket.on("actualizarTurnos", async () => {
      const informacionTurno = await obtenerInformacionTurno();

      io.emit("consultarTurnos", informacionTurno);
    });

    socket.on("actualizarBox", async ({ box }) => {
      const actual = await obtenerActualTurno(box);
      const siguiente = await obtenerSiguienteTurno(box);
      const boxNum = box[box.length - 1];
      const cantidad = await obtenerCantidadBox(boxNum);

      io.emit("consultarBox", [actual, siguiente, cantidad, boxNum]);
    });

    socket.on(`cardOn`, (cardId) => {
      io.emit(`cardState${cardId}`, 'present');
    });

    socket.on(`cardOff`, (cardId) => {
      io.emit(`cardState${cardId}`, 'absent');
    });
  });
}
