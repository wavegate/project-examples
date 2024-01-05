import {
  LaptopOutlined,
  NotificationOutlined,
  PieChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { type Key, type ReactNode, createElement } from "react";
import Logo from "@/components/Logo";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import ProtectedComponent from "./ProtectedComponent";
import Breadcrumbs from "./Breadcrumbs";
import Head from "next/head";

const { Header, Content, Sider } = Layout;

const items1: MenuProps["items"] = ["1", "2", "3"].map((key) => ({
  key,
  label: `nav ${key}`,
}));

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: ReactNode,
  key: Key,
  icon?: ReactNode,
  children?: MenuItem[],
  type?: "group",
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items2: MenuProps["items"] = [
  getItem("Dashboard", "dashboard", <PieChartOutlined />),
  getItem("Bugs", "bugs", <PieChartOutlined />),
];

type LayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: LayoutProps) {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleClick = (e: { key: string }) => {
    const path = "/" + e.key;

    void router.push(path);
  };

  return (
    <>
      <Head>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Layout style={{ minHeight: "100vh" }}>
        <Header style={{ display: "flex", alignItems: "center" }}>
          <Logo className={`w-[50px] text-white`} />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            items={items1}
            style={{ flex: 1, minWidth: 0 }}
          />
          {sessionData && (
            <div className={`text-white`}>
              Logged in as {sessionData.user?.name}
            </div>
          )}
          <button
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={
              sessionData
                ? () => void signOut()
                : () => void signIn(undefined, { callbackUrl: "/dashboard" })
            }
          >
            {sessionData ? "Sign out" : "Sign in"}
          </button>
        </Header>
        <Layout>
          <Sider
            width={200}
            style={{ background: colorBgContainer, height: "100%" }}
          >
            <Menu
              onClick={handleClick}
              mode="inline"
              style={{ height: "100%", borderRight: 0 }}
              items={items2}
            />
          </Sider>
          <Layout style={{ padding: "0 24px 24px", height: "100%" }}>
            <div className={`my-[16px]`}>
              <Breadcrumbs />
            </div>
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <ProtectedComponent>{children}</ProtectedComponent>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
}
