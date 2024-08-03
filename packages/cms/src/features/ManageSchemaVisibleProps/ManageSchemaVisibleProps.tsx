import { CleanSchema } from '@entities/Schema'
import { ChildrenArg } from '../../entities/Frame/ui/FramePropsDefenition'
import {
    useAddVisiblePropToSchema,
    useDeleteVisiblePropFromSchema,
} from '../../entities/Schema/hooks'
import { ActionIcon, Button, Modal } from '@mantine/core'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { useDisclosure } from '@mantine/hooks'
import { useMemo } from 'react'
import { TsProp } from '@features/GetAvailablePropsForFrame/GetAvailablePropsForFrame'

type Props = {
    args: TsProp[]
    schema: CleanSchema
    children: (arg: { selectedArgs: TsProp[] }) => React.ReactNode
}

export const ManageSchemaVisibleProps = ({ schema, children, args }: Props) => {
    const [opened, { open, close }] = useDisclosure()
    const selectedArgs = useMemo(
        () =>
            schema.visibleProps.map((prop) => ({
                name: prop.name,
                type: args.find((arg) => arg.name === prop.name)?.type || '',
            })),
        [schema, args]
    )

    const { mutate: addVisibleProp } = useAddVisiblePropToSchema()
    const { mutate: deleteVisibleProp } = useDeleteVisiblePropFromSchema()

    return (
        <>
            <Modal opened={opened} onClose={close}>
                <>
                    selected
                    {schema.visibleProps.map((prop) => (
                        <Button
                            onClick={() =>
                                deleteVisibleProp({
                                    schemaAlias: schema.alias,
                                    visiblePropName: prop.name,
                                })
                            }
                        >
                            {prop.name}
                        </Button>
                    ))}
                    to add:
                    {args.map((arg) => (
                        <Button
                            onClick={() =>
                                addVisibleProp({
                                    schemaAlias: schema.alias,
                                    visiblePropName: arg.name || '',
                                })
                            }
                        >
                            {arg.name}
                        </Button>
                    ))}
                </>
            </Modal>

            {children({ selectedArgs })}

            <ActionIcon size={'xs'} onClick={open}>
                <PlusCircledIcon />
            </ActionIcon>
        </>
    )
}
