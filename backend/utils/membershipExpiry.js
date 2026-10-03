const LAUNCH_GRACE_PERIOD_END = new Date("2026-10-18T23:59:59.999+05:30");
const LAUNCH_PERIOD_EXPIRY = new Date("2027-10-18T23:59:59.999+05:30");

const getMembershipExpiryAt = (activatedAt = new Date()) => {
  const activationDate = new Date(activatedAt);

  if (activationDate <= LAUNCH_GRACE_PERIOD_END) {
    return new Date(LAUNCH_PERIOD_EXPIRY);
  }

  const expiry = new Date(activationDate);
  expiry.setFullYear(expiry.getFullYear() + 1);
  return expiry;
};

export { getMembershipExpiryAt, LAUNCH_GRACE_PERIOD_END };
