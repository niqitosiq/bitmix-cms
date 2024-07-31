import { useErrorBoundary } from 'react-error-boundary'

type Props = {
    error: Error
}
export function ErrorFallback({ error }: Props) {
    const { resetBoundary } = useErrorBoundary()

    return (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre style={{ color: 'red' }}>{error.message}</pre>
            <button onClick={resetBoundary}>Try again</button>
        </div>
    )
}
