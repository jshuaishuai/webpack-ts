import React from 'react';
export default function useLoading<T = any>(): [
    boolean,
    (aPromise: Function) => Promise<T>
] {

    const [isLoading, setState] = React.useState(false)

    const load = (aPromise: Function): Promise<T> => {
        setState(true)
        return aPromise().then((res: T) => res).finally(() => setState(false))
    }
    return [isLoading, load]

}
