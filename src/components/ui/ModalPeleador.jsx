import React from "react";

const HoverCardPeleador = ({ peleador, visible, position = { top: 0, left: 0 } }) => {
  if (!peleador || !visible) return null;
  return (
    <div
      className="fixed z-50 bg-gray-900 rounded-lg shadow-lg p-4 w-72 border-2 border-red-500"
      style={{ top: position.top, left: position.left, transition: 'opacity 0.2s', pointerEvents: 'none' }}
    >
      <div className="flex flex-col items-center">
        <img src={peleador.avatar || peleador.foto} alt={peleador.nombre} className="w-24 h-24 rounded-full object-cover border-4 border-red-500 mb-2" />
        <h2 className="text-xl font-bold mb-1 text-yellow-400 text-center">{peleador.nombre}</h2>
        <p className="mb-1 text-center"><b>División:</b> {peleador.division}</p>
        <p className="mb-1 text-center"><b>País:</b> {peleador.pais}</p>
        <p className="mb-1 text-center"><b>Récord:</b> {peleador.record}</p>
        <p className="mb-1 text-center"><b>Status:</b> {peleador.status}</p>
        <p className="mt-2 text-sm text-gray-300 italic text-center">{peleador.descripcion}</p>
      </div>
    </div>
  );
};

export default HoverCardPeleador; 