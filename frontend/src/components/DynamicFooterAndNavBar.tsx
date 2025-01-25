"use client";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";
import { NavigationBar } from "./NavigationBar";
import Footer from "./Footer";

const DynamicFooterAndNavBar = ({ children }: { children: ReactNode }) => {
  const pathName = usePathname();
  const isAuthPath = pathName.startsWith("/auth");
  return isAuthPath ? (
    <>{children}</>
  ) : (
    <>
      <NavigationBar />
      {children}
      <Footer />
    </>
  );
};

export default DynamicFooterAndNavBar;
