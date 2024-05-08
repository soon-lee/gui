import {styled} from "solid-styled-components";

const Hover = () => {

    const StyledDiv = styled.div`
        div.bubble {
            position: relative;
            padding: 10px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        }

        /* 创建直线部分 */
        div.bubble:after {
            content: "";
            position: absolute;
            bottom: -15px; /* 调整以改变直线与气泡底部的距离 */
            left: 50%; /* 使直线从气泡中心开始 */
            width: 60px; /* 直线长度 */
            height: 2px; /* 直线宽度 */
            background-color: #ffffff;
            margin-left: -30px; /* 负的宽度一半，以居中直线 */
        }
            /* 创建箭头部分 */
        div.bubble:before {
            content: "";
            position: absolute;
            bottom: -10px; /* 调整以改变箭头与直线的距离 */
            left: calc(50% - 5px); /* 箭头左边缘对准直线中心 */
            border-width: 5px 5px 0 0; /* 调整边框宽度形成三角形 */
            border-style: solid;
            border-color: black transparent; /* 箭头颜色和透明度 */
            transform: rotate(-135deg); /* 旋转45度形成指向右下的箭头 */
        }
    `

    return (
        <StyledDiv>
            <div class={"bubble"}>fdgorthirnyot</div>
        </StyledDiv>
    )
}
export default Hover;