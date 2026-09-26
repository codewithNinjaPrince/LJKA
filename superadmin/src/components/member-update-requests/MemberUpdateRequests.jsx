import { useCallback, useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { adminApi } from "../../services/adminApi.js";
import { LoadingButton, StatusBadge } from "../sahyog/SahyogUi.jsx";

const labels = {
  fullName: "Full Name",
  mobile: "Mobile Number",
  fatherHusbandName: "Father / Husband Name",
  aadhaar: "Aadhaar Number",
  dob: "Date of Birth",
  gender: "Gender",
  occupation: "Occupation",
  employmentStatus: "Employment Status",

  "address.stateName": "State",
  "address.districtName": "District",
  "address.tehsilName": "Tehsil / Sub-District",
  "address.townVillage": "Town / Village / City",
  "address.address": "Address",
  "address.pincode": "PIN Code",

  "nominee.name": "Nominee Name",
  "nominee.mobile": "Nominee Mobile",
  "nominee.email": "Nominee Email",
  "nominee.relationship": "Nominee Relationship",
};

const fields = Object.keys(labels);

const get = (object, path) =>
  path.split(".").reduce(
    (value, key) => value?.[key],
    object
  );

const comparable = (value, field) => {
  if (field === "dob" && value) {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date.toISOString().slice(0, 10);
    }
  }

  return String(value ?? "").trim();
};

const show = (value, field) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "—";
  }

  if (field === "dob") {
    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? String(value)
      : date.toLocaleDateString("en-IN");
  }

  return String(value);
};

const changedFields = (request) =>
  Array.isArray(request.changedFields)
    ? request.changedFields
    : fields.filter(
      (field) =>
        comparable(
          get(request.currentValues, field),
          field
        ) !==
        comparable(
          get(request.requestedChanges, field),
          field
        )
    );

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isReviewed = (request) => {
  const fields = changedFields(request);

  return (
    fields.length > 0 &&
    fields.every(
      (field) =>
        request.fieldReviews?.[field]?.status
    )
  );
};

