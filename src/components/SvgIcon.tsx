import {createSignal} from "solid-js";

const SvgIcon = (props: {icon: string}) => {
    const menuFold = "M7 16V8l-4 4zm4-9h10v2H11zm0 4h10v2H11zm0 4h10v2H11zm-8 4h18v2H3zM3 3h18v2H3z";
    const menuUnfold = "M3 19h18v2H3zM3 3h18v2H3zm8 4h10v2H11zM3 8v8l4-4zm8 3h10v2H11zm0 4h10v2H11z";

    const [path, setPath] = createSignal<string>(menuFold);
    return (
        <svg viewBox="0 0 24 24" onclick={()=>path()===menuFold?setPath(menuUnfold):setPath(menuFold)}>
            <path d={path()} />
        </svg>
    )
}
export default SvgIcon;