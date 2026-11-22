import { useState } from "react";
import { extent, scaleLinear, scaleOrdinal, scaleSequential, scaleSqrt, schemeAccent } from "d3";
import { AxisBottom } from "./AxisBottom";
import { AxisLeft } from "./AxisLeft";
import { data } from "./data";

// GDP per capita (x-axis) and life expectancy (y-axis). 
// Each bubble represents a country, 
// with color for the continent and size for the population.


const MARGIN = { top: 30, right: 180, bottom: 50, left: 70 };
const width = 1000;
const height = 600;


export default function Bubbleplot() {
  const [hoveredBubble, setHoveredBubble] = useState(null);

  const boundsWidth = width - MARGIN.left - MARGIN.right;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;



  const xScale = scaleLinear()
    .domain([0, extent(data, item => item.gdpPercap)[1]])
    .range([0, boundsWidth]);

  const yScale = scaleLinear()
    .domain([35, extent(data, item => item.lifeExp)[1]])
    .range([boundsHeight, 0]);

  const sizeScale = scaleSqrt()
    .domain([0, extent(data, item => item.pop)[1]])
    .range([3, 65]);

  const continentScale = scaleOrdinal()
    .domain([...new Set(data.map(item => item.continent))])
    .range(schemeAccent);

  const bubbles = data.map(d => {
    const radius = sizeScale(d.pop);
    const padding = radius + 0.75;

    return {
      ...d,
      radius,
      cx: Math.max(padding, Math.min(boundsWidth - padding, xScale(d.gdpPercap))),
      cy: Math.max(padding, Math.min(boundsHeight - padding, yScale(d.lifeExp))),
    };
  });
  const topPopulationCountries = new Set(
    [...bubbles]
      .sort((a, b) => b.pop - a.pop)
      .slice(0, 5)
      .map(d => d.country),
  );
  const tooltipWidth = 230;
  const tooltipHeight = 112;
  const tooltipPosition = hoveredBubble
    ? {
        x:
          hoveredBubble.cx + hoveredBubble.radius + tooltipWidth + 8 <= boundsWidth
            ? hoveredBubble.cx + hoveredBubble.radius + 8
            : Math.max(8, hoveredBubble.cx - hoveredBubble.radius - tooltipWidth - 8),
        y: Math.max(
          8,
          Math.min(boundsHeight - tooltipHeight - 8, hoveredBubble.cy - tooltipHeight / 2),
        ),
      }
    : null;

  return (
    <svg width={width} height={height}>
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${MARGIN.left}, ${MARGIN.top})`}
        overflow={'visible'}
      >
        <rect width={boundsWidth} height={boundsHeight} fill="#fff" rx={4} />
        {bubbles.map(d => (
            <circle
              key={d.country}
              cx={d.cx}
              cy={d.cy}
              r={d.radius}
              fill={continentScale(d.continent)}
              fillOpacity={0.3}
              stroke={continentScale(d.continent)}
              strokeWidth={1.5}
              tabIndex={0}
              aria-label={`${d.country}, ${d.continent}, population ${d.pop.toLocaleString()}`}
              onMouseEnter={() => setHoveredBubble(d)}
              onMouseLeave={() => setHoveredBubble(null)}
              onFocus={() => setHoveredBubble(d)}
              onBlur={() => setHoveredBubble(null)}
            />
        ))}
        {bubbles.filter(d => topPopulationCountries.has(d.country)).map(d => {
          const labelOnLeft = d.cx > boundsWidth * 0.65;
          const labelX = d.cx + (labelOnLeft ? -1 : 1) * (d.radius + 4);

          return (
            <text
              key={d.country}
              x={labelX}
              y={d.cy + 4}
              textAnchor={labelOnLeft ? "end" : "start"}
              fontSize={11}
              fill="#222"
              stroke="#fff"
              strokeWidth={3}
              paintOrder="stroke"
              pointerEvents="none"
            >
              {d.country}
            </text>
          );
        })}
        {hoveredBubble && tooltipPosition && (
          <g transform={`translate(${tooltipPosition.x}, ${tooltipPosition.y})`} pointerEvents="none">
            <rect
              width={tooltipWidth}
              height={tooltipHeight}
              rx={5}
              fill="#fff"
              fillOpacity={0.96}
              stroke="#444"
            />
            <text x={10} y={19} fontSize={13} fontWeight="600" fill="#222">
              {hoveredBubble.country}
            </text>
            <text x={10} y={39} fontSize={12} fill="#222">
              Continent: {hoveredBubble.continent}
            </text>
            <text x={10} y={57} fontSize={12} fill="#222">
              GDP per capita: {Math.round(hoveredBubble.gdpPercap).toLocaleString()}
            </text>
            <text x={10} y={75} fontSize={12} fill="#222">
              Life expectancy: {hoveredBubble.lifeExp.toFixed(1)} years
            </text>
            <text x={10} y={93} fontSize={12} fill="#222">
              Population: {hoveredBubble.pop.toLocaleString()}
            </text>
          </g>
        )}
        <g transform={`translate(0, ${boundsHeight})`}>
          <AxisBottom
            xScale={xScale}
            boundsHeight={boundsHeight}
            pixelsPerTick={60}
            label="GDP per capita"
          />
        </g>
        <AxisLeft
          yScale={yScale}
          pixelsPerTick={40}
          boundsWidth={boundsWidth}
          label="Life expectancy"
        />
      </g>
      <g transform={`translate(${width - MARGIN.right + 20}, ${MARGIN.top})`}>
        <text fontSize={14} fontWeight="600">Continent</text>
        {continentScale.domain().map((continent, i) => (
          <g key={continent} transform={`translate(0, ${20 + i * 24})`}>
            <circle cx={6} cy={0} r={6} fill={continentScale(continent)} />
            <text x={18} y={4} fontSize={13}>{continent}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}