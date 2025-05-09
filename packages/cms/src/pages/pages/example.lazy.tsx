import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

const Foo = ({ children }) => {
    const [s, setS] = useState(0)
    const [b, setB] = useState(0)

    return (
        <div>
            <button onClick={() => setS(s + 1)}>Increment</button>
            {children({ s, b })}
        </div>
    )
}

const C = ({ s, b }) => {
    useEffect(() => {
        console.log(b, 'b')
    }, [b])
    useEffect(() => {
        console.log(s, 's')
    }, [s])
    return <div>Test</div>
}

const Bar = () => {
    return (
        <Foo>
            {({ s, b }) => (
                <C s={s} b={b}>
                    {s}
                </C>
            )}
        </Foo>
    )
}

export const Route = createLazyFileRoute('/pages/example')({
    component: Bar,
})
