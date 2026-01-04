"use client";

import { useState } from "react";
import { AdminLoginModal } from "./AdminLoginModal";

/**
 * AdminButton Component
 * 
 * Client component that handles admin login modal visibility.
 * Clicking the button opens the login modal without changing the URL.
 */
export const AdminButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-green-500 hover:text-green-400 transition-colors"
      >
        Admin
      </button>
      {showModal && <AdminLoginModal onClose={() => setShowModal(false)} />}
    </>
  );
};

