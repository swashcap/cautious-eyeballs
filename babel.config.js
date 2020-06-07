/**
 * Add `.js` extension import paths so project works with ES Modules.
 * {@link https://github.com/microsoft/TypeScript/issues/16577}
 * {@link https://github.com/karlprieb/babel-plugin-add-import-extension}
 */
export default {
  plugins: ['babel-plugin-add-import-extension']
}
