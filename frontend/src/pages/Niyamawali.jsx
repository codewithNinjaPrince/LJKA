import React from "react";

const rules = [
  {
    number: 1,
    title: "Introduction",
    content: (
      <>
        <p>
          Lakhdatar Jeevan Kalyan Association is a social organization aimed at
          promoting mutual cooperation, human empathy, and a sense of social
          responsibility within society.
        </p>

        <p>
          The primary objective of the organization is to make efforts to
          provide community-based voluntary financial assistance to the family
          or registered nominee of an eligible member in the unfortunate event
          of their death during difficult circumstances.
        </p>

        <p>
          The organization's support system is based on the principle of mutual
          cooperation. Every member contributes in accordance with the
          prescribed system and rules of the association, ensuring that
          assistance can be provided to the families of other eligible members
          when needed.
        </p>

        <p>
          This arrangement is <strong>not</strong> an insurance policy,
          investment plan, dividend scheme, or a scheme for guaranteed
          financial returns.
        </p>
      </>
    ),
  },

  {
    number: 2,
    title: "Objectives of the Organization",
    content: (
      <ul>
        <li>
          To establish a systematic mechanism for delivering community support
          to the family or nominee of eligible members in the event of their
          death.
        </li>
        <li>
          To contribute to social welfare activities—such as education,
          healthcare, environmental protection, disaster relief, and aiding
          individuals in need—based on available resources and constitutional
          objectives.
        </li>
      </ul>
    ),
  },

  {
    number: 3,
    title: "Area of Operation",
    content: (
      <>
        <p>
          <strong>Initial Scope:</strong> The membership, social assistance,
          and public welfare activities of the organization will initially
          operate across various regions of Uttar Pradesh.
        </p>

        <p>
          <strong>Future Expansion:</strong> The organization may expand its
          operations to other states or regions based on administrative
          capacity, available resources, total membership, and applicable
          regulations.
        </p>

        <p>
          <strong>Operational Control:</strong> Operations in any specific
          region remain subject to available resources and rules set by the
          organization.
        </p>
      </>
    ),
  },

  {
    number: 4,
    title: "Eligibility for Membership",
    content: (
      <>
        <p>
          Membership is subject to predefined eligibility criteria and a
          verification process.
        </p>

        <p>
          Applicants must provide accurate personal details, identity proof,
          and required information during registration.
        </p>

        <p>
          Membership obtained on the basis of false, misleading, or forged
          information may be deactivated or terminated post-verification.
        </p>
      </>
    ),
  },

  {
    number: 5,
    title: "Annual Membership Fee",
    content: (
      <>
        <p>
          <strong>Current Fee:</strong> The annual membership fee is set at{" "}
          <strong>₹365</strong>.
        </p>

        <p>
          <strong>Usage:</strong> This fee is utilized for administrative,
          operational expenses, and social welfare activities aligned with the
          organization’s objectives.
        </p>

        <p>
          <strong>Fee Revisions:</strong> The association reserves the right to
          modify the membership fee in the future based on operational needs
          and rules.
        </p>

        <p>
          <strong>No Guarantee:</strong> Paying the annual membership fee of
          ₹365 does not guarantee any fixed death-benefit amount.
        </p>
      </>
    ),
  },

  {
    number: 6,
    title: "Active Membership Status",
    content: (
      <>
        <p>
          A member is considered "active" once their application is approved,
          necessary verification is complete, and the required fee is paid.
        </p>

        <p>
          Members must complete timely renewals and adhere to support rules to
          maintain active status.
        </p>

        <p>
          Membership may be deactivated due to serious rule violations,
          submission of false information, fraud, or failure to renew.
        </p>
      </>
    ),
  },

  {
    number: 7,
    title: "Claim Process for Support",
    content: (
      <>
        <p>
          In the event of a member's death, the registered nominee or eligible
          claimant can submit a claim via the online portal on the
          organization's official website.
        </p>

        <p>
          The claim must include details regarding the death, member details,
          nominee details, and required documents.
        </p>

        <p>
          Official helpline channels may also be used for guidance through the
          claim process.
        </p>

        <p>
          Submitting a claim alone does not automatically guarantee assistance.
        </p>
      </>
    ),
  },

  {
    number: 8,
    title: "Claim Verification and Support Process",
    content: (
      <>
        <p>
          Upon receiving a claim, the association verifies membership status,
          waiting period, contribution history, death documentation, nominee
          details, and other relevant facts.
        </p>

        <p>
          Once a claim is verified and deemed eligible, the association
          initiates a process to collect voluntary contributions from active
          members.
        </p>

        <p>
          Collected funds are disbursed to the eligible nominee or family per
          established guidelines.
        </p>
      </>
    ),
  },

  {
    number: 9,
    title: "Initial Waiting Period — 180 Days (6 Months)",
    content: (
      <>
        <p>
          An initial waiting period (Lock-in Period) of{" "}
          <strong>180 days (6 months)</strong> applies from the start date of
          every new membership.
        </p>

        <p>
          If a member passes away before completing 180 days, eligibility for
          death assistance will be determined under applicable rules and
          conditions.
        </p>

        <p>
          The date of application or fee submission is not considered the
          membership start date until the organization officially approves and
          activates the membership.
        </p>
      </>
    ),
  },

  {
    number: 10,
    title: "Donation Attendance",
    content: (
      <>
        <p>
          Active members are expected to contribute to eligible death-assistance
          cases as part of the mutual cooperation model.
        </p>

        <p>
          A member's "Donation Attendance" percentage is determined by their
          participation in required support cases during a given period.
        </p>

        <p>
          <strong>Example:</strong> If 10 eligible support cases occur in a
          period and a member contributes to 7 of them, their Donation
          Attendance will be 70%.
        </p>
      </>
    ),
  },

  {
    number: 11,
    title: "Minimum Donation Attendance & Support Eligibility",
    content: (
      <>
        <p>
          Members must maintain the minimum required Donation Attendance
          percentage.
        </p>

        <p>
          Falling below the minimum threshold may result in the loss of
          eligibility to apply for death assistance until reinstated under
          organizational rules.
        </p>

        <p>
          <strong>Minimum Required Attendance: 70%</strong>
        </p>

        <p>
          Separate verification may be conducted in cases of technical
          glitches, payment gateway failures, or valid exceptional
          circumstances.
        </p>
      </>
    ),
  },

  {
    number: 12,
    title: "Contribution During the Lock-in Period",
    content: (
      <>
        <p>
          Members are required to participate in the contribution system during
          their 180-day lock-in period.
        </p>

        <p>
          Post lock-in completion, death assistance eligibility relies on active
          status, donation attendance, and compliance with all terms.
        </p>
      </>
    ),
  },

  {
    number: 13,
    title: "Nominee Details",
    content: (
      <>
        <p>Members must register a nominee at the time of joining.</p>

        <p>
          Nominee details are maintained in official records and can be updated
          through prescribed procedures.
        </p>

        <p>
          The identity and eligibility of the nominee will be verified during
          the claim process.
        </p>
      </>
    ),
  },

  {
    number: 14,
    title: "Intimation of Death",
    content: (
      <>
        <p>
          Upon a member's death, the nominee or family must notify the
          organization through official channels as soon as possible.
        </p>

        <p>
          Necessary documentation requested by the organization must accompany
          the notification.
        </p>

        <p>
          Delayed notifications may trigger an investigation based on facts and
          rules.
        </p>
      </>
    ),
  },

  {
    number: 15,
    title: "Required Documents",
    content: (
      <>
        <p>
          Claims require a Death Certificate, member identification, nominee
          identification, bank account details, and other case-specific
          documents.
        </p>

        <p>
          The association reserves the right to request additional verification
          documents.
        </p>
      </>
    ),
  },

  {
    number: 16,
    title: "Verification of Death",
    content: (
      <>
        <p>
          Every death assistance claim undergoes necessary verification.
        </p>

        <p>
          Verification includes checking death certificates, government
          records, medical records, police reports, or administrative
          documentation.
        </p>

        <p>
          Suspicious, incomplete, or disputed claims undergo extended
          verification.
        </p>

        <p>
          No claim is treated as final or approved until verification is fully
          completed.
        </p>
      </>
    ),
  },

  {
    number: 17,
    title: "Death by Suicide",
    content: (
      <>
        <p>
          In cases of death by suicide, assistance eligibility is decided based
          on submitted documents, circumstances, verification, and applicable
          rules.
        </p>

        <p>
          Official police, administrative, and medical records may be
          reviewed.
        </p>

        <p>
          Claims related to suicide are neither automatically approved nor
          automatically rejected; final decisions rest on verification
          results.
        </p>
      </>
    ),
  },

  {
    number: 18,
    title: "Serious Allegations Against Beneficiary/Nominee",
    content: (
      <>
        <p>
          If a member dies under circumstances involving serious criminal
          allegations, legal proceedings, or major disputes against the nominee
          or beneficiary, assistance processing will be suspended until
          legal/official verification concludes.
        </p>

        <p>
          Final decisions will follow available documents and legal outcomes.
        </p>
      </>
    ),
  },

  {
    number: 19,
    title: "Voluntary Contribution",
    content: (
      <>
        <p>
          For eligible cases, the organization requests voluntary
          contributions from active members up to a specified amount.
        </p>

        <p>
          <strong>Current Request Rate: Up to ₹50 per eligible case per active member.</strong>
        </p>

        <p>
          The actual amount collected directly influences the final financial
          assistance delivered to the recipient.
        </p>
      </>
    ),
  },

  {
    number: 20,
    title: "No Guaranteed Assistance Amount",
    content: (
      <>
        <p>
          Membership, annual fee payment, or association standing{" "}
          <strong>does not guarantee</strong> a fixed death benefit amount to
          any member or nominee.
        </p>

        <p>
          Assistance depends on member eligibility, verification, active member
          count, actual contributions collected, and available resources.
        </p>
      </>
    ),
  },

  {
    number: 21,
    title: "Excess or Incorrect Contributions",
    content: (
      <>
        <p>
          If a member accidentally transfers more than the requested amount, or
          if excess funds are paid to a recipient due to technical/human error,
          verification will be conducted.
        </p>

        <p>
          The organization will request the return of excess funds from the
          recipient following verification.
        </p>
      </>
    ),
  },

  {
    number: 22,
    title: "Official Payment Channels Only",
    content: (
      <>
        <p>
          Membership fees and voluntary contributions must only be deposited
          through official payment channels published on the organization’s
          website or app.
        </p>

        <p>
          The organization accepts no liability for payments made to private
          personal accounts or unauthorized channels.
        </p>
      </>
    ),
  },

  {
    number: 23,
    title: "Personal Guarantees by Individuals",
    content: (
      <>
        <p>
          No individual is authorized to promise fixed assistance amounts,
          special benefits, or guaranteed payouts on behalf of the association
          without official approval.
        </p>

        <p>
          Any personal promises made by individuals are non-binding on the
          association.
        </p>
      </>
    ),
  },

  {
    number: 24,
    title: "Misinformation and Fraud",
    content: (
      <>
        <p>
          Submitting false details, forged documents, fake claims, or committing
          fraud will lead to immediate cancellation of membership and claims.
        </p>

        <p>Appropriate legal action may be taken where necessary.</p>
      </>
    ),
  },

  {
    number: 25,
    title: "Termination of Membership",
    content: (
      <p>
        Membership may be deactivated or terminated due to fraud, document
        forgery, severe rule breaches, non-compliance, failure to pay renewal
        fees, or other valid legal grounds.
      </p>
    ),
  },

  {
    number: 26,
    title: "Refund Policy of ₹365 Membership Fee",
    content: (
      <>
        <p>
          The membership fee is generally <strong>non-refundable</strong> as it
          is allocated toward administrative and operational costs.
        </p>

        <p>
          Refunds or adjustments may only be processed under special verified
          conditions such as double payment or technical processing errors.
        </p>
      </>
    ),
  },

  {
    number: 27,
    title: "Official Helpline and Support",
    content: (
      <>
        <p>
          Members should seek assistance exclusively through official
          helplines, emails, or published channels listed on the official
          website.
        </p>

        <p>
          Information obtained outside official channels is not considered
          authorized.
        </p>
      </>
    ),
  },

  {
    number: 28,
    title: "False Claims and Misleading Publicity",
    content: (
      <>
        <p>
          Spreading deliberate falsehoods, misleading claims, or malicious
          information about the organization or its office bearers constitutes
          a violation of rules.
        </p>

        <p>
          Members retain the right to submit genuine grievances, queries, or
          constructive suggestions.
        </p>
      </>
    ),
  },

  {
    number: 29,
    title: "Discipline and Misconduct",
    content: (
      <p>
        Serious misconduct, threats, intentional disruption, or actions harming
        the organization’s operations by members, staff, or officials will
        result in disciplinary action.
      </p>
    ),
  },

  {
    number: 30,
    title: "Member Data and Privacy",
    content: (
      <>
        <p>
          Personal information provided by members is used strictly for
          membership management, identity verification, claim processing,
          communications, and lawful organizational activities.
        </p>

        <p>Data will be protected using appropriate security measures.</p>
      </>
    ),
  },

  {
    number: 31,
    title: "Amendments to Rules",
    content: (
      <>
        <p>
          The association reserves the right to amend, alter, or clarify these
          rules as needed to adapt to administrative requirements, technical
          updates, member interests, or statutory laws.
        </p>

        <p>Updated rules will be published through official channels.</p>
      </>
    ),
  },
];

