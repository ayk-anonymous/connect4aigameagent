import React from "react";

const TurnLabel: React.FC<{ turn: number }> = ({ turn }) => {
  const labelStyle: React.CSSProperties = {
    marginBottom: "12px",
    fontSize: "2rem",
    fontWeight: "bold",
    color: turn === 0 ? "#e63946" : "#ffca3a",
    textAlign: "center",
  };

  return (
    <div style={labelStyle}>
      {turn === 0 ? "Your Turn" : "AI's Turn"}
    </div>
  );
};

export default TurnLabel;
