import App from './App.svelte';
import { data } from './airTemperature_SN18700_2019-01-01_2019-11-29_P1D.json';
// import rawJson from './airTemperature_SN59450_2018-11-29_2019-11-29.json';

const elementIds = {
  maxP1D: 'max(air_temperature P1D)',
  meanP1D: 'mean(air_temperature P1D)',
  minP1D: 'min(air_temperature P1D)'
};

const getObservations = (point, suffix = 'P1D') => {
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
    max,
    mean,
    min
  };
};

const getAvg = (nums, key) => ({
  value: nums.reduce((a, b) => a + b[key].value, 0) / nums.length,
  unit: nums[0][key].unit
});
const getMax = (nums, key) => ({
  value: nums.reduce((a, b) => Math.max(a, b[key].value), nums[0][key].value),
  unit: nums[0][key].unit
});
const getMin = (nums, key) => ({
  value: nums.reduce((a, b) => Math.min(a, b[key].value), nums[0][key].value),
  unit: nums[0][key].unit
});

const getDataseries = data => {
  const seriesP1D = [];
  const seriesP1M = [];
  const extremes = {
    minP1D: null,
    minP1M: null,
    maxP1D: null,
    maxP1M: null
  };
  let monthBucket = [];
  let curMonth = null;
  let prevMonth = 0;

  for (let i = 0; i < data.length; i += 1) {
    let pointObs = getObservations(data[i]);
    seriesP1D.push(pointObs);
    extremes.minP1D =
      i === 0
        ? pointObs.min.value
        : Math.min(pointObs.min.value, extremes.minP1D);
    extremes.maxP1D =
      i === 0
        ? pointObs.max.value
        : Math.max(pointObs.max.value, extremes.maxP1D);

    monthBucket.push(pointObs);
    // Calculate month values on new month or end of data
    curMonth = new Date(data[i].referenceTime).getUTCMonth();
    if (curMonth > prevMonth || i === data.length - 1) {
      prevMonth = curMonth;
      seriesP1M.push({
        max: getMax(monthBucket, 'max'),
        mean: getAvg(monthBucket, 'mean'),
        min: getMin(monthBucket, 'min')
      });

      extremes.minP1M =
        i === 0
          ? pointObs.min.value
          : Math.min(pointObs.min.value, extremes.minP1M);
      extremes.maxP1M =
        i === 0
          ? pointObs.max.value
          : Math.max(pointObs.max.value, extremes.maxP1M);
      monthBucket = [];
    }
  }

  return {
    P1D: {
      extremes: {
        min: extremes.minP1D,
        max: extremes.maxP1D
      },
      seriesP1D
    },
    P1M: {
      extremes: {
        min: extremes.minP1M,
        max: extremes.maxP1M
      },
      seriesP1M
    }
  };
};

const dataseries = getDataseries(data);

const app = new App({
  target: document.body,
  props: {
    dataseries
  }
});

export default app;
