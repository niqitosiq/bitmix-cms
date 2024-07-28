import { Prop, useGetProp, useUpdatePropInSchema } from '@entities/Prop'
import { Schema } from '@entities/Schema'
import { useGetSchema } from '@entities/Schema/hooks'
import { ActionIcon, Button, Group, Menu, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { IconEdit } from '@tabler/icons-react'

type Props = {
    schemaId: Schema['id']
    name?: Prop['name']
    type?: Prop['type'] | null
    value?: Prop['propValue']
    children: React.ReactNode
}

const Dropdown = ({ schemaId, name, type, value, children }: Props) => {
    const [opened, { open, close }] = useDisclosure()
    const { mutate } = useUpdatePropInSchema(schemaId)
    const { data } = useGetSchema(schemaId)

    const form = useForm({
        mode: 'controlled',
        initialValues: {
            mockValue: value?.value || '',
        },
    })

    if (!data) return

    return (
        <Menu shadow="md" width={200} trapFocus opened={opened} onClose={close}>
            <Menu.Target>
                <div onClick={open}>{children}</div>
            </Menu.Target>

            <Menu.Dropdown>
                <form
                    onSubmit={form.onSubmit(async (values) => {
                        await mutate({
                            schemaAlias: data.alias,
                            body: { ...values, name: name!, type: type! },
                        })
                        close()
                    })}
                >
                    <TextInput
                        withAsterisk
                        autoFocus
                        label="mockValue"
                        placeholder="Enter Prop Mock Value"
                        key={form.key('mockValue')}
                        {...form.getInputProps('mockValue')}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>
                </form>
            </Menu.Dropdown>
        </Menu>
    )
}

export const UpdatePropViaMockValue = (props: Omit<Props, 'children'>) => {
    return (
        <Dropdown {...props}>
            <ActionIcon size={'xs'} style={{ pointerEvents: 'auto' }}>
                <IconEdit />
            </ActionIcon>
        </Dropdown>
    )
}
