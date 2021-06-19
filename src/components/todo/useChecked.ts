/**
 * 自定义hook 单选，全选反选，过滤已选择的数据
 */
import { useReducer, useCallback } from "react";
export type onCheckedChange<T> = (item: T, checked: boolean) => any;
interface Option {
    /** 用来在map中记录勾选状态的key 一般取id */
    key?: string;
}
type CheckedMap = {
    [key: number]: boolean;
};

const CHECKED_CHANGE = "CHECKED_CHANGE";

type CheckedChange<T> = {
    type: typeof CHECKED_CHANGE;
    payload: {
        dataItem: T;
        checked: boolean;
    };
};
type Action<T> = CheckedChange<T>;
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
                default:
                    return state;
            }
        },
        {}
    );

    /* 勾选状态变更 */
    const onCheckedChange: onCheckedChange<T> = (dataItem, checked) => {
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

    return {
        onCheckedChange,
        checkedMap,
        filterChecked,
    };
};

export default useChecked;
