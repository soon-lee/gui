import {createSignal} from "solid-js";
import {styled} from "solid-styled-components";
import MenuCompactAction from "../icons/MenuCompactAction.tsx";

const ActionItem = (props:{action: string, onAction: ()=>any}) => {
    return <li onclick={props.onAction}>{props.action}</li>
}

const ActionList = (props:{actionList?: string[]}) => {
    const [compact, setCompact] = createSignal<boolean>(false);
    const [active, setActive] = createSignal<number>(0);

    const StyledList = styled.ul<{compact: boolean}>`
        width: ${props=>props.compact ? '50' : '160'}px;

        cursor: pointer;
        margin: 0;
        padding: 0;
        list-style-type: none;

        li {
            position: relative;
            padding: 5px;
            transition: background-color 0.3s ease;
        }
        li.active{
            background-color: red;
        }

        li::before {
            content: "";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 1px;
            background-color: #ccc;
        }

        li:first-child::before {
            display: none;
        }

        li::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: -1;
        }

        li:hover::before {
            opacity: 0.5;
        }
    `;

    return (
            <StyledList compact={compact()}>
                <MenuCompactAction onAction={()=>setCompact(!compact())} />
                {
                    props.actionList?.map((action,index) => {
                        return (
                            <li class={active() === index ? 'active' : ''} onclick={()=>setActive(index)}>{action}
                            </li>
                        );
                    })
                }
            </StyledList>
    )
}
export default ActionList;