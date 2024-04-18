import React from "react";

type Props = {
  id: number;
  name: string;
};

const RenderArea = (props: Props) => {
  return (
    <li>
      <label>
        <label>
          <input type="checkbox" />
          <span>{props.name}</span>
        </label>
      </label>
    </li>
  );
};

export default RenderArea;
