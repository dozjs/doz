function toLiteralString(str) {
    return str
        .replace(/{{/gm, '${')
        .replace(/}}/gm, '}');
}
export default toLiteralString;
