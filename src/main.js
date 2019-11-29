import App from './App.svelte';
import rawJson_P1D from './airTemperature_SN18700_2019-01-01_2019-11-29_P1D.json';
import rawJson_P1M from './airTemperature_SN18700_2019-01-01_2019-11-29_P1M.json';
// import rawJson from './airTemperature_SN59450_2018-11-29_2019-11-29.json';

const elementIds = {
  maxP1D: 'max(air_temperature P1D)',
  meanP1D: 'mean(air_temperature P1D)',
  minP1D: 'min(air_temperature P1D)',
  maxP1M: 'max(air_temperature P1M)',
  meanP1M: 'mean(air_temperature P1M)',
  minP1M: 'min(air_temperature P1M)'
};

const normalizeDatapoints = (rawJSON, suffix = 'P1D') => {
  return rawJSON.data.map(point => {
    let mean = null;
    let min = null;
    let max = null;
    point.observations.forEach(entry => {
      switch (entry.elementId) {
        case elementIds[`max${suffix}`]:
          max = {
            value: entry.value,
            unit: entry.unit
          };
          break;
        case elementIds[`mean${suffix}`]:
          mean = {
            value: entry.value,
            unit: entry.unit
          };
          break;
        case elementIds[`min${suffix}`]:
          min = {
            value: entry.value,
            unit: entry.unit
          };
          break;

        default:
          break;
      }
    });
    return {
      referenceTime: point.referenceTime,
      mean,
      min,
      max
    };
  });
};
const dataseries = {
  P1D: normalizeDatapoints(rawJson_P1D),
  P1M: normalizeDatapoints(rawJson_P1M)
};

const app = new App({
  target: document.body,
  props: {
    name: 'world',
    dataseries
  }
});

export default app;
