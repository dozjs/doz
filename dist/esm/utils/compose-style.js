import toInlineStyle from"./to-inline-style.js";function composeStyle(e,t){let l="";return Object.keys(e).forEach((o=>{if(/^@media/.test(o))l+=`${o} {${composeStyle(e[o],t)}}`;else{let n=toInlineStyle(e[o],!1);o=`${t} ${o.replace(/(,)/g,`$1${t} `)}`,l+=`${o}{${n}} `}})),l}export default composeStyle;