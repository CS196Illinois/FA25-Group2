import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useAppContext } from "@/context/AppContext";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {} from "@/components/icons";
import { Badge, Spinner, Button, Link, Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem, cn } from "@heroui/react";
import axios from "axios";

export function BellIcon({ color }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState(false);
  const [read, setRead] = useState(false);
  const router = useRouter();
  
  async function getNotifications(username, authToken) {
    const response = await axios.get("/api/notifications", {
      params: { username, authToken }
    });

    return [response.data.notifications, response.data.read];
  }

  useEffect(() => {
    if (!router.isReady) return;
    if (fetched) return;

    async function x() {
      const response = await getNotifications(
        window.localStorage.getItem("username"),
        window.localStorage.getItem("authToken")
      );
      setNotifications(response[0]);
      setRead(response[1]);
      setLoading(false);
      setFetched(true);
    }

    x();
  }, [router.isReady]);

  return <Dropdown>
      <DropdownTrigger>
          <div className="cursor-pointer mt-2">
          <Badge color="danger" shape="circle" {...(read ? {} : { content: "" })} className="pointer-events-auto" badgeClass="pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={color} className="size-6">
                <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z" clipRule="evenodd" />
              </svg>
            </Badge>
          </div>
      </DropdownTrigger>
      <DropdownMenu variant="flat" disabledKeys={["spinner"]} className="max-h-80 overflow-y-auto">
        {loading ? <DropdownItem key="spinner">
          <div className="flex justify-center">
            <Spinner color="foreground" />
          </div>
        </DropdownItem> : (notifications?.map((notification) => {
            return <DropdownSection showDivider>
            <DropdownItem
              className="p-4"
            >
              <Link color="foreground" href={notification.link}>
                <p className={notification.read ? "" : "font-bold"}>{!notification.read && <span className="text-primary text-2xl mr-4">•</span>} {notification.message}</p>
              </Link>
            </DropdownItem>
          </DropdownSection>
        }))}
      </DropdownMenu>
    </Dropdown>
}

export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { showSignOutInNavbar } = useAppContext();

  useEffect(() => {
    setIsMounted(true);
    if (window.localStorage.getItem("authToken")) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSignOut = () => {
    window.localStorage.removeItem("authToken");
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
          <BellIcon color="#a1a0a9"/>
        </NavbarItem>

        <NavbarItem className="hidden md:flex gap-2">
          {isMounted && (isAuthenticated || showSignOutInNavbar) ? (
            <>
              <NextLink href="/create">
                <Button
                  color="primary"
                  className="text-sm font-normal"
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
                    <NextLink href={`/profile/${window.localStorage.getItem("username")}`}>Profile</NextLink>
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

      {/* <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <BellIcon />
        <NavbarMenuToggle />
      </NavbarContent> */}

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
