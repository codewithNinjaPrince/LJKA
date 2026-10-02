import React, { useState } from "react";

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
          <strong>Current Fee:</strong> The first <strong>1,100 members</strong>
          pay an annual membership fee of <strong>₹251</strong>. The annual
          membership fee for members after the first 1,100 is <strong>₹365</strong>.
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

const hindiRules = [
  ["परिचय", "लखदातार जीवन कल्याण एसोसिएशन एक सामाजिक संस्था है, जिसका उद्देश्य समाज में पारस्परिक सहयोग, मानवीय संवेदना और सामाजिक उत्तरदायित्व को बढ़ावा देना है।", "पात्र सदस्य की मृत्यु होने पर उसके परिवार अथवा पंजीकृत नामांकित व्यक्ति तक सामुदायिक एवं स्वैच्छिक आर्थिक सहयोग पहुंचाने का प्रयास किया जाता है। यह बीमा, निवेश, लाभांश अथवा निश्चित आर्थिक लाभ की योजना नहीं है।"],
  ["संस्था का उद्देश्य", "संस्था पात्र सदस्यों की मृत्यु की स्थिति में उनके परिवार अथवा नामांकित व्यक्ति तक सामुदायिक सहयोग पहुंचाने की व्यवस्थित व्यवस्था करती है।", "उपलब्ध संसाधनों और संवैधानिक उद्देश्यों के अनुरूप शिक्षा, स्वास्थ्य, पर्यावरण संरक्षण, आपदा राहत और अन्य सामाजिक कल्याण कार्यों में भी योगदान किया जा सकता है।"],
  ["कार्य क्षेत्र", "सदस्यता, सामाजिक सहायता और जनकल्याण संबंधी गतिविधियां प्रारंभ में उत्तर प्रदेश के विभिन्न क्षेत्रों में संचालित होंगी।", "प्रशासनिक क्षमता, संसाधनों, सदस्य संख्या और लागू नियमों के अनुसार कार्यक्षेत्र अन्य राज्यों अथवा क्षेत्रों तक बढ़ाया जा सकता है।"],
  ["सदस्यता की पात्रता", "सदस्यता निर्धारित पात्रता और सत्यापन प्रक्रिया के अधीन होगी। आवेदन के समय सही व्यक्तिगत जानकारी, पहचान विवरण और आवश्यक दस्तावेज देना आवश्यक है।", "गलत, भ्रामक अथवा जाली जानकारी के आधार पर प्राप्त सदस्यता सत्यापन के बाद निष्क्रिय या समाप्त की जा सकती है।"],
  ["वार्षिक सदस्यता शुल्क", "पहले 1,100 सदस्यों के लिए वार्षिक सदस्यता शुल्क ₹251 है। उसके बाद नए सदस्यों के लिए वार्षिक सदस्यता शुल्क ₹365 है।", "शुल्क का उपयोग प्रशासन, संचालन और संस्था के उद्देश्यों के अनुरूप सामाजिक कार्यों में किया जा सकता है। शुल्क में भविष्य में परिवर्तन किया जा सकता है और इससे किसी निश्चित मृत्यु-सहायता राशि की गारंटी नहीं मिलती।"],
  ["सदस्यता का सक्रिय रहना", "सदस्यता स्वीकृत होने, आवश्यक सत्यापन पूरा होने और निर्धारित शुल्क जमा होने के बाद सदस्य सक्रिय माना जाएगा।", "सक्रिय सदस्यता के लिए समय पर नवीनीकरण और संस्था के सहयोग संबंधी नियमों का पालन आवश्यक है।"],
  ["सहायता के लिए दावा प्रक्रिया", "सदस्य की मृत्यु होने पर पंजीकृत नामांकित व्यक्ति अथवा पात्र व्यक्ति ऑनलाइन दावा पोर्टल से सहायता के लिए दावा प्रस्तुत कर सकता है।", "दावे में मृत्यु, सदस्य, नामांकित व्यक्ति और आवश्यक दस्तावेजों की जानकारी देनी होगी। केवल दावा प्रस्तुत करने से सहायता की पात्रता स्वतः निश्चित नहीं होती।"],
  ["दावा सत्यापन एवं सहयोग प्रक्रिया", "दावा मिलने पर सदस्यता स्थिति, प्रतीक्षा अवधि, सहयोग उपस्थिति, मृत्यु दस्तावेज और अन्य तथ्यों का सत्यापन किया जा सकता है।", "पात्रता और सत्यापन पूरा होने पर सक्रिय सदस्यों से स्वैच्छिक सहयोग प्राप्त करने की प्रक्रिया शुरू की जा सकती है।"],
  ["प्रारंभिक प्रतीक्षा अवधि - 180 दिन", "हर नई सदस्यता की शुरुआत से 180 दिन (6 माह) की प्रारंभिक प्रतीक्षा अवधि लागू होगी।", "आवेदन या शुल्क जमा करने की तारीख सदस्यता प्रारंभ होने की तारीख नहीं होगी, जब तक संस्था सदस्यता को स्वीकृत और सक्रिय न कर दे।"],
  ["सहयोग उपस्थिति", "प्रत्येक सक्रिय सदस्य से पात्र सहायता प्रकरणों में निर्धारित सहयोग करने की अपेक्षा की जाती है।", "सहयोग उपस्थिति प्रतिशत सदस्य द्वारा अपेक्षित प्रकरणों में किए गए सहयोग के आधार पर निर्धारित हो सकता है; जैसे 10 में से 7 सहयोग करने पर 70%।"],
  ["न्यूनतम सहयोग उपस्थिति एवं सहायता पात्रता", "सदस्य को निर्धारित न्यूनतम सहयोग उपस्थिति बनाए रखनी होगी।", "न्यूनतम आवश्यक प्रतिशत 70% है। इससे कम होने पर मृत्यु-सहायता के लिए आवेदन की पात्रता प्रभावित हो सकती है।"],
  ["लॉक-इन अवधि में सहयोग", "180 दिन की प्रारंभिक प्रतीक्षा अवधि में भी सदस्य को निर्धारित सहयोग व्यवस्था में भाग लेना होगा।", "लॉक-इन पूरा होने के बाद पात्रता के लिए सक्रिय सदस्यता, सहयोग उपस्थिति और अन्य शर्तें देखी जाएंगी।"],
  ["नामांकित व्यक्ति", "प्रत्येक सदस्य को सदस्यता लेते समय अपना नामांकित व्यक्ति दर्ज करना चाहिए।", "नामांकित व्यक्ति की जानकारी रिकॉर्ड में रखी जा सकती है और आवश्यकता होने पर निर्धारित प्रक्रिया से बदली जा सकती है।"],
  ["मृत्यु की सूचना", "सदस्य की मृत्यु होने पर नामांकित व्यक्ति, परिवार अथवा संबंधित व्यक्ति को संस्था के आधिकारिक माध्यम से यथाशीघ्र सूचना देनी चाहिए।", "सूचना के साथ आवश्यक दस्तावेज देने होंगे; देरी से सूचना मिलने पर संस्था जांच कर सकती है।"],
  ["आवश्यक दस्तावेज", "सहायता दावे के लिए मृत्यु प्रमाण-पत्र, सदस्य और नामांकित व्यक्ति की पहचान, बैंक खाते की जानकारी तथा परिस्थिति के अनुसार अन्य दस्तावेज मांगे जा सकते हैं।"],
  ["मृत्यु का सत्यापन", "हर मृत्यु-सहायता दावे का आवश्यक सत्यापन किया जा सकता है, जिसमें मृत्यु प्रमाण-पत्र, सरकारी, चिकित्सा, पुलिस अथवा प्रशासनिक अभिलेख देखे जा सकते हैं।", "संदिग्ध, अपूर्ण या विवादित दावों में अतिरिक्त सत्यापन किया जा सकता है और पूरा सत्यापन होने तक दावा अंतिम रूप से स्वीकृत नहीं माना जाएगा।"],
  ["आत्महत्या से मृत्यु", "आत्महत्या से संबंधित मामले में सहायता पात्रता उपलब्ध दस्तावेजों, परिस्थितियों, सत्यापन और लागू नियमों के आधार पर तय होगी।", "ऐसे दावे स्वतः स्वीकृत अथवा अस्वीकृत नहीं होते।"],
  ["लाभार्थी अथवा नामांकित व्यक्ति के विरुद्ध गंभीर आरोप", "मृत्यु से जुड़े गंभीर आरोप, आपराधिक कार्यवाही या महत्वपूर्ण विवाद होने पर संस्था सहायता प्रक्रिया को सत्यापन पूरा होने तक रोक सकती है।"],
  ["स्वैच्छिक सहयोग", "पात्र मृत्यु-सहायता प्रकरण में सक्रिय सदस्यों से निर्धारित राशि तक स्वैच्छिक सहयोग का अनुरोध किया जा सकता है।", "वर्तमान व्यवस्था के अनुसार प्रति पात्र प्रकरण सदस्य से ₹50 तक सहयोग का अनुरोध किया जा सकता है।"],
  ["निश्चित सहायता राशि की गारंटी नहीं", "सदस्यता अथवा वार्षिक शुल्क जमा करने से किसी सदस्य या नामांकित व्यक्ति को किसी निश्चित मृत्यु-सहायता राशि की गारंटी नहीं मिलती।", "सहायता पात्रता, सत्यापन, सक्रिय सदस्यों की संख्या, प्राप्त सहयोग और उपलब्ध संसाधनों पर निर्भर करेगी।"],
  ["गलत अथवा अतिरिक्त सहयोग राशि", "गलती से अधिक राशि भेजे जाने अथवा त्रुटि से अधिक भुगतान होने पर संस्था उपलब्ध अभिलेखों के आधार पर सत्यापन कर सकती है।", "सत्यापन के बाद अतिरिक्त राशि वापस करने का अनुरोध किया जा सकता है।"],
  ["केवल आधिकारिक भुगतान माध्यम", "सदस्यता शुल्क और सहयोग राशि केवल संस्था द्वारा वेबसाइट, आवेदन प्रणाली या अन्य आधिकारिक माध्यमों पर प्रकाशित भुगतान माध्यम से ही जमा की जाए।", "निजी खाते अथवा अनधिकृत माध्यम में भेजी गई राशि के लिए संस्था जिम्मेदार नहीं होगी।"],
  ["संस्था की ओर से व्यक्तिगत वादे", "आधिकारिक अनुमति के बिना कोई व्यक्ति संस्था की ओर से निश्चित सहायता राशि, विशेष लाभ या भुगतान का वादा नहीं कर सकता।", "ऐसे व्यक्तिगत वादे संस्था की आधिकारिक प्रतिबद्धता नहीं माने जाएंगे।"],
  ["गलत जानकारी एवं धोखाधड़ी", "गलत जानकारी, जाली दस्तावेज, झूठा दावा अथवा धोखाधड़ी का प्रमाण मिलने पर संस्था संबंधित सदस्यता अथवा दावा रद्द कर सकती है।", "आवश्यक होने पर लागू कानूनों के अनुसार उचित कार्रवाई की जा सकती है।"],
  ["सदस्यता समाप्ति", "धोखाधड़ी, जाली दस्तावेज, गंभीर नियम उल्लंघन, आवश्यक शर्तों का पालन न करना या शुल्क का नवीनीकरण न करने जैसे वैध कारणों से सदस्यता निष्क्रिय अथवा समाप्त की जा सकती है।"],
  ["सदस्यता शुल्क की वापसी", "सदस्यता शुल्क सामान्यतः वापसी योग्य नहीं होगा क्योंकि इसका उपयोग संचालन, प्रशासन और संस्था की गतिविधियों में किया जाता है।", "दोहरे भुगतान, तकनीकी त्रुटि या सत्यापित विशेष परिस्थिति में उचित प्रक्रिया से समायोजन अथवा वापसी की जा सकती है।"],
  ["आधिकारिक हेल्पलाइन एवं सहायता", "सदस्य सहायता के लिए वेबसाइट पर उपलब्ध आधिकारिक हेल्पलाइन, ई-मेल, संदेश सेवा या अन्य प्रकाशित संचार माध्यमों का उपयोग कर सकते हैं।", "केवल आधिकारिक माध्यमों से प्राप्त जानकारी ही अधिकृत मानी जाएगी।"],
  ["झूठी जानकारी एवं भ्रामक प्रचार", "संस्था, उसके कार्यों, सहायता व्यवस्था अथवा पदाधिकारियों के संबंध में जानबूझकर झूठी, भ्रामक या दुर्भावनापूर्ण जानकारी फैलाना नियमों का उल्लंघन है।", "वास्तविक शिकायत, प्रश्न और वैध सुझाव देने का सदस्य का अधिकार सुरक्षित है।"],
  ["अनुशासन एवं दुराचार", "गंभीर दुर्व्यवहार, धमकी, जानबूझकर बाधा उत्पन्न करना या संस्था की कार्यप्रणाली को नुकसान पहुंचाने वाला आचरण अनुशासनात्मक कार्रवाई का आधार बन सकता है।"],
  ["सदस्य की जानकारी एवं गोपनीयता", "सदस्य की व्यक्तिगत जानकारी का उपयोग सदस्यता, पहचान सत्यापन, दावा प्रक्रिया, सहायता व्यवस्था, संचार और संस्था के वैध कार्यों के लिए किया जा सकता है।", "संस्था जानकारी की सुरक्षा के लिए उचित उपाय करने का प्रयास करेगी।"],
  ["नियमों में संशोधन", "संस्था आवश्यकता, अनुभव, प्रशासनिक व्यवस्था, तकनीकी परिवर्तन, सदस्य हित और लागू कानूनों के अनुसार नियमावली में संशोधन, परिवर्तन अथवा स्पष्टीकरण कर सकती है।", "संशोधित नियम आधिकारिक माध्यम से प्रकाशित किए जा सकते हैं।"],
].map(([title, ...content], index) => ({ number: index + 1, title, content }));

