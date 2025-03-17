import 'reflect-metadata';

export default () => Promise.resolve({
  isGlobal: true,
  load: ['config'],
  expandVariables: true
});