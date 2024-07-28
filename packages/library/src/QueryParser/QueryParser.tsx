import React from 'react'

type Props = {
    queryKey: string
    children: (arg: { value: string | null }) => React.ReactNode
}

export const QueryParser = ({ children, queryKey }: Props) => {
    const query = new URLSearchParams(window.location.search)
    const value = query.get(queryKey)

    return <>{children({ value })}</>
}
