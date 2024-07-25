import { useCreatePage } from '@entities/Page/hooks'
import { Site } from '@entities/Site'
import { Button, Group, Modal, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useEffect } from 'react'

type Props = { siteId: Site['id'] }

export const CreatePageForSite = ({ siteId }: Props) => {
    const [opened, { open, close }] = useDisclosure(false)

    const form = useForm({
        mode: 'controlled',
        initialValues: {
            name: '',
            url: '/',
            siteId: siteId,
        },
    })

    const { mutate, error, isSuccess } = useCreatePage()

    useEffect(() => {
        isSuccess && close()
    }, [isSuccess])

    return (
        <>
            <Modal opened={opened} onClose={close} title="Page Creation">
                <form onSubmit={form.onSubmit((values) => mutate(values))}>
                    <TextInput
                        withAsterisk
                        label="Name"
                        placeholder="Enter Page name"
                        key={form.key('name')}
                        {...form.getInputProps('name')}
                    />

                    <TextInput
                        withAsterisk
                        label="URL"
                        placeholder="Enter Page URL"
                        key={form.key('url')}
                        {...form.getInputProps('url')}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>

                    {error && <div>{error.message}</div>}
                </form>
            </Modal>

            <Button onClick={open}>Create Page</Button>
        </>
    )
}
