import { Turno } from "../models/sequelize.js";
import { Op } from "sequelize";

export const obtenerInformacionTurno = async () => {
  try {
    const turnos = await Turno.findAll({
      where: {
        estado: "Actual",
        nombre_turno: {
          [Op.like]: "%BOX%",
        },
      },
      order: [
        ["nombre_turno", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    const venta = await Turno.findOne({
      where: {
        estado: "Actual",
        nombre_turno: {
          [Op.like]: "C%",
        },
      },
    });

    if (venta) {
      turnos.push(venta);
    }

    return turnos;

  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener la información de los turnos");
  }
};

export const obtenerTodosLosTurnosDelDia = async () => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getTime() - (1000 * 60 * 60 * 24));
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    );

    const turnosDelDia = await Turno.findAll({
      where: {
        createdAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    return turnosDelDia;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener la información de los turnos");
  }
};

export const obtenerSiguienteTurno = async (filter) => {
  try {
    const siguiente = await Turno.findOne({
      where: {
        estado: "Espera",
        nombre_turno: {
          [Op.like]: `%${filter}%`,
        },
      },
      order: [["createdAt", "ASC"]],
    });

    return siguiente;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener la información de los turnos");
  }
};

export const obtenerActualTurno = async (filter) => {
  try {
    const actual = await Turno.findOne({
      where: {
        estado: "Actual",
        nombre_turno: {
          [Op.like]: `%${filter}%`,
        },
      },
      order: [["createdAt", "ASC"]],
    });

    return actual;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener la información de los turnos");
  }
};

export const obtenerCantidadBox = async (num) => {
  try {
    const count = await Turno.count({
      where: {
        estado: "Espera",
        nombre_turno: {
          [Op.like]: `%BOX%${num}`,
        },
      },
    });

    return count;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener la información de los turnos");
  }
};
