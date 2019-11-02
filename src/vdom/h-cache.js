module.exports = {
    data: new Map(),
    get(strings, values) {
        //this.data.get({strings, values})
        console.log('GET',this.data.get({strings, values}));
    },
    set(strings, values, compiled) {
        console.log(
        this.data.set({strings, values}, compiled));
    }
};