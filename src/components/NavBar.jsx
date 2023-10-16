"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, useDisclosure, Link } from "@nextui-org/react";
import CustomModal from './Modal';

export default function NavBar() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Navbar height={"128px"} shouldHideOnScroll>
        <NavbarBrand>
          <Link color="foreground" className='font-bold text-5xl' href="/" >
            Image Gallery
          </Link>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button color='success' variant="flat" onPress={onOpen}>Upload</Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <CustomModal isOpen={isOpen} onClose={onOpenChange} />
    </>
  )
}
