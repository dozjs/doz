function detectInheritance(proto, _class) {
    console.log('controllo', proto.constructor.name);
    if (!proto)
        return false;

    if (proto.constructor !== _class) {
        return detectInheritance(proto.__proto__, _class);
    } else {
        console.log('ok trovato', proto.constructor.name);
        return true;
    }
}

module.exports = detectInheritance;