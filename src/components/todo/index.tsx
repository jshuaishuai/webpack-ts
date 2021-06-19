import React from "react";
import { Typography, List } from "antd";
import ItemCart from "./ItemCart";
import useChecked from "./useChecked";
import "./index.css";
export interface CartItem {
    id: number;
    name: string;
    price: number;
}
type CartItems = CartItem[];
const cartData = Array(5)
    .fill(undefined)
    .map((item, index) => ({
        id: index,
        name: `商品${index}`,
        price: Math.round(Math.random() * 100),
    }));

const TodoList = () => {
    const { onCheckedChange, checkedMap, filterChecked } = useChecked(cartData);
    /* 根据已选中的商品计算出总和 */
    const getSumPrice = (CartItem: CartItems) => {
        return CartItem.reduce((pre, cur) => pre + cur.price, 0);
    };
    /* 自动计算总价格 */
    const total = getSumPrice(filterChecked());

    const Footer = (
        <div className="footer">
            <div className="check-all">
                <input type="checkbox" />
                全选
            </div>
            <div>
                价格总计<Typography.Text mark>￥{total}</Typography.Text>
            </div>
        </div>
    );

    return (
        <div className="cart">
            <List
                header={<div className="cart-header">购物车</div>}
                footer={Footer}
                bordered
                dataSource={cartData}
                renderItem={(item) => {
                    const checked = checkedMap[item.id] || false;
                    return (
                        <List.Item>
                            <ItemCart
                                item={item}
                                checked={checked}
                                onCheckedChange={onCheckedChange}
                            />
                        </List.Item>
                    );
                }}
            />
        </div>
    );
};

export default TodoList;
