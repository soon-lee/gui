import {createSignal} from "solid-js";
import {styled} from "solid-styled-components";
import SvgIcon from "./SvgIcon.tsx";

const ActionList = (props:{actionList?: string[]}) => {
    const [compact, setCompact] = createSignal<boolean>(false);

    const ActionListWrapper = styled.ul<{compact: boolean}>`
        background-color: #37464e;
        width: ${props=>props.compact ? '50' : '160'}px;
    `;

    return (
            <ActionListWrapper compact={compact()}>
                <SvgIcon icon={compact() ? "menu-fold" : "menu-unfold"} />
                {
                    props.actionList?.map((action) => {
                        return (
                            <li >{action}
                            </li>
                        );
                    })
                }
            </ActionListWrapper>
    )
}
export default ActionList;