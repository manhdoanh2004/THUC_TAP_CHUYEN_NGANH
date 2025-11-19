
import type { Metadata } from "next";

import React from "react";
import { Dashboard } from "./Dashboard";

export const metadata: Metadata = {
  title:
    "Admin Dashboard ",
  description: "Admin Dashboard",
};

export default function Ecommerce() {

  return (
   <Dashboard/>
  );
}
