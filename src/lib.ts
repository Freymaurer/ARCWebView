declare global {
  interface Window {
    arcwebview: {
      getROCJson: () => Promise<string>;
    };
  }
}

export {default as WebViewer} from './App';