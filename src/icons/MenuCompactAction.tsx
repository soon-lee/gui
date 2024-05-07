import {createSignal} from "solid-js";
import {styled} from "solid-styled-components";

const MenuCompactAction = (props: {onAction: ()=>any}) => {
    const menu = "M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z";
    const menuOpen = "M3 18h13v-2H3zm0-5h10v-2H3zm0-7v2h13V6zm18 9.59L17.42 12 21 8.41 19.59 7l-5 5 5 5z";

    const [path, setPath] = createSignal<string>(menuOpen);

    const StyledSvg = styled.svg`
        width: 24px;
        height: 24px;
        fill: currentColor;
    `;
    const handleClick = () => {
        path()===menu?setPath(menuOpen):setPath(menu)
        props.onAction();
    }
    return (
        <StyledSvg viewBox="0 0 24 24" onclick={handleClick}>
            <path d={path()} />
        </StyledSvg>
    )
}
export default MenuCompactAction;