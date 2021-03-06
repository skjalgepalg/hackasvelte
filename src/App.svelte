<script>
  import { onMount } from "svelte";
  export let dataseries; // P1D, P1M

  let yearRad = 0;
  let canvas;
  onMount(() => {
    const rad = canvas.width / 3;
    const PI2 = Math.PI * 2;
    const cx = canvas.width / 2;
    const cy = canvas.width / 2;

    const stepLengthP1D = PI2 / 365;
    const stepLengthP1M = PI2 / 12;

    const xx = (a, offset, rad) => cx + (rad + offset * 2) * Math.cos(a);
    const yy = (a, offset, rad) => cy + (rad + offset * 2) * Math.sin(a);

    const getStepInfo = (step, stepLength, i, arr, arrKey, radius) => {
      const t = (i - 1) * stepLength;
      const t2 = i * stepLength;
      const offset = i === 0 ? 0 : arr[i - 1][arrKey].value;
      const offset2 = step[arrKey].value;
      const x0 = xx(t, offset, radius);
      const y0 = yy(t, offset, radius);
      const x1 = xx((t + t2) / 2, offset, radius);
      const y1 = yy((t + t2) / 2, offset, radius);
      const x2 = xx(t2, offset2, radius);
      const y2 = yy(t2, offset2, radius);

      const cpX = 2 * x1 - x0 / 2 - x2 / 2;
      const cpY = 2 * y1 - y0 / 2 - y2 / 2;

      return { cpX, cpY, x2, y2, x0, y0, offset, offset2, radius };
    };

    const generateStepCoords = (dataseries, stepLength, radius, dataKey) => {
      const maxSeries = [];
      const meanSeries = [];
      const minSeries = [];

      dataseries[dataKey].forEach((step, i, arr) => {
        maxSeries.push(getStepInfo(step, stepLength, i, arr, "max", radius));
        meanSeries.push(getStepInfo(step, stepLength, i, arr, "mean", radius));
        minSeries.push(getStepInfo(step, stepLength, i, arr, "min", radius));
      });

      return {
        maxSeries,
        meanSeries,
        minSeries
      };
    };

    const drawSeries = (ctx, series, extremes) => {
      const isNegativeMin = extremes.min < 0;
      const colorScale = isNegativeMin ? extremes.max + Math.abs(extremes.min) : extremes.max - extremes.min;
      series.forEach(
        ({ cpX, cpY, x2, y2, x0, y0, offset, offset2, radius }, i) => {
          const relativeColor = (offset2 + Math.abs(extremes.min) * 255/colorScale);
          ctx.strokeStyle = `rgb(${relativeColor}, 78, 243)`;
          ctx.beginPath();
          ctx.lineWidth = 1;
          i === 0 ? ctx.moveTo(x2, y2) : ctx.moveTo(x0, y0);
          ctx.quadraticCurveTo(cpX, cpY, x2, y2);
          ctx.stroke();
          ctx.closePath();
        }
      );
    };

    // Prepare canvas
    const ctx = canvas.getContext("2d");
    ctx.translate(cx, cy);
    ctx.rotate((-90 * Math.PI) / 180);
    ctx.translate(-cx, -cy);

    // Draw start-line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + rad, cy);
    ctx.stroke();
    ctx.closePath();

    // Draw neutral circles representing 0 degrees
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2, true);
    // ctx.arc(cx, cy, 200, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.closePath();

    // Draw daily series
    const seriesP1D = generateStepCoords(
      dataseries.P1D,
      stepLengthP1D,
      rad,
      "seriesP1D"
    );
    Object.values(seriesP1D).forEach(val => {
      drawSeries(ctx, val, dataseries.P1D.extremes);
    });

    // Draw monthly series
    // ctx.lineTo(cx, cy);
    // const seriesP1M = generateStepCoords(
    //   dataseries.P1M,
    //   stepLengthP1M,
    //   200,
    //   "seriesP1M"
    // );
    // console.log(dataseries);
    // Object.values(seriesP1M).forEach(val => {
    //   drawSeries(ctx, val, dataseries.P1M.extremes);
    // });
  });
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>
  <h1>Årshjul</h1>
  <p>
    Viser lufttemperatur målt på Blindern
    <br />
    Data fra
    <a href="https://frost.met.no" rel="noopener" target="_blank">
      frost.met.no
    </a>
  </p>
  <div>
    <label for="start">Slider for årstilpasning</label>
    <input
      name="start"
      type="range"
      min={0}
      max={360}
      step={1}
      bind:value={yearRad} />
  </div>
  <canvas
    style={`transform: rotate(${yearRad}deg)`}
    bind:this={canvas}
    width="1000"
    height="1000" />
</main>
