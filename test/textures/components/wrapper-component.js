module.exports = {
    tag: 'wrapper-component',
    cfg: {
        template() {
            return `
                <div>
                    <span>hello I'm <label-component id="${this.props.id}" title="${this.props.title}"></label-component> ${this.props.name} component </span>
                </div>`
        },
        onCreate() {
            console.log('onCreate')
        }
    }
};