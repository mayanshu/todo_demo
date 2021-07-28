import styles from '../styles/Home.module.css';
import React, { useState, useEffect } from 'react';

import { useAuth } from '../context/authContext';

import { Typography } from '@rmwc/typography';
import { TopAppBar } from '@rmwc/top-app-bar';
import { TopAppBarRow } from '@rmwc/top-app-bar';
import { TopAppBarSection } from '@rmwc/top-app-bar';
import { TopAppBarTitle } from '@rmwc/top-app-bar';
import { TopAppBarActionItem } from '@rmwc/top-app-bar';
import { TopAppBarFixedAdjust } from '@rmwc/top-app-bar';
import { Drawer } from "@rmwc/drawer";
import { DrawerHeader } from "@rmwc/drawer";
import { DrawerTitle } from "@rmwc/drawer";
import { DrawerContent } from "@rmwc/drawer";
import { List } from "@rmwc/list";
import { ListItem } from "@rmwc/list";

export default function Header ({ display } : any) {
    const { signOut } = useAuth();
    const [open, setOpen] = useState<boolean>(false);
    return (
        <>
            <TopAppBar style={{backgroundColor: '#910c8a'}}>
                <TopAppBarRow>
                <TopAppBarSection>
                    <TopAppBarTitle>TODO LIST MANAGER</TopAppBarTitle>
                </TopAppBarSection>
                <TopAppBarSection alignEnd>
                    <Typography use="subtitle2">{display}</Typography>
                    <TopAppBarActionItem onClick={() => setOpen(!open)} icon="/account_circle_black.svg" />
                </TopAppBarSection>
                </TopAppBarRow>
            </TopAppBar>
            <TopAppBarFixedAdjust />
            <Drawer dir="rtl" modal open={open} onClose={() => setOpen(false)}>
                <DrawerHeader dir="ltr">
                    <DrawerTitle>Menu</DrawerTitle>
                </DrawerHeader>
                <DrawerContent dir="ltr">
                    <List>
                        <ListItem  onClick={() => signOut()}>Logout</ListItem>
                    </List>
                </DrawerContent>
            </Drawer>
        </>
    )
}