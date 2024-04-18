import React from "react";
import "./App.css";
import RenderArea from "./componants/RenderArea";


const areas = [
  { id: 1, name: "北海道" },
  { id: 2, name: "青森" },
  { id: 3, name: "秋田" },
  { id: 4, name: "岩手" },
  { id: 5, name: "山形" },
];

function App() {
  const renderAreas = areas.map((area) => {
    return <RenderArea key={area.id} id={area.id} name={area.name} />;
  });

  return (
    <>

      <main>
        <div className="container">
          <h2>都道府県</h2>
          <ul id="area-list">{renderAreas}</ul>
        </div>
      </main>
    </>
  );
}

export default App;
