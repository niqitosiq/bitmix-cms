import { Group, ScrollArea } from "@mantine/core";
import {
  IconPresentationAnalytics,
  IconDatabase,
  IconSettings,
  IconFrame,
  IconSitemap,

} from '@tabler/icons-react';
import { Logo } from "@shared/ui/Logo";
import classes from './SidebarWithMenu.module.css'
import { LinksGroup } from "@shared/ui/MenuItem";
import { Minimal } from "@entities/User/ui/Minimal";

const mockdata = [
    { label: 'Sites', icon: IconSitemap },
    { label: 'Domains', icon: IconDatabase },
    { label: 'Integrations', icon: IconSettings },
    { label: 'Franes', icon: IconFrame },
    { label: 'Analysis', icon: IconPresentationAnalytics },
]



export function SidebarWithMenu() {
    const links = mockdata.map((item) => <LinksGroup  {...item} key={item.label} />);
    return (
        <nav className={classes.navbar}>
            <div className={classes.header}>
                <Group justify="space-between">
                    <Logo />
                </Group>
            </div>

            <ScrollArea className={classes.links}>
                <div className={classes.linksInner}>{links}</div>
            </ScrollArea>

            <div className={classes.footer}>
                <Minimal />
            </div>
        </nav>
    );
}