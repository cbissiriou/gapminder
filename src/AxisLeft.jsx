// AxisLeft.jsx

// tick length
const TICK_LENGTH = 6;

export const AxisLeft = ({ yScale, pixelsPerTick = 40, boundsWidth = 0, label }) => {
    const range = yScale.range();
    const height = range[0] - range[1];
    const numberOfTicksTarget = Math.floor(height / pixelsPerTick);

    return (
    <>
    {/* Main vertical line */}
    <path
        d={['M', 0, range[0], 'L', 0, range[1]].join(' ')}
        fill="none"
        stroke="currentColor"
    />

    {/* Ticks and labels */}
    {yScale.ticks(numberOfTicksTarget).map((value, i) => (
        <g key={value} transform={`translate(0, ${yScale(value)})`}>
            {/* Grid line */}
            {/* <line x1={0} x2={boundsWidth} stroke="currentColor" opacity={0.1}/> */}
            {/* Tick */}
            <line x2={-TICK_LENGTH} stroke="currentColor" />
            <text
                style={{
                fontSize: '10px',
                textAnchor: 'middle',
                transform: 'translateX(-20px)',
                }}
            >
            {value}
          </text>
        </g>
    ))}
    {/* Axis title — rotated 90° */}
    {label && (
        <text
            x={-height / 2}
            y={-45}
            fontSize={12}
            textAnchor="middle"
            transform="rotate(-90)"
        >
            {label}
        </text>

    )}
    </>
    );
};



// const TICK_LENGTH = 6;

// export const AxisBottom = ({ xScale }) => {
//   const range = xScale.range();
//   const ticks = xScale.ticks(25);

//   return (
//     <>
//       <line
//         x1={range[0]} y1={0} x2={range[1]} y2={0}
//         stroke="currentColor" fill="none"
//       />
//       {ticks.map((value) => {
//         const isRound = value % 10 === 0;

//         return (
//           <g
//             key={value}
//             transform={`translate(${xScale(value)}, 0)`}
//             opacity={isRound ? 1 : 0.3}
//           >
//             <line y2={TICK_LENGTH} stroke="currentColor" />
//             <text
//               style={{
//                 fontSize: "10px",
//                 textAnchor: "middle",
//                 transform: "translateY(20px)",
//               }}
//             >
//               {value}
//             </text>
//           </g>
//         );
//       })}
//     </>
//   );
// };