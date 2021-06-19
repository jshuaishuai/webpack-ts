import React, {
    useEffect,
    useState,
    useRef,
    useMemo,
    useCallback,
    FC,
} from "react";
import { Button } from "antd";
import { http, cancelAllRequest } from "@/utils/axios";
import { useLoading } from "@/hooks";
type User = {
    name: string;
    age: number;
};
type Project = {
    code: number;
    data: any;
    message: string;
    success: boolean;
};
const Counter: FC<{}> = (props) => {
    const [val, setVal] = useState(1);
    const [age, setAge] = useState<number>();
    const [user] = useState<User | null>();
    const ref1 = useRef<HTMLInputElement>(null); // 只读
    const ref2 = useRef<HTMLInputElement | null>(null);
    const ref3 = useRef(0);
    const [isLoading, load] = useLoading();
    useEffect(() => {
        // load(() => http("/eit/project", { name: 123 })).then((res) =>
        //     console.log(res)
        // );
        http<Project>("/eit/project", { name: 123 }).then((res) =>
            console.log(res)
        );
        return () => {
            cancelAllRequest();
        };
    }, []);
    const result = useMemo<number>(() => val + 1, [age]);
    const handleClick = () => {
        http("/eit/post", { age: 18 }, "POST");
    };

    const handleChange = useCallback<
        React.ChangeEventHandler<HTMLInputElement>
    >(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            console.log(ref1.current?.checked);
            console.log(e.target.checked);

            setVal(val + 1);
        },
        [val]
    );
    // todo 让val 每次+1，检验result是否变化
    const handleAdd = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
        (e) => {
            console.log(e.target);
            setVal(val + 1);
        },
        []
    );

    return (
        <div>
            <div>{isLoading ? "Loading" : "no"}</div>
            <div>
                {val + "..." + result} <Button onClick={handleAdd}>+1</Button>
            </div>
            <input type="checkbox" ref={ref1} onChange={handleChange} /> 多选框
            <Button type="primary" onClick={handleClick}>
                发送请求按钮
            </Button>
        </div>
    );
};

export default Counter;
