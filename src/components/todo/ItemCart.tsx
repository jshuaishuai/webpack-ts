import React, { FC } from "react";
import { CartItem } from "./index";
import { Typography } from "antd";
import { onCheckedChange } from "./useChecked";
interface Props {
    item: CartItem;
    onCheckedChange: onCheckedChange<CartItem>;
    checked: boolean;
}
/**
 * mome 优化策略，类似于类组件中的 shouldComponentUpdate
 * 这个api让子组件只有在checked发生改变的时候再重新渲染
 * @param preProps 上一次的属性
 * @param nextProps 当前的属性
 * @returns true 跳过更新不会渲染该组件，false 就渲染当前组件
 */
const areEaual = (preProps: Props, nextProps: Props) => {
    // 避免不必要的渲染 只有 当前checked 不同的的条件下才会渲染此组件
    return preProps.checked === nextProps.checked;
};
const ItemCart: FC<Props> = (props) => {
    console.log("cart item rerender");
    const { item, onCheckedChange, checked } = props;
    const { name, price } = item;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        onCheckedChange(item, checked);
    };
    return (
        <div className="item-card ">
            <div className="checkbox-wrap">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={handleChange}
                />
            </div>
            <p className="item-info">
                {name}
                <Typography.Text mark>￥{price}</Typography.Text>
            </p>
        </div>
    );
};

export default React.memo(ItemCart, areEaual);
