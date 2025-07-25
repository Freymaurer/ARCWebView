export const dirname = (filePath) => {
  return new Error('path.dirname is mocked for Storybook.');
};

export const join = (...paths) => {
  return new Error('path.join is mocked for Storybook.');
};

export default {
  dirname,
  join,
};
