import { useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { verifyAdminSession } from "@/store/slices/adminSlice";
import { ADMIN_TOKEN_KEY } from "@/store/axiosAdmin";

export default function AdminGuard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status } = useAppSelector((s) => s.admin);
  const verifyStarted = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }
    if (verifyStarted.current) return;
    verifyStarted.current = true;
    if (status !== "authenticated") {
      dispatch(verifyAdminSession());
    }
  }, [dispatch, navigate, status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      verifyStarted.current = false;
      navigate("/admin/login", { replace: true });
    }
  }, [status, navigate]);

  if (status === "authenticated") {
    return <Outlet />;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-cu-warm-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-cu-black border-t-cu-orange rounded-full animate-spin" />
        <p className="font-montserrat text-sm text-cu-concrete">
          Verificando sesión…
        </p>
      </div>
    </div>
  );
}
