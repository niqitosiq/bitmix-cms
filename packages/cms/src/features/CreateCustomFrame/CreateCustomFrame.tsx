import { useCreateCustomFrame } from '@entities/Frame'
import { Button, Group, Modal, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useNavigate } from '@tanstack/react-router'

type Props = {}
export const CreateCustomFrame = ({}: Props) => {
    const [opened, { open, close }] = useDisclosure(false)

    const form = useForm({
        mode: 'controlled',
        initialValues: {
            name: '',
            description: '',
        },
    })

    const navigate = useNavigate()
    const { mutate, error } = useCreateCustomFrame((frame) => {
        close()
        navigate({ to: '/frames/$frameId/edit', params: { frameId: frame.id } })
    })

    return (
        <>
            <Modal opened={opened} onClose={close} title="Page Creation">
                <form onSubmit={form.onSubmit((values) => mutate(values))}>
                    <TextInput
                        withAsterisk
                        label="Name"
                        placeholder="Enter Custom Frame name"
                        key={form.key('name')}
                        {...form.getInputProps('name')}
                    />
                    <TextInput
                        withAsterisk
                        label="Description"
                        placeholder="Enter Custom Frame description"
                        key={form.key('description')}
                        {...form.getInputProps('description')}
                    />

                    {error && <div>{error.message}</div>}

                    <Group justify="flex-end" mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>
                </form>
            </Modal>

            <Button onClick={open}>Create Frame</Button>
        </>
    )
}
