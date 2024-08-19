import { Prop } from '@entities/Prop'
import { usePinPropToCustomFrame } from '@entities/Schema/hooks'
import { ActionIcon } from '@mantine/core'
import { PinRightIcon, SewingPinIcon } from '@radix-ui/react-icons'

type Props = {
    propName?: Prop['name']
    propType?: Prop['type']
    schemaId: Prop['id']
}

export const PinPropValue = ({ propName, propType, schemaId }: Props) => {
    const { mutate } = usePinPropToCustomFrame()

    return (
        <ActionIcon
            onClick={() => mutate({ propName, propType, schemaId })}
            style={{ pointerEvents: 'all' }}
            size={'xs'}
        >
            <SewingPinIcon />
        </ActionIcon>
    )
}
