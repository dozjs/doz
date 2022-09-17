function queue(p, arrayOfP) {
    if (!p)
        return;
    new Promise(p).then(() => queue(arrayOfP.shift(), arrayOfP));
}
export default queue;
