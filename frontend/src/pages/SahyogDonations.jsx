import React, {
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Filter,
    Search,
    X,
} from "lucide-react";

import { Link } from "react-router-dom";
import { LJKAContext } from "../context/LJKAContext";
import locationData from "../data/india/locationData.json";

const DONATION_CACHE_TTL_MS = 30_000;
const donationResponseCache = new Map();

const SahyogDonations = () => {
    const { backendUrl } = useContext(LJKAContext);

    // ==========================================
    // STATE
    // ==========================================

    const [donations, setDonations] = useState([]);

    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        perPage: 20,
        totalDonations: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");

    const [filters, setFilters] = useState({
        state: "",
        district: "",
        tehsil: "",
    });

    const [showFilters, setShowFilters] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const requestIdRef = useRef(0);

    // ==========================================
    // QUERY KEY
    // ==========================================

    const queryKey = useMemo(
        () =>
            JSON.stringify({
                page,
                search,
                filters,
            }),
        [page, search, filters]
    );

    // ==========================================
    // LOCATION OPTIONS
    // Same structure as Members
    // ==========================================

    const stateOptions = useMemo(() => {
        return [...locationData.states].sort((a, b) =>
            a.name.localeCompare(b.name, undefined, {
                sensitivity: "base",
            })
        );
    }, []);

    const selectedState = useMemo(() => {
        return stateOptions.find(
            (state) => String(state.code) === String(filters.state)
        );
    }, [stateOptions, filters.state]);

    const districtOptions = useMemo(() => {
        return [...(selectedState?.districts || [])].sort((a, b) =>
            a.name.localeCompare(b.name, undefined, {
                sensitivity: "base",
            })
        );
    }, [selectedState]);

    const selectedDistrict = useMemo(() => {
        return districtOptions.find(
            (district) =>
                String(district.code) === String(filters.district)
        );
    }, [districtOptions, filters.district]);

    const tehsilOptions = useMemo(() => {
        return [...(selectedDistrict?.tehsils || [])].sort((a, b) =>
            a.name.localeCompare(b.name, undefined, {
                sensitivity: "base",
            })
        );
    }, [selectedDistrict]);

    // ==========================================
    // FETCH DONATIONS
    // ==========================================

    const fetchDonations = async (signal) => {
        const requestId = ++requestIdRef.current;

        const cached = donationResponseCache.get(queryKey);

        if (
            cached &&
            Date.now() - cached.createdAt < DONATION_CACHE_TTL_MS
        ) {
            setDonations(cached.data);
            setPagination(cached.pagination);
            setError("");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams();

            params.append("page", String(page));
            params.append("limit", "20");

            if (search.trim()) {
                params.append("search", search.trim());
            }

            /*
             * These filters are sent to the API.
             *
             * Your backend donation endpoint should support:
             * state
             * district
             * tehsil
             *
             * If your backend currently only supports search,
             * the filters need to be added to the backend route.
             */
            Object.entries(filters).forEach(([key, value]) => {
                if (
                    typeof value === "string" &&
                    value.trim()
                ) {
                    params.append(key, value.trim());
                }
            });

            const response = await fetch(
                `${backendUrl}/api/public/sahyog/donations?${params.toString()}`,
                {
                    signal,
                    cache: "force-cache",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result?.message || "Unable to fetch donations."
                );
            }

            const nextDonations =
                result.donations || result.data || [];

            const apiPagination =
                result.pagination || {};

            const totalDonations =
                Number(
                    apiPagination.totalDonations ??
                    apiPagination.total ??
                    apiPagination.count ??
                    0
                );

            const totalPages =
                Number(
                    apiPagination.totalPages ??
                    apiPagination.pages ??
                    0
                );

            const currentPage =
                Number(
                    apiPagination.currentPage ??
                    apiPagination.page ??
                    page
                );

            const perPage =
                Number(
                    apiPagination.perPage ??
                    apiPagination.limit ??
                    20
                );

            const nextPagination = {
                currentPage,
                perPage,
                totalDonations,
                totalPages,
                hasNextPage:
                    Boolean(apiPagination.hasNextPage) ||
                    currentPage < totalPages,
                hasPreviousPage:
                    Boolean(apiPagination.hasPreviousPage) ||
                    currentPage > 1,
            };

            setDonations(nextDonations);
            setPagination(nextPagination);

            donationResponseCache.set(queryKey, {
                createdAt: Date.now(),
                data: nextDonations,
                pagination: nextPagination,
            });
        } catch (err) {
            if (err.name === "AbortError") {
                return;
            }

            console.error(
                "FETCH SAHYOG DONATIONS ERROR:",
                err
            );

            setDonations([]);

            setError(
                err.message ||
                "Unable to load donations. Please try again."
            );
        } finally {
            if (requestId === requestIdRef.current) {
                setLoading(false);
            }
        }
    };

    // ==========================================
    // FETCH WHEN PAGE / SEARCH / FILTER CHANGES
    // ==========================================

    useEffect(() => {
        const controller = new AbortController();

        fetchDonations(controller.signal);

        return () => controller.abort();
    }, [page, search, filters, queryKey]);

    // ==========================================
    // SEARCH
    // ==========================================

    const handleSearch = (e) => {
        e.preventDefault();

        const normalizedSearch = searchInput.trim();

        setPage(1);
        setSearch(normalizedSearch);
    };

    // ==========================================
    // CLEAR SEARCH
    // ==========================================

    const clearSearch = () => {
        setSearchInput("");
        setSearch("");
        setPage(1);
    };

    // ==========================================
    // FILTER CHANGE
    // ==========================================

    const handleFilterChange = (field, value) => {
        setFilters((previous) => {
            const next = {
                ...previous,
                [field]: value,
            };

            // State changed → reset district and tehsil
            if (field === "state") {
                next.district = "";
                next.tehsil = "";
            }

            // District changed → reset tehsil
            if (field === "district") {
                next.tehsil = "";
            }

            return next;
        });

        setPage(1);
    };

    // ==========================================
    // CLEAR FILTERS
    // ==========================================

    const clearFilters = () => {
        setFilters({
            state: "",
            district: "",
            tehsil: "",
        });

        setPage(1);
    };

    // ==========================================
    // CLEAR EVERYTHING
    // ==========================================

    const clearAll = () => {
        setSearchInput("");
        setSearch("");

        setFilters({
            state: "",
            district: "",
            tehsil: "",
        });

        setPage(1);
    };

    // ==========================================
    // ACTIVE FILTER COUNT
    // ==========================================

    const activeFilterCount = useMemo(() => {
        return Object.values(filters).filter(
            (value) =>
                typeof value === "string" &&
                value.trim() !== ""
        ).length;
    }, [filters]);

    const hasSearch = search.trim() !== "";

    const hasActiveSearchOrFilters =
        hasSearch || activeFilterCount > 0;

    // ==========================================
    // PAGINATION NUMBERS
    // ==========================================

    const pageNumbers = useMemo(() => {
        const totalPages = pagination.totalPages;

        if (!totalPages) {
            return [];
        }

        const currentPage = pagination.currentPage;

        if (totalPages <= 7) {
            return Array.from(
                { length: totalPages },
                (_, index) => index + 1
            );
        }

        if (currentPage <= 4) {
            return [
                1,
                2,
                3,
                4,
                5,
                "...",
                totalPages,
            ];
        }

        if (currentPage >= totalPages - 3) {
            return [
                1,
                "...",
                totalPages - 4,
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
            ];
        }

        return [
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages,
        ];
    }, [pagination]);

    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDateTime = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return new Intl.DateTimeFormat(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }
        ).format(parsedDate);
    };

    // ==========================================
    // SAFE VALUES
    // ==========================================

    const getDonor = (row) => row?.donor || null;

    const getLateMember = (row) =>
        row?.lateMember || null;

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Loading animation */}
            <style>{`
        @keyframes loading-slide {
          0% {
            transform: translateX(-105%);
          }

          50% {
            transform: translateX(105%);
          }

          100% {
            transform: translateX(210%);
          }
        }
      `}</style>

            <section className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">

                {/* =====================================
            HEADER
        ===================================== */}

                <div className="mb-6">
                    <div className="flex flex-col gap-4">

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

                            <div>
                                <div className="mb-2">
                                    <Link
                                        to="/sahyog-list"
                                        className="text-sm font-medium text-[var(--ljka-primary)] transition hover:underline"
                                    >
                                        ← Sahyog
                                    </Link>
                                </div>

                                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                    Recent Donations
                                </h1>

                                <p className="mt-1 text-sm text-gray-500">
                                    Verified Sahyog contributions from LJKA members
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* =====================================
            SEARCH + FILTER BAR
        ===================================== */}

                {!loading && (
                    <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

                        <div className="flex flex-col gap-3 lg:flex-row">

                            {/* Search */}

                            <form
                                onSubmit={handleSearch}
                                className="flex min-w-0 flex-1"
                            >
                                <div className="relative flex-1">

                                    <Search
                                        size={19}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="text"
                                        value={searchInput}
                                        onChange={(e) =>
                                            setSearchInput(e.target.value)
                                        }
                                        placeholder="Search by donor, Member ID or late member..."
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-10 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                                    />

                                    {searchInput && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                                            aria-label="Clear search"
                                        >
                                            <X size={17} />
                                        </button>
                                    )}

                                </div>

                                <button
                                    type="submit"
                                    className="ml-2 h-11 rounded-lg bg-gray-900 px-5 text-sm font-medium text-white transition hover:bg-gray-800"
                                >
                                    Search
                                </button>
                            </form>

                            {/* Filter Button */}

                            <button
                                type="button"
                                onClick={() =>
                                    setShowFilters(
                                        (previous) => !previous
                                    )
                                }
                                className={`flex h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition ${showFilters ||
                                        activeFilterCount > 0
                                        ? "border-gray-900 bg-gray-900 text-white"
                                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                <Filter size={17} />

                                Filters

                                {activeFilterCount > 0 && (
                                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-semibold text-gray-900">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>

                        </div>

                        {/* =====================================
                ACTIVE SEARCH / FILTER SUMMARY
            ===================================== */}

                        {hasActiveSearchOrFilters && (
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">

                                <div className="text-xs text-gray-500">

                                    {hasSearch && (
                                        <span>
                                            Search:{" "}
                                            <span className="font-semibold text-gray-800">
                                                {search}
                                            </span>
                                        </span>
                                    )}

                                    {hasSearch &&
                                        activeFilterCount > 0 && (
                                            <span className="mx-2">
                                                •
                                            </span>
                                        )}

                                    {activeFilterCount > 0 && (
                                        <span>
                                            {activeFilterCount} filter
                                            {activeFilterCount > 1
                                                ? "s"
                                                : ""}{" "}
                                            applied
                                        </span>
                                    )}

                                </div>

                                <button
                                    type="button"
                                    onClick={clearAll}
                                    className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
                                >
                                    Clear search & filters
                                </button>

                            </div>
                        )}

                        {/* =====================================
                FILTER PANEL
            ===================================== */}

                        {showFilters && (
                            <div className="mt-4 border-t border-gray-100 pt-4">

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                                    {/* State */}

                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-gray-600">
                                            State
                                        </label>

                                        <select
                                            value={filters.state}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    "state",
                                                    e.target.value
                                                )
                                            }
                                            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-gray-900"
                                        >
                                            <option value="">
                                                All States
                                            </option>

                                            {stateOptions.map(
                                                (state) => (
                                                    <option
                                                        key={state.code}
                                                        value={state.code}
                                                    >
                                                        {state.name}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    {/* District */}

                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-gray-600">
                                            District
                                        </label>

                                        <select
                                            value={filters.district}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    "district",
                                                    e.target.value
                                                )
                                            }
                                            disabled={!filters.state}
                                            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-gray-900 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                                        >
                                            <option value="">
                                                {filters.state
                                                    ? "All Districts"
                                                    : "Select State First"}
                                            </option>

                                            {districtOptions.map(
                                                (district) => (
                                                    <option
                                                        key={district.code}
                                                        value={district.code}
                                                    >
                                                        {district.name}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    {/* Tehsil */}

                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-gray-600">
                                            Tehsil
                                        </label>

                                        <select
                                            value={filters.tehsil}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    "tehsil",
                                                    e.target.value
                                                )
                                            }
                                            disabled={!filters.district}
                                            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-gray-900 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                                        >
                                            <option value="">
                                                {filters.district
                                                    ? "All Tehsils"
                                                    : "Select District First"}
                                            </option>

                                            {tehsilOptions.map(
                                                (tehsil) => (
                                                    <option
                                                        key={tehsil.code}
                                                        value={tehsil.code}
                                                    >
                                                        {tehsil.name}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    {/* Donation Information */}

                                    <div className="flex items-end">
                                        <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs leading-5 text-gray-500">
                                            Showing verified Sahyog
                                            contribution records.
                                        </div>
                                    </div>

                                </div>

                                {activeFilterCount > 0 && (
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
                                        >
                                            Clear all filters
                                        </button>
                                    </div>
                                )}

                            </div>
                        )}

                    </div>
                )}

                {/* =====================================
            ERROR
        ===================================== */}

                {error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <span>{error}</span>

                            <button
                                type="button"
                                onClick={() => {
                                    donationResponseCache.clear();
                                    fetchDonations();
                                }}
                                className="font-semibold underline"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                {/* =====================================
            TABLE
        ===================================== */}

                <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                    {/* Horizontal scroll on small screens */}

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1100px] border-collapse text-left">

                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">

                                    <th className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        S. No.
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Donor ID
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Donor Name
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        District
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Tehsil
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Late Member Name
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Date Donated
                                    </th>

                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {/* Data */}

                                {!loading &&
                                    donations.map((row, index) => {
                                        const donor = getDonor(row);
                                        const lateMember =
                                            getLateMember(row);

                                        const serialNumber =
                                            (pagination.currentPage - 1) *
                                            pagination.perPage +
                                            index +
                                            1;

                                        return (
                                            <tr
                                                key={
                                                    row._id ||
                                                    `${row.donatedAt}-${index}`
                                                }
                                                className="transition hover:bg-gray-50"
                                            >

                                                {/* S.No. */}

                                                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                                                    {serialNumber}
                                                </td>

                                                {/* Donor Member ID */}

                                                <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-gray-900">
                                                    {donor?.memberId || (
                                                        <span className="font-medium text-gray-500">
                                                            Anonymous
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Donor Name */}

                                                <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                                                    {donor?.fullName || (
                                                        <span className="font-medium text-gray-500">
                                                            Anonymous
                                                        </span>
                                                    )}
                                                </td>

                                                {/* District */}

                                                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                                                    {donor?.district || "-"}
                                                </td>

                                                {/* Tehsil */}

                                                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                                                    {donor?.tehsil || "-"}
                                                </td>

                                                {/* Late Member */}

                                                <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                                                    {lateMember?.fullName || "-"}
                                                </td>

                                                {/* Donated At */}

                                                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                                                    {formatDateTime(
                                                        row.donatedAt
                                                    )}
                                                </td>

                                            </tr>
                                        );
                                    })}

                                {/* Empty */}

                                {!loading &&
                                    donations.length === 0 &&
                                    !error && (
                                        <tr>
                                            <td
                                                colSpan="7">
                                                <div className="flex min-h-[320px] items-center justify-center px-6 py-12">
                                                    <div className="max-w-sm text-center">

                                                        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-[var(--ljka-primary-bg)] text-2xl">
                                                            🤝
                                                        </div>

                                                        <h3 className="text-base font-semibold text-gray-900">
                                                            No donations found
                                                        </h3>

                                                        <p className="mt-2 text-sm leading-6 text-gray-500">
                                                            We couldn't find any donations matching your
                                                            search or selected filters.
                                                        </p>

                                                        {hasActiveSearchOrFilters && (
                                                            <button
                                                                type="button"
                                                                onClick={clearAll}
                                                                className="mt-4 text-sm font-semibold text-[var(--ljka-primary)] hover:underline"
                                                            >
                                                                Clear search & filters
                                                            </button>
                                                        )}

                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                            </tbody>
                        </table>
                    </div>

                    {/* =====================================
              LOADING OVERLAY
          ===================================== */}

                    {loading && (
                        <div
                            className="fixed inset-0 z-30 flex items-center justify-center bg-white/90 backdrop-blur-[2px]"
                            aria-live="polite"
                            aria-label="Loading donations"
                        >
                            <div className="flex w-full max-w-sm flex-col items-center px-6 text-center">

                                {/* LJKA Logo */}

                                <div className="relative flex h-20 w-20 items-center justify-center">

                                    <span className="absolute inset-0 rounded-full border border-[var(--ljka-gold)]/30 animate-ping" />

                                    <span className="absolute inset-2 rounded-full border-2 border-[var(--ljka-primary)]/15 border-t-[var(--ljka-gold)] animate-spin" />

                                    <img
                                        src="/img/Lakhdaatar_Logo.png"
                                        alt="LJKA"
                                        className="h-11 w-11 object-contain animate-pulse"
                                    />

                                </div>

                                {/* Loading Text */}

                                <p className="mt-5 text-sm font-semibold text-[var(--ljka-primary)]">
                                    Loading donations
                                    <span className="inline-flex w-8 justify-start text-left">
                                        <span className="animate-bounce [animation-delay:0ms]">
                                            .
                                        </span>

                                        <span className="animate-bounce [animation-delay:150ms]">
                                            .
                                        </span>

                                        <span className="animate-bounce [animation-delay:300ms]">
                                            .
                                        </span>
                                    </span>
                                </p>

                                {/* Progress */}

                                <div className="mt-3 h-1 w-48 max-w-full overflow-hidden rounded-full bg-[var(--ljka-primary-bg)]">
                                    <div className="h-full w-1/2 animate-[loading-slide_1.4s_ease-in-out_infinite] rounded-full bg-[var(--ljka-gold)]" />
                                </div>

                                <p className="mt-3 text-xs text-gray-500">
                                    Bringing the latest Sahyog
                                    contributions into view
                                </p>

                            </div>
                        </div>
                    )}

                    {/* =====================================
              PAGINATION
          ===================================== */}

                    {!loading &&
                        pagination.totalPages > 0 && (
                            <div className="flex flex-col gap-4 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">

                                {/* Result count */}

                                <p className="text-sm text-gray-500">
                                    Showing{" "}

                                    <span className="font-medium text-gray-900">
                                        {donations.length
                                            ? (pagination.currentPage - 1) *
                                            pagination.perPage +
                                            1
                                            : 0}
                                    </span>

                                    {" "}to{" "}

                                    <span className="font-medium text-gray-900">
                                        {Math.min(
                                            pagination.currentPage *
                                            pagination.perPage,
                                            pagination.totalDonations
                                        )}
                                    </span>

                                    {" "}of{" "}

                                    <span className="font-medium text-gray-900">
                                        {pagination.totalDonations}
                                    </span>

                                    {" "}donations
                                </p>

                                {/* Page Controls */}

                                <div className="flex items-center gap-1">

                                    {/* First */}

                                    <button
                                        type="button"
                                        disabled={
                                            !pagination.hasPreviousPage
                                        }
                                        onClick={() => setPage(1)}
                                        className="hidden h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex"
                                        aria-label="First page"
                                    >
                                        <ChevronsLeft size={17} />
                                    </button>

                                    {/* Previous */}

                                    <button
                                        type="button"
                                        disabled={
                                            !pagination.hasPreviousPage
                                        }
                                        onClick={() =>
                                            setPage((previous) =>
                                                Math.max(
                                                    previous - 1,
                                                    1
                                                )
                                            )
                                        }
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        aria-label="Previous page"
                                    >
                                        <ChevronLeft size={17} />
                                    </button>

                                    {/* Page Numbers */}

                                    {pageNumbers.map(
                                        (pageNumber, index) =>
                                            pageNumber === "..." ? (
                                                <span
                                                    key={`ellipsis-${index}`}
                                                    className="flex h-9 w-9 items-center justify-center text-sm text-gray-400"
                                                >
                                                    ...
                                                </span>
                                            ) : (
                                                <button
                                                    key={pageNumber}
                                                    type="button"
                                                    onClick={() =>
                                                        setPage(pageNumber)
                                                    }
                                                    className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition ${pageNumber ===
                                                            pagination.currentPage
                                                            ? "bg-gray-900 text-white"
                                                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            )
                                    )}

                                    {/* Next */}

                                    <button
                                        type="button"
                                        disabled={
                                            !pagination.hasNextPage
                                        }
                                        onClick={() =>
                                            setPage((previous) =>
                                                Math.min(
                                                    previous + 1,
                                                    pagination.totalPages
                                                )
                                            )
                                        }
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        aria-label="Next page"
                                    >
                                        <ChevronRight size={17} />
                                    </button>

                                    {/* Last */}

                                    <button
                                        type="button"
                                        disabled={
                                            !pagination.hasNextPage
                                        }
                                        onClick={() =>
                                            setPage(
                                                pagination.totalPages
                                            )
                                        }
                                        className="hidden h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex"
                                        aria-label="Last page"
                                    >
                                        <ChevronsRight size={17} />
                                    </button>

                                </div>
                            </div>
                        )}

                </div>
            </section>
        </main>
    );
};

export default SahyogDonations;