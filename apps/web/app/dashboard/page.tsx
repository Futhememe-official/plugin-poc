"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PluginSpace } from "../components/plugin-space";

import { useExtension, Extension } from "@repo/plugin-lib/index";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardDescription } from "@/components/ui/card";

export default function Page() {
  const [current, setCurrent] = useState<string>("plugin-one");

  const extension = useExtension({
    plugins: [
      Extension.configure({
        name: "plugin-one",
        type: "simple-calendar",
        on: {
          "create-schedule": (args) => {
            alert(`create-schedule ${JSON.stringify(args)}`);
          },
        },
        user: {
          id: "1",
          role: "DOCTOR",
        },
        policies: {
          DOCTOR(user, { can, cannot }) {
            can("create", "Project");
          },
          ADMIN(user, { can, cannot }) {
            can("manage", "all");
          },
        },
      }),
      Extension.configure({
        name: "plugin-one-side",
        type: "extended-calendar",
        on: {
          "create-schedule": (args) => {
            console.warn(`create-schedule:`, args);
          },
        },
        user: {
          id: "1",
          role: "DOCTOR",
        },
        policies: {
          DOCTOR(user, { can, cannot }) {
            cannot("create", "Project");
          },
          ADMIN(user, { can, cannot }) {
            can("manage", "all");
          },
        },
      }),
    ],
    current,
  });

  return (
    <SidebarProvider
      defaultOpen={false}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6">
              <div className="flex w-full items-center justify-between">
                <Button
                  disabled={current === "plugin-one"}
                  onClick={() => setCurrent("plugin-one")}
                >
                  Primeiro plugin
                </Button>
                <Button
                  disabled={current === "plugin-one-side"}
                  onClick={() => setCurrent("plugin-one-side")}
                >
                  Segundo plugin
                </Button>
              </div>
              <PluginSpace extension={extension.current} />
              <Separator />
              <div className="flex flex-col gap-4">
                <CardDescription>
                  Clique no botão abaixo para chamar uma função do plugin fora
                  dele.
                </CardDescription>
                <Button
                  variant={"outline"}
                  onClick={() =>
                    extension.chain(current).on("create-schedule", {
                      date: new Date(),
                      name: "teste por fora",
                    })
                  }
                >
                  Chamar função <b>"create-schedule"</b> do <b>{current}</b>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
