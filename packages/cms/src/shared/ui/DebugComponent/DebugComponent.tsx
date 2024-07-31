import { ErrorFallback } from './ComponentError'
import { ErrorBoundary } from 'react-error-boundary'
import { FrameContext } from './context'
import { Schema } from '@entities/Schema'
import { useGetSchema } from '@entities/Schema/hooks'
import { useUpdatePropInSchema } from '@entities/Prop'

type Props = {
    children: React.ReactNode
    id: Schema['alias']
}

// move it on feature level
export const DebugComponent = ({ id, children }: Props) => {
    const { data: schema } = useGetSchema(id)
    const { mutate } = useUpdatePropInSchema(id)
    console.log(schema)
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <FrameContext.Provider
                value={{
                    schema,
                    updateProp: mutate,
                }}
            >
                <div>{children}</div>
            </FrameContext.Provider>
        </ErrorBoundary>
    )
}
