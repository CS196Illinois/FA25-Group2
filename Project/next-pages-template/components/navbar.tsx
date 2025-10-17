import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import { useAppContext } from "@/context/AppContext";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {} from "@/components/icons";

export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { showSignOutInNavbar } = useAppContext();

  useEffect(() => {
    setIsMounted(true);
    const token = Cookies.get("token");

    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSignOut = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    router.push("/");
  };

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <p className="font-bold text-inherit">JEAKS</p>
          </NextLink>
        </NavbarBrand>
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>

        <NavbarItem className="hidden md:flex gap-2">
          {isMounted && (isAuthenticated || showSignOutInNavbar) ? (
            <>
              <NextLink href="/create-listing">
                <Button
                  as={Link}
                  className="text-sm font-normal text-default-600 bg-default-100"
                  variant="flat"
                >
                  Create Listing
                </Button>
              </NextLink>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    className="text-default-600"
                    endContent={
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                          fillRule="evenodd"
                        />
                      </svg>
                    }
                    variant="light"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Account Actions">
                  <DropdownItem key="profile">
                    <NextLink href="/profile">Profile</NextLink>
                  </DropdownItem>
                  <DropdownItem key="sign-out" onClick={handleSignOut}>
                    Sign Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : isMounted ? (
            <NextLink href="/auth">
              <Button
                as={Link}
                className="text-sm font-normal text-default-600 bg-default-100"
                variant="flat"
              >
                Sign In
              </Button>
            </NextLink>
          ) : null}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