const Niyamawali = () => {
  return (
    <main className="min-h-screen bg-[var(--ljka-bg)] text-[var(--ljka-text)]">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[var(--ljka-border-light)] bg-white">
        <div className="absolute inset-x-0 top-0 h-1 bg-[var(--ljka-gold)]" />

        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 flex justify-center">
              <img
                src="/img/Lakhdaatar_Logo.png"
                alt="Lakhdaatar Jeevan Kalyan Association"
                className="h-20 w-20 object-contain sm:h-24 sm:w-24"
              />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--ljka-gold)]">
              Official Document
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-[var(--ljka-primary)] sm:text-4xl lg:text-5xl">
              नियमावली
            </h1>

            <p className="mt-2 text-lg font-semibold text-[var(--ljka-primary)]">
              Rules & Regulations
            </p>

            <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-[var(--ljka-gold)]" />

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">
              Lakhdatar Jeevan Kalyan Association — Official Rules and
              Regulations governing membership, mutual support, contributions,
              claims, verification, and related organizational matters.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">

          {/* DESKTOP CONTENT NAV */}
          <aside className="hidden lg:block">
            <div className="sticky top-32 rounded-2xl border border-[var(--ljka-border-light)] bg-white p-4 shadow-sm">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-[var(--ljka-primary)]">
                Contents
              </p>

              <nav className="max-h-[65vh] space-y-1 overflow-y-auto">
                {rules.map((rule) => (
                  <a
                    key={rule.number}
                    href={`#rule-${rule.number}`}
                    className="block rounded-lg px-3 py-2 text-xs font-medium text-[var(--ljka-muted)] transition hover:bg-[var(--ljka-offwhite)] hover:text-[var(--ljka-primary)]"
                  >
                    {rule.number}. {rule.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* RULES */}
          <div className="space-y-4 sm:space-y-5">
            {rules.map((rule) => (
              <article
                key={rule.number}
                id={`rule-${rule.number}`}
                className="scroll-mt-28 overflow-hidden rounded-2xl border border-[var(--ljka-border-light)] bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex">
                  <div className="w-1 shrink-0 bg-[var(--ljka-primary)]" />

                  <div className="flex-1 p-5 sm:p-6 lg:p-7">
                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--ljka-primary)] text-sm font-extrabold text-white">
                        {rule.number}
                      </div>

                      <h2 className="pt-1 text-lg font-extrabold leading-tight text-[var(--ljka-primary)] sm:text-xl">
                        {rule.title}
                      </h2>
                    </div>

                    <div className="mt-5 space-y-3 pl-0 text-sm leading-7 text-[var(--ljka-muted)] sm:text-[15px]">
                      {rule.content}
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {/* DISCLAIMER */}
            <section className="overflow-hidden rounded-2xl border-2 border-[var(--ljka-gold)] bg-[#fffaf0] p-5 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--ljka-primary)] text-white">
                  !
                </div>

                <h2 className="text-xl font-extrabold text-[var(--ljka-primary)]">
                  Important Disclaimer
                </h2>
              </div>

              <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--ljka-muted)] sm:text-[15px]">
                <p>
                  <strong className="text-[var(--ljka-primary)]">
                    Mutual Support Only:
                  </strong>{" "}
                  The death assistance mechanism of Lakhdatar Jeevan Kalyan
                  Association is based purely on mutual voluntary community
                  support. It is not an insurance policy, investment scheme, or
                  guaranteed death-benefit plan.
                </p>

                <p>
                  <strong className="text-[var(--ljka-primary)]">
                    No Fixed Payouts:
                  </strong>{" "}
                  Registration or payment of the ₹365 annual fee does not
                  entitle anyone to a guaranteed sum.
                </p>

                <p>
                  <strong className="text-[var(--ljka-primary)]">
                    Conditional Processing:
                  </strong>{" "}
                  Every claim relies on active membership status, completion of
                  the 180-day waiting period, minimum 70% donation attendance,
                  proper verification, document validity, and actual member
                  contributions received.
                </p>
              </div>
            </section>

            <div className="pt-4 text-center text-xs text-[var(--ljka-muted)]">
              Lakhdatar Jeevan Kalyan Association
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Niyamawali;