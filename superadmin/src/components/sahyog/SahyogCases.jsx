import { useCallback, useEffect, useMemo, useState } from "react";
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

export default function MemberUpdateRequests({
  token,
  canApprove,
  canReject,
}) {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewing, setReviewing] = useState("");
  const [search, setSearch] = useState("");

  // ----------------------------------------
  // Load
  // ----------------------------------------

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

  // ----------------------------------------
  // Search
  // ----------------------------------------

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

  // ----------------------------------------
  // Individual Field Review
  // ----------------------------------------

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
        `${labels[field]} ${
          action === "approve"
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

  // ----------------------------------------
  // Whole Request Review
  // ----------------------------------------

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

  // ----------------------------------------
  // Loading
  // ----------------------------------------

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center text-slate-500">
        Loading member update requests…
      </div>
    );
  }

  // ----------------------------------------
  // UI
  // ----------------------------------------

  return (
    <>
      {/* Header */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#5a0615]">
            Member Update Requests
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review changes submitted by members.
          </p>
        </div>

        <input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search member or ID"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#78081c] focus:ring-2 focus:ring-[#78081c]/10 sm:w-80"
        />
      </div>

      {/* Requests */}

      <div className="grid gap-4">
        {visibleRequests.map((request) => {
          const requestedFields =
            changedFields(request);

          return (
            <article
              key={request._id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              {/* Member Header */}

              <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold uppercase text-[#5a0615]">
                    {request.userId?.fullName ||
                      "Unknown Member"}
                  </h3>

                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500">
                    <span>
                      {request.userId?.memberId ||
                        "—"}
                    </span>

                    {request.userId?.email && (
                      <span>
                        {request.userId.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs text-slate-400">
                    Submitted
                  </p>

                  <p className="text-sm text-slate-600">
                    {request.submittedAt
                      ? new Date(
                          request.submittedAt
                        ).toLocaleString("en-IN")
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Changed Fields */}

              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-700">
                    Requested Changes
                  </h4>

                  <span className="text-xs text-slate-500">
                    {requestedFields.length} field
                    {requestedFields.length === 1
                      ? ""
                      : "s"}
                  </span>
                </div>

                {requestedFields.length ? (
                  <div className="overflow-hidden rounded-lg border">
                    <div className="hidden grid-cols-[180px_1fr_1fr_170px] border-b bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
                      <div className="p-3">
                        Field
                      </div>

                      <div className="p-3">
                        Current
                      </div>

                      <div className="p-3">
                        Requested
                      </div>

                      <div className="p-3 text-right">
                        Action
                      </div>
                    </div>

                    {requestedFields.map(
                      (field) => {
                        const review =
                          request.fieldReviews?.[
                            field
                          ];

                        const key = `${request._id}:${field}`;

                        return (
                          <div
                            key={field}
                            className="grid gap-3 border-b p-4 last:border-b-0 md:grid-cols-[180px_1fr_1fr_170px] md:items-center"
                          >
                            {/* Field */}

                            <div>
                              <p className="text-sm font-semibold text-slate-700">
                                {labels[field] ||
                                  field}
                              </p>
                            </div>

                            {/* Current */}

                            <div>
                              <p className="mb-1 text-xs text-slate-400 md:hidden">
                                CURRENT
                              </p>

                              <div className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
                                {show(
                                  get(
                                    request.currentValues,
                                    field
                                  ),
                                  field
                                )}
                              </div>
                            </div>

                            {/* Requested */}

                            <div>
                              <p className="mb-1 text-xs text-amber-600 md:hidden">
                                REQUESTED
                              </p>

                              <div className="rounded-md bg-amber-50 px-3 py-2 text-sm font-medium text-slate-800">
                                {show(
                                  get(
                                    request.requestedChanges,
                                    field
                                  ),
                                  field
                                )}
                              </div>
                            </div>

                            {/* Action */}

                            <div className="flex items-center justify-start gap-2 md:justify-end">
                              {review ? (
                                <StatusBadge
                                  value={
                                    review.status
                                  }
                                />
                              ) : (
                                <>
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
                                      className="rounded-md bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                                    >
                                      Approve
                                    </LoadingButton>
                                  )}

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
                                      className="rounded-md border border-rose-300 bg-white px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50"
                                    >
                                      Reject
                                    </LoadingButton>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-5 text-center text-sm text-slate-500">
                    No changed fields found.
                  </div>
                )}
              </div>

              {/* Whole Request Actions */}

              {requestedFields.length > 0 && (
                <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">
                    Review all changes at once
                  </p>

                  <div className="flex gap-2">
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
                        className="rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                      >
                        Reject All
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
                        className="rounded-lg bg-[#78081c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5a0615]"
                      >
                        Approve All
                      </LoadingButton>
                    )}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Empty */}

      {!visibleRequests.length && (
        <div className="rounded-xl border bg-white p-8 text-center text-slate-500">
          {requests.length
            ? "No requests match your search."
            : "No pending member update requests."}
        </div>
      )}
    </>
  );
}