const Niyamawali = () => {
  const [language, setLanguage] = useState("hindi");
  const activeRules = language === "hindi" ? hindiRules : rules;

  return (
    <main className="min-h-screen bg-[var(--ljka-bg)] text-[var(--ljka-text)]">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[var(--ljka-border-light)] bg-white">
        <div className="absolute inset-x-0 top-0 h-1 bg-[var(--ljka-gold)]" />

        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 flex justify-center">
              <img
                src="/img/Lakhdatar_Logo.png"
                alt="Lakhdatar Jeevan Kalyan Association"
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

            <div className="mt-7 inline-flex rounded-xl border border-[var(--ljka-border-light)] bg-[var(--ljka-offwhite)] p-1">
              <button
                type="button"
                onClick={() => setLanguage("hindi")}
                className={`rounded-lg px-5 py-2 text-sm font-bold transition ${language === "hindi" ? "bg-[var(--ljka-primary)] text-white shadow-sm" : "text-[var(--ljka-primary)]"}`}
                aria-pressed={language === "hindi"}
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => setLanguage("english")}
                className={`rounded-lg px-5 py-2 text-sm font-bold transition ${language === "english" ? "bg-[var(--ljka-primary)] text-white shadow-sm" : "text-[var(--ljka-primary)]"}`}
                aria-pressed={language === "english"}
              >
                English
              </button>
            </div>
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
                {activeRules.map((rule) => (
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
            {activeRules.map((rule) => (
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
                      {Array.isArray(rule.content) ? rule.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : rule.content}
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
                  {language === "hindi" ? "महत्वपूर्ण सूचना" : "Important Disclaimer"}
                </h2>
              </div>

              <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--ljka-muted)] sm:text-[15px]">
                {language === "hindi" ? <>
                  <p><strong className="text-[var(--ljka-primary)]">पारस्परिक सहयोग:</strong> संस्था की मृत्यु-सहायता व्यवस्था स्वैच्छिक सामुदायिक सहयोग पर आधारित है; यह बीमा, निवेश या निश्चित लाभ की योजना नहीं है।</p>
                  <p><strong className="text-[var(--ljka-primary)]">निश्चित सहायता नहीं:</strong> सदस्यता अथवा वार्षिक शुल्क जमा करने से किसी निश्चित सहायता राशि की गारंटी नहीं मिलती।</p>
                  <p><strong className="text-[var(--ljka-primary)]">पात्रता:</strong> प्रत्येक मामले में सक्रिय सदस्यता, 180 दिन की प्रतीक्षा अवधि, न्यूनतम 70% सहयोग उपस्थिति, दस्तावेज और सत्यापन देखा जाएगा।</p>
                </> : <>
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
                  Registration or payment of the applicable annual fee does not
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
                </>}
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
