import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function AdminLogin() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const login = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const { data } = await axios.post(
                `${apiUrl}/api/admin/auth/login`,
                form
            );

            localStorage.setItem(
                "ljka_admin_token",
                data.token
            );

            navigate(
                data.admin.role === "superadmin"
                    ? "/superadmin/dashboard"
                    : "/admin/dashboard",
                {
                    replace: true,
                }
            );
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f7f4ef]">

            {/* ================= HEADER ================= */}
            <header className="border-b border-[#eadfe1] bg-white shadow-sm">
                <div className="mx-auto flex min-h-[76px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                    {/* LOGO + BRAND */}
                    <div className="flex items-center gap-3 sm:gap-4">

                        <img
                            src="/img/Lakhdaatar_Logo.png"
                            alt="Lakhdaatar Logo"
                            className="h-11 w-11 object-contain sm:h-14 sm:w-14"
                        />

                        <div>
                            <h1 className="text-lg font-bold leading-tight text-[#5a0615] sm:text-xl">
                                LJKA
                            </h1>

                            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#b78a2d] sm:text-xs sm:tracking-[0.18em]">
                                Administration Portal
                            </p>
                        </div>

                    </div>

                    {/* HEADER INFO */}
                    <div className="hidden items-center gap-3 sm:flex">

                        <div className="h-9 w-px bg-slate-200" />

                        <div className="text-right">
                            <p className="text-xs font-semibold text-slate-600">
                                Secure Administration
                            </p>

                            <p className="mt-0.5 text-[11px] text-slate-400">
                                Authorized access only
                            </p>
                        </div>

                    </div>

                </div>
            </header>

            {/* ================= MAIN ================= */}
            <section className="flex min-h-[calc(100vh-76px)] items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">

                <div className="w-full max-w-xl">

                    {/* LOGIN CARD */}
                    <div className="overflow-hidden rounded-3xl border border-[#eadfe1] bg-white shadow-xl">

                        <div className="p-6 sm:p-8 md:p-10 lg:p-12">

                            <div className="mx-auto w-full max-w-md">

                                {/* MOBILE LOGO */}
                                <div className="mb-8 flex flex-col items-center text-center sm:mb-10 lg:hidden">

                                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-2 shadow-md ring-1 ring-[#eadfe1]">

                                        <img
                                            src="/img/Lakhdaatar_Logo.png"
                                            alt="Lakhdaatar Logo"
                                            className="h-full w-full object-contain"
                                        />

                                    </div>

                                    <h2 className="mt-4 text-xl font-bold text-[#5a0615]">
                                        LJKA
                                    </h2>

                                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#b78a2d]">
                                        Administration Portal
                                    </p>

                                </div>

                                {/* LOGIN TITLE */}
                                <div className="mb-7 sm:mb-8">

                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b78a2d] sm:text-sm">
                                        Secure Access
                                    </p>

                                    <h2 className="mt-2 text-3xl font-bold leading-tight text-[#5a0615] sm:text-4xl">
                                        Sign in
                                    </h2>

                                    <p className="mt-3 text-sm leading-6 text-slate-500">
                                        Sign in to continue to your LJKA
                                        administration account.
                                    </p>

                                </div>

                                {/* LOGIN FORM */}
                                <form onSubmit={login}>

                                    {/* USERNAME */}
                                    <label className="block text-sm font-semibold text-slate-700">

                                        Username

                                        <input
                                            required
                                            type="text"
                                            autoComplete="username"
                                            placeholder="Enter username"
                                            className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#78081c] focus:bg-white focus:ring-4 focus:ring-[#78081c]/10"
                                            value={form.username}
                                            onChange={(event) =>
                                                setForm({
                                                    ...form,
                                                    username: event.target.value,
                                                })
                                            }
                                        />
                                    </label>

                                    {/* PASSWORD */}
                                    <label className="mt-5 block text-sm font-semibold text-slate-700">

                                        Password

                                        <input
                                            required
                                            type="password"
                                            autoComplete="current-password"
                                            placeholder="Enter your password"
                                            className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#78081c] focus:bg-white focus:ring-4 focus:ring-[#78081c]/10"
                                            value={form.password}
                                            onChange={(event) =>
                                                setForm({
                                                    ...form,
                                                    password: event.target.value,
                                                })
                                            }
                                        />

                                    </label>

                                    {/* BUTTON */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="mt-7 h-12 w-full rounded-xl bg-[#78081c] px-5 text-sm font-bold text-white shadow-md shadow-[#78081c]/20 transition duration-200 hover:bg-[#5a0615] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#78081c]/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loading
                                            ? "Signing in..."
                                            : "Sign in to LJKA"}
                                    </button>

                                </form>

                                {/* SECURITY NOTE */}
                                <div className="mt-7 rounded-xl border border-[#eadfe1] bg-[#faf8f5] p-4">

                                    <div className="flex items-start gap-3">

                                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#5a0615] text-xs text-white">
                                            🔒
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold text-[#5a0615]">
                                                Authorized access only
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                                This administration portal is intended
                                                only for authorized LJKA administrators.
                                            </p>
                                        </div>

                                    </div>

                                </div>

                                {/* FOOTER */}
                                <p className="mt-6 text-center text-xs text-slate-400">
                                    © LJKA Administration Portal
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}