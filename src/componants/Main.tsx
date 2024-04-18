import React from "react";
import "../css/main.css";
import ReanderAllPref from "./ReanderAllPref";

const Main = () => {
  return (
    <main>
      <section>
        <div className="container">
          <h2>都道府県</h2>
          <ReanderAllPref />
        </div>
      </section>
      <section className="container"></section>
    </main>
  );
};

export default Main;
