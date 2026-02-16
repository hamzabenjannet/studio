"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  const Wrapper = (props: P) => {
    const { authenticatedUser, loading, refreshSession } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !authenticatedUser) {
        refreshSession();
      }
    }, [authenticatedUser, loading, router]);

    if (loading || !authenticatedUser) {
      // You can return a loader here
      return (
        <div className="flex h-screen items-center justify-center">
          <p>Loading...</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  Wrapper.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return Wrapper;
};

export default withAuth;
