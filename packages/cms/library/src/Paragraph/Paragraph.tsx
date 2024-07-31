import { useFrameContext } from '@shared/ui/DebugComponent/context'
import { useEffect, useState } from 'react'

type Props = {
    text: string
}

export const Paragraph = ({ text }: Props) => {
    const { schema, updateProp } = useFrameContext()
    const [value, setValue] = useState(text)

    useEffect(() => {
        setValue(text)
    }, [text])

    return (
        <p>
            {schema?.id ? (
                <>
                    <input
                        defaultValue={text}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    ></input>
                    <button
                        type="button"
                        onClick={() =>
                            updateProp({
                                schemaAlias: schema.alias,
                                body: {
                                    name: 'text',
                                    mockValue: value,
                                },
                            })
                        }
                    >
                        save
                    </button>
                </>
            ) : (
                text
            )}
        </p>
    )
}
