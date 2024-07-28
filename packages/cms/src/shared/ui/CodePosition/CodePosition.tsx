type Props = {
    code: string
    position: number
    symbolsToShow?: number
}

export const CodePosition = ({ code, position, symbolsToShow = 30 }: Props) => {
    const text = code.slice(
        position - symbolsToShow < 0 ? 0 : position - symbolsToShow,
        position + symbolsToShow
    )

    return (
        <div>
            ...
            {Array.from(text).map((symbol, index) => (
                <span
                    key={index}
                    style={{
                        background:
                            index === symbolsToShow ? 'red' : 'transparent',
                    }}
                >
                    {symbol}
                </span>
            ))}
            ...
        </div>
    )
}
