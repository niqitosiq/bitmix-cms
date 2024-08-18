import React from 'react'

type Props<T extends Record<string, any>> = {
    children: (args: Omit<T, 'children'>) => React.ReactNode
} & T

export const Frame = <T extends Record<string, any>>({
    children,
    ...props
}: Props<T>) => {
    return children(props)
}
