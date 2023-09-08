const globalStoreObjectName = 'DOZ_STORES';
export default (function (Doz, app) {
    app.on('componentPropsInit', component => {
        let dozStores = window[globalStoreObjectName];
        // if (dozStores && component.store && dozStores[component.store]) {
        //     component.props = dozStores[component.store];
        // }
        //console.log('component.uId', component.uId)
        if (dozStores && component.uId && dozStores[component.uId]) {
            component.props = dozStores[component.uId];
        }
    });
});
