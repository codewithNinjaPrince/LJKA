import React, { useEffect, useContext, useMemo, useState } from "react";
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
    occupation: "",
    employmentStatus: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH MEMBERS
  // ==========================================

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.append("page", page);
      params.append("limit", 50);

      if (search.trim()) {
        params.append("search", search.trim());
      }

      Object.entries(filters).forEach(([key, value]) => {
        if (value.trim()) {
          params.append(key, value.trim());
        }
      });

      const response = await fetch(
        `${backendUrl}/api/members?${params.toString()}`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to fetch members"
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
      console.error("FETCH MEMBERS ERROR:", err);

      setMembers([]);

      setError(
        err.message ||
        "Unable to load members. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH WHEN PAGE / SEARCH / FILTER CHANGES
  // ==========================================

  useEffect(() => {
    fetchMembers();
  }, [page, search, filters]);

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = (e) => {
    e.preventDefault();

    setPage(1);
    setSearch(searchInput);
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
    setFilters((previous) => ({
      ...previous,
      [field]: value,
    }));

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
      occupation: "",
      employmentStatus: "",
    });

    setPage(1);
  };

  // ==========================================
  // ACTIVE FILTER COUNT
  // ==========================================

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(
      (value) => value.trim() !== ""
    ).length;
  }, [filters]);

  // ==========================================
  // PAGINATION NUMBERS
  // ==========================================

  const pageNumbers = useMemo(() => {
    const totalPages = pagination.totalPages;

    if (!totalPages) {
      return [];
    }

    const currentPage = pagination.currentPage;

    const pages = [];

    // Small number of pages
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    // Beginning
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    // End
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

    // Middle
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

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date));
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="min-h-screen bg-gray-50">
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
                  {pagination.totalMembers.toLocaleString("en-IN")}
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
                    setSearchInput(e.target.value)
                  }
                  placeholder="Search by name or Member ID..."
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
                setShowFilters((previous) => !previous)
              }
              className={`flex h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition ${showFilters || activeFilterCount > 0
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

                  <input
                    type="text"
                    value={filters.state}
                    onChange={(e) =>
                      handleFilterChange(
                        "state",
                        e.target.value
                      )
                    }
                    placeholder="Enter state"
                    className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-gray-900"
                  />
                </div>

                {/* District */}

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    District
                  </label>

                  <input
                    type="text"
                    value={filters.district}
                    onChange={(e) =>
                      handleFilterChange(
                        "district",
                        e.target.value
                      )
                    }
                    placeholder="Enter district"
                    className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-gray-900"
                  />
                </div>

                {/* Tehsil */}

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Tehsil
                  </label>

                  <input
                    type="text"
                    value={filters.tehsil}
                    onChange={(e) =>
                      handleFilterChange(
                        "tehsil",
                        e.target.value
                      )
                    }
                    placeholder="Enter tehsil"
                    className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-gray-900"
                  />
                </div>

                {/* Occupation */}

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Occupation
                  </label>

                  <input
                    type="text"
                    value={filters.occupation}
                    onChange={(e) =>
                      handleFilterChange(
                        "occupation",
                        e.target.value
                      )
                    }
                    placeholder="Enter occupation"
                    className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-gray-900"
                  />
                </div>

                {/* Employment Status */}

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Employment
                  </label>

                  <select
                    value={filters.employmentStatus}
                    onChange={(e) =>
                      handleFilterChange(
                        "employmentStatus",
                        e.target.value
                      )
                    }
                    className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-900"
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

              {activeFilterCount > 0 && (
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
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

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
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
                    Mobile
                  </th>

                  <th className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600">
                    Member Name
                  </th>

                  <th className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600">
                    Address
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
                    Occupation
                  </th>

                  <th className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600">
                    Registered On
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {/* Loading */}

                {loading &&
                  Array.from({ length: 8 }).map(
                    (_, index) => (
                      <tr key={index}>
                        {Array.from({ length: 10 }).map(
                          (_, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-4 py-4"
                            >
                              <div className="h-4 animate-pulse rounded bg-gray-100" />
                            </td>
                          )
                        )}
                      </tr>
                    )
                  )}

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
                        {member.memberId}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                        {member.mobile || "-"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                        {member.fullName || "-"}
                      </td>

                      <td className="max-w-[280px] px-4 py-4 text-sm text-gray-600">
                        <div
                          className="truncate"
                          title={member.address}
                        >
                          {member.address || "-"}
                        </div>
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
                        {member.occupation || "-"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                        {formatDateTime(
                          member.registeredAt
                        )}
                      </td>
                    </tr>
                  ))}

                {/* Empty */}

                {!loading && members.length === 0 && !error && (
                  <tr>
                    <td
                      colSpan="10"
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
                          Try changing your search or
                          filters.
                        </p>
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

          {!loading && pagination.totalPages > 0 && (
            <div className="flex flex-col gap-4 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-900">
                  {members.length
                    ? (pagination.currentPage - 1) *
                    pagination.perPage +
                    1
                    : 0}
                </span>{" "}
                to{" "}
                <span className="font-medium text-gray-900">
                  {Math.min(
                    pagination.currentPage *
                    pagination.perPage,
                    pagination.totalMembers
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900">
                  {pagination.totalMembers}
                </span>{" "}
                members
              </p>

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
                      Math.max(previous - 1, 1)
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
                    setPage(pagination.totalPages)
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