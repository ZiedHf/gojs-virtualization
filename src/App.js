import React, { useState } from "react";
import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import nodeTemplate from "./templates";

// import "./styles.css";

function handleModelChange(changes) {
  // alert('GoJS model changed!');
}

/* const createNode = (_, key) => ({
  key,
  text: `Block ${key}`,
  color: "#DBFBFB",
  location: `0 ${key}`,
}); */

// const createBlocks = (number) => Array(number).fill(0).map(createNode);
const offset = 200;

const existsInViewport = (blockLocation, docPoints) => {
  const [x, y] = blockLocation.split(" ").map((str) => +str);
  const { startX, startY } = docPoints;
  if (x < +startX - offset || y < +startY - offset) return false;
  const { endX, endY } = docPoints;
  if (x > +endX + offset || y > +endY + offset) return false;
  return true;
};

const getDocPointsFromViewport = (viewport) => ({
  startX: viewport.x,
  startY: viewport.y,
  endX: viewport.x + viewport.width,
  endY: viewport.y + viewport.height,
});

const fetchBlocks = async (docPoints) =>
  await fetch("http://localhost:8080/blocks")
    .then((data) => data.json())
    .then((blocks) => {
      const res = blocks.filter((block) =>
        existsInViewport(block.location, docPoints)
      );
      console.log("res", res);
      return res;
    });

function App() {
  const diagram = React.useRef(null);
  const [nodes, setNodes] = useState([]);
  const [viewport, setViewport] = useState(null);

  React.useEffect(() => {
    window.gojs = diagram.current;
  }, []);

  const blocksSetter = () => {
    if (!diagram.current) return;
    // const viewPort = Object.freeze();
    fetchBlocks({ ...viewport })
      .then(setNodes)
      .catch(console.error);
  };

  React.useEffect(() => {
    if (viewport) {
      blocksSetter();
    }
  }, [viewport]);

  React.useEffect(() => {
    if (!diagram.current) {
      return undefined;
    }
    const onViewportBoundsChanged = function (e) {
      const newDocPoints = getDocPointsFromViewport({
        ...e.diagram.viewportBounds,
      });
      const { startX, startY, endX, endY } = newDocPoints;
      if (viewport === null) {
        console.log("---------- Initialization ----------", newDocPoints);
        setViewport(newDocPoints);
        return;
      }
      const arr = [
        Math.abs(viewport.startX - startX),
        Math.abs(viewport.startY - startY),
        Math.abs(viewport.endX - endX),
        Math.abs(viewport.endY - endY),
      ];
      if (arr.some((v) => v > offset)) {
        console.log("arr", newDocPoints);
        setViewport(newDocPoints);
      }
    };

    diagram.current.addDiagramListener(
      "ViewportBoundsChanged",
      onViewportBoundsChanged
    );
    return () => {
      diagram.current.removeDiagramListener(
        "ViewportBoundsChanged",
        onViewportBoundsChanged
      );
    };
  }, [viewport]);

  function initDiagram() {
    const $ = go.GraphObject.make;
    diagram.current = $(go.Diagram, {
      "undoManager.isEnabled": true,
      "clickCreatingTool.archetypeNodeData": {
        text: "new node",
        color: "lightblue",
      },
      model: $(go.GraphLinksModel, {
        linkKeyProperty: "key",
      }),
    });

    diagram.current.nodeTemplate = nodeTemplate;
    diagram.current.scrollMode = go.Diagram.InfiniteScroll;

    return diagram.current;
  }

  return (
    <div>
      <ReactDiagram
        initDiagram={initDiagram}
        divClassName="diagram-component"
        nodeDataArray={nodes}
        onModelChange={handleModelChange}
        skipsDiagramUpdate={false}
      />
    </div>
  );
}

export default App;
