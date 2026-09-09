import React, {
  useEffect,
  useContext,
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

import { LJKAContext } from "../context/LJKAContext";
import locationData from "../data/india/locationData.json";

const UserList = () => {
  const { backendUrl } = useContext(LJKAContext);

  // ==========================================
  // STATE
  // ==========================================

  const [members, setMembers] = useState([]);

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 50,
    totalMembers: 0,
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
    employmentStatus: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  const [loading, setLoading] = useState(false);
  const requestIdRef = useRef(0);
  const [error, setError] = useState("");

  const formatEmploymentStatus = (value) =>
    String(value || "")
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  // ==========================================
  // LOCATION OPTIONS
  // Same source/structure as KYC
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
      (state) =>
        String(state.code) === String(filters.state)
    );
  }, [stateOptions, filters.state]);

  const districtOptions = useMemo(() => {
    return [...(selectedState?.districts || [])].sort(
      (a, b) =>
        a.name.localeCompare(b.name, undefined, {
          sensitivity: "base",
        })
    );
  }, [selectedState]);

  const selectedDistrict = useMemo(() => {
    return districtOptions.find(
      (district) =>
        String(district.code) ===
        String(filters.district)
    );
  }, [districtOptions, filters.district]);

  const tehsilOptions = useMemo(() => {
    return [...(selectedDistrict?.tehsils || [])].sort(
      (a, b) =>
        a.name.localeCompare(b.name, undefined, {
          sensitivity: "base",
        })
    );
  }, [selectedDistrict]);

  // ==========================================
  // OCCUPATION OPTIONS
  //
  // Since KYC currently accepts free-text occupation,
  // we keep a useful standard list here for filtering.
  //
  // Backend should later provide distinct occupations
  // if you want every existing custom occupation included.
  // ==========================================

  const occupationOptions = [
    "Agriculture",
    "Business",
    "Construction",
    "Education",
    "Engineering",
    "Finance",
    "Healthcare",
    "Homemaker",
    "IT / Software",
    "Manufacturing",
    "Private Job",
    "Government Job",
    "Self-employed",
    "Shopkeeper",
    "Student",
    "Teacher",
    "Other",
  ];

  // ==========================================
  // FETCH MEMBERS
  // ==========================================

  const fetchMembers = async (signal) => {
    const requestId = ++requestIdRef.current;

    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.append("page", String(page));
      params.append("limit", "50");

      if (search.trim()) {
        params.append("search", search.trim());
      }

      Object.entries(filters).forEach(
        ([key, value]) => {
          if (
            typeof value === "string" &&
            value.trim()
          ) {
            params.append(key, value.trim());
          }
        }
      );

      const response = await fetch(
        `${backendUrl}/api/members?${params.toString()}`,
        { signal }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
          "Unable to fetch members"
        );
      }

      setMembers(result.data || []);

      setPagination(
        result.pagination || {
          currentPage: page,
          perPage: 50,
          totalMembers: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      );
    } catch (err) {
      if (err.name === "AbortError") {
        return;
      }

      console.error(
        "FETCH MEMBERS ERROR:",
        err
      );

      setMembers([]);

      setError(
        err.message ||
        "Unable to load members. Please try again."
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

    fetchMembers(controller.signal);

    return () => controller.abort();
  }, [page, search, filters]);

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = (e) => {
    e.preventDefault();

    const normalizedSearch =
      searchInput.trim();

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

  const handleFilterChange = (
    field,
    value
  ) => {
    setFilters((previous) => {
      const next = {
        ...previous,
        [field]: value,
      };

      // State changed:
      // reset District + Tehsil
      if (field === "state") {
        next.district = "";
        next.tehsil = "";
      }

      // District changed:
      // reset Tehsil
      if (field === "district") {
        next.tehsil = "";
      }

      return next;
    });

    setPage(1);
  };

  // ==========================================
  // CLEAR ALL FILTERS
  // ==========================================

  const clearFilters = () => {
    setFilters({
      state: "",
      district: "",
      tehsil: "",
      employmentStatus: "",
    });

    setPage(1);
  };

  // ==========================================
  // CLEAR EVERYTHING
  // Search + Filters
  // ==========================================

  const clearAll = () => {
    setSearchInput("");
    setSearch("");

    setFilters({
      state: "",
      district: "",
      tehsil: "",
      employmentStatus: "",
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
    const totalPages =
      pagination.totalPages;

    if (!totalPages) {
      return [];
    }

    const currentPage =
      pagination.currentPage;

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

    if (
      currentPage >=
      totalPages - 3
    ) {
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
  // RENDER
  // ==========================================

  return (
    <main className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes loading-slide {
          0% { transform: translateX(-105%); }
          50% { transform: translateX(105%); }
          100% { transform: translateX(210%); }
        }
      `}</style>

      <section className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Our Members
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Registered LJKA members
              </p>
            </div>

            {!loading && (
              <div className="text-sm text-gray-500">
                Total Members:{" "}
                <span className="font-semibold text-gray-900">
                  {pagination.totalMembers.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* =====================================
            SEARCH + FILTER BAR
        ===================================== */}

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
                    setSearchInput(
                      e.target.value
                    )
                  }
                  placeholder="Search by name, Member ID or mobile..."
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

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">

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
                    disabled={
                      !filters.state
                    }
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
                    disabled={
                      !filters.district
                    }
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


                {/* Employment Status */}

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Employment
                  </label>

                  <select
                    value={
                      filters.employmentStatus
                    }
                    onChange={(e) =>
                      handleFilterChange(
                        "employmentStatus",
                        e.target.value
                      )
                    }
                    className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-gray-900"
                  >
                    <option value="">
                      All
                    </option>

                    <option value="government">
                      Government
                    </option>

                    <option value="private">
                      Private
                    </option>

                    <option value="business">
                      Business
                    </option>

                    <option value="self-employed">
                      Self-employed
                    </option>

                    <option value="student">
                      Student
                    </option>
                  </select>
                </div>
              </div>

              {/* Filter Actions */}

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

        {/* =====================================
            ERROR
        ===================================== */}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* =====================================
            TABLE
        ===================================== */}

        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {loading && (
            <div
              className="absolute inset-0 z-30 flex items-center justify-center bg-white/95 backdrop-blur-[2px]"
              aria-live="polite"
              aria-label="Loading members"
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
                  Loading members
                  <span className="inline-flex w-8 justify-start text-left">
                    <span className="animate-bounce [animation-delay:0ms]">.</span>
                    <span className="animate-bounce [animation-delay:150ms]">.</span>
                    <span className="animate-bounce [animation-delay:300ms]">.</span>
                  </span>
                </p>

                {/* Progress Bar */}
                <div className="mt-3 h-1 w-48 max-w-full overflow-hidden rounded-full bg-[var(--ljka-primary-bg)]">
                  <div className="h-full w-1/2 animate-[loading-slide_1.4s_ease-in-out_infinite] rounded-full bg-[var(--ljka-gold)]" />
                </div>

                <p className="mt-3 text-xs text-gray-500">
                  Bringing the latest member information into view
                </p>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1250px] border-collapse text-left">

              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">

                  <th className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600">
                    S. No.
                  </th>

                  <th className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600">
                    Member ID
                  </th>

                  <th className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600">
                    Member Name
                  </th>

                  <th className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600">
                    State
                  </th>

                  <th className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600">
                    District
                  </th>

                  <th className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600">
                    Tehsil
                  </th>

                  <th className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600">
                    Employment status
                  </th>

                  <th className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600">
                    Registered On
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {/* Data */}

                {!loading &&
                  members.map((member) => (
                    <tr
                      key={member.memberId}
                      className="transition hover:bg-gray-50"
                    >

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                        {member.serialNo}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-gray-900">
                        {member.memberId || "-"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                        {member.fullName || "-"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                        {member.state || "-"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                        {member.district || "-"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                        {member.tehsil || "-"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                        {member.employmentStatus
                          ? formatEmploymentStatus(member.employmentStatus)
                          : "-"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                        {formatDateTime(
                          member.registeredAt
                        )}
                      </td>

                    </tr>
                  ))}

                {/* Empty */}

                {!loading &&
                  members.length === 0 &&
                  !error && (
                    <tr>
                      <td
                        colSpan="9"
                        className="px-6 py-16 text-center"
                      >
                        <div className="mx-auto max-w-sm">

                          <div className="mb-3 text-3xl">
                            🔎
                          </div>

                          <h3 className="text-base font-semibold text-gray-900">
                            No members found
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            Try changing your search
                            or filters.
                          </p>

                          {hasActiveSearchOrFilters && (
                            <button
                              type="button"
                              onClick={clearAll}
                              className="mt-4 text-sm font-semibold text-gray-900 underline"
                            >
                              Clear search & filters
                            </button>
                          )}

                        </div>
                      </td>
                    </tr>
                  )}

              </tbody>
            </table>
          </div>

          {/* =====================================
              PAGINATION
          ===================================== */}

          {!loading &&
            pagination.totalPages > 0 && (
              <div className="flex flex-col gap-4 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-sm text-gray-500">
                  Showing{" "}

                  <span className="font-medium text-gray-900">
                    {members.length
                      ? (pagination.currentPage -
                        1) *
                      pagination.perPage +
                      1
                      : 0}
                  </span>

                  {" "}to{" "}

                  <span className="font-medium text-gray-900">
                    {Math.min(
                      pagination.currentPage *
                      pagination.perPage,
                      pagination.totalMembers
                    )}
                  </span>

                  {" "}of{" "}

                  <span className="font-medium text-gray-900">
                    {pagination.totalMembers}
                  </span>

                  {" "}members
                </p>

                <div className="flex items-center gap-1">

                  {/* First */}

                  <button
                    type="button"
                    disabled={
                      !pagination.hasPreviousPage
                    }
                    onClick={() =>
                      setPage(1)
                    }
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
                      setPage(
                        (previous) =>
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
                    (
                      pageNumber,
                      index
                    ) =>
                      pageNumber ===
                        "..." ? (
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
                            setPage(
                              pageNumber
                            )
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
                      setPage(
                        (previous) =>
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

export default UserList;