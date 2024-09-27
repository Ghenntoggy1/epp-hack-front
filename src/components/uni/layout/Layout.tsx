import Head from "next/head";
import { Navbar } from "./Navbar";
import { MFAButton } from "../common";

interface LayoutProps {
  title: string;
}

export const Layout = ({ title, children }: React.PropsWithChildren<LayoutProps>) => {
  return (
    <>
      <Head>
        <title>{`${title} | Erasmus++`}</title>
      </Head>

      <div>
        <Navbar />
        {children}
      </div>
    </>
  );
};
