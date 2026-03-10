export type IGlobalStore = {
  readonly rootStore: object;
  init?: (...args: never[]) => Promise<boolean>;
  destroy: VoidFunction;
};
