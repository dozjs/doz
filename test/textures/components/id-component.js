module.exports = {
    tag: 'id-component',
    cfg: {
        template() {
            return `<span>${this.props.number}</span>`
        }
    }
};