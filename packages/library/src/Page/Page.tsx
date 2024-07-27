type Props = {
    children: React.ReactNode
}

export const Page = ({ children }: Props) => {
    return (
        <div>
            <h1>I'm a executable "Page Frame"! This is hardcoded</h1>

            <div>
                <p>It is my children:</p>
                {children}
            </div>
        </div>
    )
}
