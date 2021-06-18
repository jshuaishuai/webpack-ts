import React from "react";
import { useEffect } from "react";
import { FC } from "react";
import { Button } from "antd";
import { http, cancelAllRequest } from "@/utils/axios";
const Counter: FC<{}> = (props) => {
    useEffect(() => {
        http("/eit/project", { name: 123 });
        return () => {
            cancelAllRequest();
        };
    }, []);
    const handleClick = () => {
        http("/eit/post", { age: 18 }, "POST");
    };
    return (
        <div>
            <Button type="primary" onClick={handleClick}>
                发送请求按钮
            </Button>
        </div>
    );
};

export default Counter;
