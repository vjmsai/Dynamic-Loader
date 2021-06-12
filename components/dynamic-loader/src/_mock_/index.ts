import { DynamicElementLoaderProps } from '../dynamic-loader';

export const DefaultProps: DynamicElementLoaderProps = {
  async: false,
  defer: true,
  hideElement: false,
  showScript: false,
  moduleUrl: 'http://lorem.esmodule.js',
  url: 'http://lorem.es5.js',
  props: '{"label": "Welcome User"}',
  tag: 'component-tags',
  events: 'submitted, searchQuery',
};
