/* eslint-disable react/display-name */
import { useAuth } from "context";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const myRoutes: Record<string, string[]> = {
  "/": ["admin", "author", "publisher", "reviewer"],
  "/profile": ["admin", "author", "publisher", "reviewer"],
  "/events": ["admin", "author", "publisher", "reviewer"],
  "/articles": ["admin", "author", "publisher", "reviewer"],
  "/users": ["admin"],
  "/review": ["admin", "reviewer"],
  "/create-article": ["admin", "author"],
  "/create-event": ["admin", "publisher"],
  "/review/[id]": ["admin", "reviewer"],
  "/event/[id]": ["admin", "author", "publisher", "reviewer"],
  "/article/[id]": ["admin", "author", "publisher", "reviewer"],
};

const authRoute = (Component: any) => {
  return (props: any) => {
    const { user } = useAuth();
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);

    const validateToken = (token: string) => {
      const localSecret = process.env.NEXT_PUBLIC_AUTH_SECRET as string;

      try {
        jwt.verify(token, localSecret);
        return true;
      } catch {
        return false;
      }
    };

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token || !validateToken(token)) {
        router.replace("/login");
      } else {
        if (myRoutes[router.pathname].includes(user?.role)) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      }
    }, [router, user.role]);

    return authenticated ? <Component {...props} /> : null;
  };
};

export default authRoute;
