import * as go from "gojs";

const $ = go.GraphObject.make;

const nodeTemplate = $(
  go.Part,
  go.Panel.Spot,
  {
    background: "green",
  },
  $(go.Shape, "Rectangle", {
    desiredSize: new go.Size(50, 50),
    fill: "transparent",
    stroke: "transparent",
    alignment: new go.Spot(0.5, 1),
    alignmentFocus: new go.Spot(0.5, 1),
    stretch: go.GraphObject.None,
  }),
  $(
    go.TextBlock,
    { stroke: "white", font: `20px sans-serif` },
    new go.Binding("text")
  ),
  new go.Binding("location", "location", go.Point.parse)
);

export default nodeTemplate;
