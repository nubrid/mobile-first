/*
AppManager
*/
export { default as App } from "./App";
export * from "./ui";

export const url = !!__URL__ // eslint-disable-line no-extra-boolean-cast
  ? __URL__
  : `${document.location.protocol}//${document.location.host}`;
