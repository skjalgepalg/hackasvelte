<script>
  import { onMount } from "svelte";
  export let name;
  export let dataseries; // P1D, P1M

  let canvas;
  onMount(() => {
    const rad = canvas.width / 3;
    const PI2 = Math.PI * 2;
    const cx = canvas.width / 2;
    const cy = canvas.width / 2;
    const sideCount = dataseries.P1D.length;
    const stepLength = PI2 / 365;
    // const stepLength = PI2 / sideCount;
    const xx = (a, offset) => cx + (rad + offset) * Math.cos(a);
    const yy = (a, offset) => cy + (rad + offset) * Math.sin(a);

    const ctx = canvas.getContext("2d");
    ctx.translate(cx, cy);
    ctx.rotate(-90 * Math.PI / 180);
    ctx.translate(-cx, -cy);
    // Draw line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + rad, cy);
    ctx.stroke();
    ctx.closePath();
    // 0 grader
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.closePath();

    dataseries.P1D.forEach((step, i, arr) => {
      const t = (i - 1) * stepLength;
      const t2 = i * stepLength;
      const offset =
        i === 0 ? 0 : arr[i - 1].mean.value;
      const offset2 = step.mean.value;
      const x0 = xx(t, offset);
      const y0 = yy(t, offset);
      const x1 = xx((t + t2) / 2, offset);
      const y1 = yy((t + t2) / 2, offset);
      const x2 = xx(t2, offset2);
      const y2 = yy(t2, offset2);

      const cpX = 2 * x1 - x0 / 2 - x2 / 2;
      const cpY = 2 * y1 - y0 / 2 - y2 / 2;
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo(cpX, cpY, x2, y2);
      ctx.strokeStyle = "hotpink";
      ctx.stroke();
      ctx.closePath();
    });
    dataseries.P1D.forEach((step, i, arr) => {
      const t = (i - 1) * stepLength;
      const t2 = i * stepLength;
      const offset =
        i === 0 ? 0 : arr[i - 1].min.value;
      const offset2 = step.min.value;
      const x0 = xx(t, offset);
      const y0 = yy(t, offset);
      const x1 = xx((t + t2) / 2, offset);
      const y1 = yy((t + t2) / 2, offset);
      const x2 = xx(t2, offset2);
      const y2 = yy(t2, offset2);

      const cpX = 2 * x1 - x0 / 2 - x2 / 2;
      const cpY = 2 * y1 - y0 / 2 - y2 / 2;
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo(cpX, cpY, x2, y2);
      ctx.strokeStyle = "blue";
      ctx.stroke();
      ctx.closePath();
    });
    dataseries.P1D.forEach((step, i, arr) => {
      const t = (i - 1) * stepLength;
      const t2 = i * stepLength;
      const offset =
        i === 0 ? 0 : arr[i - 1].max.value;
      const offset2 = step.max.value;
      const x0 = xx(t, offset);
      const y0 = yy(t, offset);
      const x1 = xx((t + t2) / 2, offset);
      const y1 = yy((t + t2) / 2, offset);
      const x2 = xx(t2, offset2);
      const y2 = yy(t2, offset2);

      const cpX = 2 * x1 - x0 / 2 - x2 / 2;
      const cpY = 2 * y1 - y0 / 2 - y2 / 2;
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo(cpX, cpY, x2, y2);
      ctx.strokeStyle = "red";
      ctx.stroke();
      ctx.closePath();
    });
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
  <h1>Hello {name}!</h1>
  <p>
    Visit the
    <a href="https://svelte.dev/tutorial">Svelte tutorial</a>
    to learn how to build Svelte apps.
  </p>
  <canvas bind:this={canvas} width="1000" height="1000" />
</main>
