"use client";

import React from 'react'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, useDisclosure } from "@nextui-org/react";
import CustomModal from './Modal';

export default function NavBar() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Navbar height={"128px"} shouldHideOnScroll>
        <NavbarBrand>
          <h2 className='font-bold text-5xl' >Image Gallery</h2>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button color='success' variant="flat" onPress={onOpen}>Upload</Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <CustomModal isOpen={isOpen} onClose={onOpenChange} selectedImage={false} />
    </>
  )
}
