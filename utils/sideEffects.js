export const runSideEffect = (label, sideEffect) => {
  Promise.resolve()
    .then(sideEffect)
    .catch((error) => {
      console.error(`${label} failed:`, error.message);
    });
};
