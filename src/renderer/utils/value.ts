const generatorId = () => {
  return (Math.random() * 1000000000000).toFixed(0);
};

export { generatorId };
