/**
 * 自定义hook 单选，全选反选，过滤已选择的数据
 */
import { useReducer, useCallback } from "react";
import { CHECKED_ALL_CHANGE, CHECKED_CHANGE } from "./action-types";

export type OnCheckedChange<T> = (item: T, checked: boolean) => any;
interface Option {
    /** 用来在map中记录勾选状态的key 一般取id */
    key?: string;
}
type CheckedMap = {
    [key: number]: boolean;
};

type CheckedChange<T> = {
    type: typeof CHECKED_CHANGE;
    payload: {
        dataItem: T;
        checked: boolean;
    };
};
type CheckedAllChange = {
    type: typeof CHECKED_ALL_CHANGE;
    payload: boolean;
};
type Action<T> = CheckedChange<T> | CheckedAllChange;
export const useChecked = <T extends Record<string, any>>(
    dataSource: T[],
    { key = "id" }: Option = {}
) => {
    const [checkedMap, dispathch] = useReducer(
        (state: CheckedMap, action: Action<T>) => {
            switch (action.type) {
                case CHECKED_CHANGE: {
                    const { payload } = action;
                    const { dataItem, checked } = payload;
                    const { [key]: id } = dataItem;
                    return {
                        ...state,
                        [id]: checked,
                    };
                }
                case CHECKED_ALL_CHANGE: {
                    const { payload } = action;
                    const newCheckedMap: CheckedMap = {};
                    // payload = true 全选的话 就是将数据全部设置为true
                    if (payload) {
                        dataSource.forEach((item) => {
                            newCheckedMap[item.id] = true;
                        });
                    }
                    // 否则返回空对象
                    return newCheckedMap;
                }
                default:
                    return state;
            }
        },
        {}
    );

    /* 勾选状态变更 */
    const onCheckedChange: OnCheckedChange<T> = (dataItem, checked) => {
        dispathch({
            type: CHECKED_CHANGE,
            payload: {
                dataItem,
                checked,
            },
        });
    };

    /* 过滤出勾选项 */

    const filterChecked = useCallback(() => {
        return (
            Object.entries(checkedMap)
                .filter((item) => Boolean(item[1]))
                .map(([checkedId]) =>
                    dataSource.find(({ [key]: id }) => id === Number(checkedId))
                )
                // 有可能勾选了以后直接删除 此时id虽然在checkedMap里 但是dataSource里已经没有这个数据了
                // 先把空项过滤掉 保证外部传入的func拿到的不为undefined
                .filter(Boolean) as any as T[]
        );
    }, [checkedMap, dataSource]);

    /* 判断是否是全选 */
    const isCheckedAll =
        dataSource.length !== 0 && dataSource.length === filterChecked().length;
    /* 全选和反选业务逻辑 */
    const onCheckedAllChange = (checkedAll: boolean) => {
        console.log(checkedAll);
        dispathch({
            type: CHECKED_ALL_CHANGE,
            payload: checkedAll,
        });
    };
    return {
        onCheckedChange,
        checkedMap,
        filterChecked,
        onCheckedAllChange,
        isCheckedAll,
    };
};

export default useChecked;
