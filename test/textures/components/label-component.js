export default {
    tag: 'label-component',
    cfg: {
        template() {
            return `<span><id-component number="${this.props.id}"></id-component> ${this.props.title}</span>`
        }
    }
};