import delay from"../../utils/delay.js";function propsListener(e,t){if("object"==typeof e.propsListener)for(let o=0;o<t.length;o++){const n=t[o],p=e.propsListener[n.currentPath];if("update"===n.type&&p){const t=e[p]||p;"function"==typeof t&&t.call(e,n.newValue,n.previousValue)}}if("object"==typeof e.propsListenerAsync)for(let o=0;o<t.length;o++){const n=t[o],p=e.propsListenerAsync[n.currentPath];if("update"===n.type&&p){const t=e[p]||p;"function"==typeof t&&function(o){delay((()=>t.call(e,o.newValue,o.previousValue)))}(n)}}}export default propsListener;