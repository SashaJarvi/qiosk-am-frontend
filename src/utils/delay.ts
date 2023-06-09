const delay = (ms = 1000): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export default delay;
