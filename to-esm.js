const {transform} = require("cjstoesm");

(async () => {
    //console.log(__dirname)
    await transform({
        cwd: __dirname + '//src',
        input: "**/*.*",
        outDir: "../dist/esm"
    });
})()
