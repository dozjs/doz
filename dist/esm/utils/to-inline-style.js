import camelToDash from"./camel-to-dash.js";function toInlineStyle(e,t=!0){return e=Object.entries(e).reduce(((e,[t,l])=>`${e}${camelToDash(t)}:${l};`),""),t?`style="${e}"`:e}export default toInlineStyle;