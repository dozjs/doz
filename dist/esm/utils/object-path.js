function getByPath(t,e){return t.split(".").reduce(((t,e)=>t?t[e]:void 0),e)}function getLast(t,e){return-1!==t.indexOf(".")&&((t=t.split(".")).pop(),t=t.join(".")),getByPath(t,e)}export default getByPath;export{getLast};