export default function MemberUpdateRequests({
  token,
  canApprove,
  canReject,
}) {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewing, setReviewing] = useState("");
  const [search, setSearch] = useState("");

  // ---------------------------------------
  // Load Requests
  // ---------------------------------------

  const load = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await adminApi(token).get(
        "/member-update-requests"
      );

      setRequests(response.data.requests || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Could not load member update requests"
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  // ---------------------------------------
  // Search
  // ---------------------------------------

  const visibleRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return requests;

    return requests.filter((request) =>
      [
        request.userId?.fullName,
        request.userId?.memberId,
        request.userId?.email,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query)
        )
    );
  }, [requests, search]);

  // ---------------------------------------
  // Review Individual Field
  // ---------------------------------------

  const reviewField = async (
    requestId,
    field,
    action
  ) => {
    const key = `${requestId}:${field}`;

    if (
      action === "reject" &&
      !window.confirm(
        `Reject the requested change for ${labels[field]}?`
      )
    ) {
      return;
    }

    setReviewing(key);

    try {
      await adminApi(token).patch(
        `/member-update-requests/${requestId}/fields/${encodeURIComponent(
          field
        )}/${action}`
      );

      toast.success(
        `${labels[field]} ${action === "approve"
          ? "approved"
          : "rejected"
        }`
      );

      await load();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        `Could not ${action} field`
      );
    } finally {
      setReviewing("");
    }
  };

  // ---------------------------------------
  // Review Entire Request
  // ---------------------------------------

  const reviewAll = async (
    requestId,
    action
  ) => {
    const verb =
      action === "approve"
        ? "Approve"
        : "Reject";

    if (
      !window.confirm(
        `${verb} every changed field in this request?`
      )
    ) {
      return;
    }

    setReviewing(`${requestId}:all`);

    try {
      await adminApi(token).patch(
        `/member-update-requests/${requestId}/${action}`
      );

      toast.success(
        action === "approve"
          ? "All requested details approved"
          : "All requested details rejected"
      );

      await load();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        `Could not ${action} request`
      );
    } finally {
      setReviewing("");
    }
  };

  // ---------------------------------------
  // Loading
  // ---------------------------------------

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#78081c]" />

        <p className="text-sm font-medium text-slate-600">
          Loading member update requests…
        </p>
      </div>
    );
  }

  // ---------------------------------------
  // UI
  // ---------------------------------------

  return (
    <div className="space-y-6">

      {/* =====================================
          PAGE HEADER
      ====================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-[#5a0615] sm:text-2xl">
                  Member Update Requests
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Review and approve changes submitted by members.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-amber-50 px-4 py-2">
            <span className="text-xs font-medium uppercase tracking-wide text-amber-400">
              Total Requests
            </span>

            <p className="mt-0.5 text-lg font-bold text-amber-800">
              {requests.length}
            </p>
          </div>

          {/* Search */}

          <div className="w-full sm:w-80">
            <label className="relative block">
              <span className="sr-only">
                Search member update requests
              </span>

              <FaSearch
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400"
                aria-hidden="true"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search member or ID"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-[#78081c] focus:ring-2 focus:ring-[#78081c]/10"
              />
            </label>
          </div>
        </div>
      </div>

      {/* =====================================
          REQUEST LIST
      ====================================== */}

      <div className="space-y-5">

        {visibleRequests.map((request) => {
          const requestedFields =
            changedFields(request);

          const reviewed = isReviewed(request);

          return (
            <article
              key={request._id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >

              {/* =================================
                  MEMBER HEADER
              ================================= */}

              <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-5 py-5 sm:px-6">

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                  <div className="flex min-w-0 items-center gap-4">

                    {/* Avatar */}

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#78081c] text-lg font-bold text-white">
                      {String(
                        request.userId?.fullName ||
                        "U"
                      )
                        .trim()
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">

                      <h3 className="truncate text-base font-bold uppercase text-[#5a0615] sm:text-lg">
                        {request.userId?.fullName ||
                          "Unknown Member"}
                      </h3>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">

                        <span className="font-semibold text-slate-700">
                          {request.userId?.memberId ||
                            "No Member ID"}
                        </span>

                        {request.userId?.email && (
                          <>
                            <span>•</span>

                            <span className="break-all">
                              {request.userId.email}
                            </span>
                          </>
                        )}

                      </div>
                    </div>
                  </div>

                  {/* Request Meta */}

                  <div className="flex shrink-0 flex-wrap items-center gap-2">

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${reviewed
                          ? "bg-slate-100 text-slate-600"
                          : "bg-amber-100 text-amber-700"
                        }`}
                    >
                      {reviewed
                        ? "REVIEWED"
                        : "PENDING REVIEW"}
                    </span>

                    <span className="rounded-full bg-[#78081c]/10 px-3 py-1.5 text-xs font-bold text-[#78081c]">
                      {requestedFields.length}{" "}
                      CHANGE
                      {requestedFields.length === 1
                        ? ""
                        : "S"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span>
                    Submitted
                  </span>

                  <span className="font-medium text-slate-600">
                    {formatDate(
                      request.submittedAt
                    )}
                  </span>
                </div>
              </div>

              {/* =================================
                  CHANGED FIELDS
              ================================= */}

              <div className="p-4 sm:p-6">

                <div className="mb-4 flex items-center justify-between">

                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wide text-slate-700">
                      Requested Changes
                    </h4>

                    <p className="mt-1 text-xs text-slate-400">
                      Compare the existing value with the member's requested value.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">

                  {requestedFields.map((field) => {
                    const review =
                      request.fieldReviews?.[field];

                    const key = `${request._id}:${field}`;

                    return (
                      <section
                        key={field}
                        className="overflow-hidden rounded-xl border border-slate-200"
                      >

                        {/* Field Header */}

                        <div className="flex flex-col gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

                          <div className="flex items-center gap-2">

                            <span className="h-2 w-2 rounded-full bg-[#78081c]" />

                            <h5 className="text-sm font-bold text-slate-800">
                              {labels[field] ||
                                field}
                            </h5>
                          </div>

                          {review && (
                            <StatusBadge
                              value={
                                review.status
                              }
                            />
                          )}
                        </div>

                        {/* Comparison */}

                        <div className="grid md:grid-cols-2">

                          {/* Current */}

                          <div className="border-b border-slate-100 p-4 md:border-b-0 md:border-r">

                            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              Current Value
                            </p>

                            <div className="min-h-12 rounded-lg bg-slate-50 px-3 py-3 text-sm text-slate-700">
                              <span className="break-words">
                                {show(
                                  get(
                                    request.currentValues,
                                    field
                                  ),
                                  field
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Requested */}

                          <div className="p-4">

                            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-amber-600">
                              Requested Value
                            </p>

                            <div className="min-h-12 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm font-semibold text-slate-900">
                              <span className="break-words">
                                {show(
                                  get(
                                    request.requestedChanges,
                                    field
                                  ),
                                  field
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Field Actions */}

                        {!review && (
                          <div className="flex flex-col gap-2 border-t border-slate-100 bg-white px-4 py-3 sm:flex-row sm:justify-end">

                            {canReject && (
                              <LoadingButton
                                loading={
                                  reviewing ===
                                  key
                                }
                                onClick={() =>
                                  reviewField(
                                    request._id,
                                    field,
                                    "reject"
                                  )
                                }
                                className="rounded-lg border border-rose-200 bg-white px-4 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-50"
                              >
                                REJECT
                              </LoadingButton>
                            )}

                            {canApprove && (
                              <LoadingButton
                                loading={
                                  reviewing ===
                                  key
                                }
                                onClick={() =>
                                  reviewField(
                                    request._id,
                                    field,
                                    "approve"
                                  )
                                }
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                              >
                                APPROVE
                              </LoadingButton>
                            )}
                          </div>
                        )}
                      </section>
                    );
                  })}

                  {!requestedFields.length && (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                      <p className="text-sm font-medium text-slate-500">
                        No changed fields were found in this request.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* =================================
                  REQUEST ACTION BAR
              ================================= */}

              {!reviewed &&
                requestedFields.length > 0 && (
                  <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                      <div>
                        <p className="text-sm font-bold text-slate-700">
                          Review entire request
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          Apply the same decision to all changed fields.
                        </p>
                      </div>

                      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">

                        {canReject && (
                          <LoadingButton
                            loading={
                              reviewing ===
                              `${request._id}:all`
                            }
                            onClick={() =>
                              reviewAll(
                                request._id,
                                "reject"
                              )
                            }
                            className="rounded-lg border border-rose-300 bg-white px-5 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-50"
                          >
                            REJECT ALL
                          </LoadingButton>
                        )}

                        {canApprove && (
                          <LoadingButton
                            loading={
                              reviewing ===
                              `${request._id}:all`
                            }
                            onClick={() =>
                              reviewAll(
                                request._id,
                                "approve"
                              )
                            }
                            className="rounded-lg bg-[#78081c] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#5a0615]"
                          >
                            APPROVE ALL
                          </LoadingButton>
                        )}
                      </div>
                    </div>
                  </div>
                )}
            </article>
          );
        })}
      </div>

      {/* =====================================
          EMPTY STATE
      ====================================== */}

      {!visibleRequests.length && (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
            {requests.length ? "🔍" : "✓"}
          </div>

          <h3 className="mt-4 text-base font-bold text-slate-800">
            {requests.length
              ? "No matching requests"
              : "No pending member update requests"}
          </h3>

          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            {requests.length
              ? "Try searching with another member name, member ID or email address."
              : "There are currently no member profile changes waiting for review."}
          </p>

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              CLEAR SEARCH
            </button>
          )}
        </div>
      )}
    </div>
  );
}