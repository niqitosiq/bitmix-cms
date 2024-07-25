import { CardProps, Card as UiCard } from '@mantine/core'

type Props = {
    children: React.ReactNode
} & CardProps

export const Card = ({ children, ...rest }: Props) => {
    return (
        <UiCard shadow="sm" padding="lg" radius="md" withBorder {...rest}>
            {children}
        </UiCard>
    )
}
