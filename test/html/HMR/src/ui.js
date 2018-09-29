import {component} from '../../../../'
import './cmp/hello/index'

component('app-ui', {
    module,
    props: {
        count: 634,
        buttonText: 'click',
        records: [
            {
                value: 'row 1'
            },
            {
                value: 'row 2'
            },
            {
                value: 'row 3'
            }
        ]
    },
    template() {
        return `
            <div>
                <app-hello></app-hello> ${this.props.count}
                <button onclick="this.props.count++">${this.props.buttonText}</button>
                <ul>
                ${this.each(this.props.records, item => `<li>${item.value}</li>`)}
                </ul>
            </div>
        `
    }
});