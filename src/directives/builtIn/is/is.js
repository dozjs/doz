import index from "../../index.js";
import dashToCamel from "../../../utils/dashToCamel.js";
import doCreateInstance from "../../../component/doCreateInstance.js";
const { directive } = index;
export default (function () {
    directive('is', {
        hasDataIs($target) {
            //console.log($target._dozAttach.props && $target._dozAttach.props['d-is'])
            return $target._dozAttach.props && $target._dozAttach.props['d-is'];
            //return $target.dataset && /**/$target.dataset.is;
        },
        onAppComponentAssignName(instance, $target) {
            //console.log('onAppComponentAssignName',$target)
            if (this.hasDataIs($target)) {
                return $target._dozAttach.props['d-is'];/**/
                //return $target.dataset.is;/**/
            }
        },
        onAppComponentPropsAssignName($target, propsName, isDirective) {
            //console.log('onAppComponentPropsAssignName',$target)
            if (this.hasDataIs($target))
                return dashToCamel(propsName);/**/
            /*else
                return propsName;*/
        },
        onComponentDOMElementCreate(instance, $target, directiveValue, initial) {
            $target.dataset.is = directiveValue;
            //if (!initial) {
                //instance._processing.push({node: $target, action: 'create'});
                doCreateInstance(instance, $target)
            //}
        },
    });
});
