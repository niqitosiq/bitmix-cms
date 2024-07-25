import { useCreateSite } from '@entities/Site'
import { Button, Checkbox, Group, Modal, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useEffect } from 'react'

type Props = {}
export const CreateSite = ({}: Props) => {
    const [opened, { open, close }] = useDisclosure(false)

    const form = useForm({
        mode: 'controlled',
        initialValues: {
            name: '',
        },
    })

    const { mutate, error, isSuccess } = useCreateSite()

    useEffect(() => {
        isSuccess && close()
    }, [isSuccess])

    return (
        <>
            <Modal opened={opened} onClose={close} title="Site Creation">
                <form onSubmit={form.onSubmit((values) => mutate(values))}>
                    <TextInput
                        withAsterisk
                        label="Name"
                        placeholder="Enter site name"
                        key={form.key('name')}
                        {...form.getInputProps('name')}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>

                    {error && <div>{error.message}</div>}
                </form>
            </Modal>

            <Button onClick={open}>Create Site</Button>
        </>
    )
}
