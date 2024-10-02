import { createFileRoute } from '@tanstack/react-router';
import { Message } from '~myjournai/chat-client';
import { BackNav } from './-back-nav';
import { useEffect } from 'react';

export const Route = createFileRoute('/_public/terms')({
  component: () => {
    useEffect(() => {
      localStorage.setItem('isStartScreenShown', 'false');
    }, []);
    const privacyPolicy = `
**Terms of Service**

_Last Updated: September 16, 2024_

---

**1. Acceptance of Terms**

1.1 **Terms of Service.** These Terms of Service (these “**Terms of Service**”) govern your access and use of (i) the web application available at **myjournai.app** (together with any successor site, the “**Site**”), (ii) the related mobile application (the “**Mobile App**”), and (iii) all services, content, tools, features, and functionalities offered on or through the Site and Mobile App (collectively, the “**Service**”), which are provided by or on behalf of **Journai Inc.** (the “**Company**,” “**we**,” or “**us**”). By accepting these Terms of Service or by accessing or otherwise using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.

1.2 **User.** For purposes of these Terms of Service, “**you**” or “**your**” means you as a user of the Service. If you are entering into these Terms of Service on behalf of a company, business, or other legal entity, you represent that you have the authority to bind such entity to these Terms of Service, in which case the terms “you” or “your” shall refer to such entity. If you do not have such authority, or if you do not agree with these Terms of Service, you must not accept these Terms of Service and may not use the Service.

1.3 **Changes to these Terms of Service.** We reserve the right, at our sole discretion, to change or modify portions of these Terms of Service at any time. If we do this, we will post the changes on this page and will update the “Last Updated” date at the top of these Terms of Service. You can review the most current version of these Terms of Service at any time at **myjournai.app/terms**. We will use commercially reasonable efforts to notify you of any material changes thirty (30) days prior to such changes taking effect, either through the Service user interface, a pop-up notice on the Site, email via the email address associated with your account, or through other reasonable means. Your continued use of the Service after the date any such changes become effective constitutes your acceptance of the new Terms of Service. If any change to these Terms of Service is not acceptable to you, you must cease all access to or use of the Service.

1.4 **PLEASE READ THESE TERMS OF SERVICE CAREFULLY AS THEY CONTAIN IMPORTANT INFORMATION REGARDING YOUR LEGAL RIGHTS, REMEDIES, AND OBLIGATIONS. SECTION 14 CONTAINS AN AGREEMENT TO ARBITRATE, WHICH REQUIRES (WITH LIMITED EXCEPTION) THAT YOU SUBMIT CLAIMS YOU HAVE AGAINST US TO BINDING AND FINAL ARBITRATION. FURTHER, (A) YOU WILL ONLY BE PERMITTED TO PURSUE CLAIMS AGAINST THE COMPANY ON AN INDIVIDUAL BASIS, NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY CLASS OR REPRESENTATIVE ACTION OR PROCEEDING; (B) YOU WILL ONLY BE PERMITTED TO SEEK RELIEF (INCLUDING MONETARY, INJUNCTIVE, AND DECLARATORY RELIEF) ON AN INDIVIDUAL BASIS; AND (C) YOU MAY NOT BE ABLE TO HAVE ANY CLAIMS YOU HAVE AGAINST US RESOLVED BY A JURY OR IN A COURT OF LAW. YOU HAVE THE RIGHT TO OPT OUT OF ARBITRATION AS EXPLAINED IN SECTION 14.9.**

---

**2. Your Privacy**

For more information on how we handle the information you provide to us when you use the Service, please see our Privacy Policy, located at **myjournai.app/privacy** (the “**Privacy Policy**”). By using the Service, you consent to our collection, use, and disclosure of personal data and other data as outlined therein.

---

**3. Description of Service**

The Service provides a technology platform that offers AI mentorship for college students and college athletes. Journai delivers personalized guidance, resources, and support to help users achieve their academic and athletic goals. The Service utilizes artificial intelligence to provide tailored mentorship experiences based on data and information you upload to the Service or through accounts that you integrate with the Service.

---

**4. Eligibility; Accounts**

4.1 **Eligibility.** To be eligible to use the Service, you must be at least 13 years of age. Minors under the age of majority in their jurisdiction but who are at least 13 years old are only permitted to use the Service if their parent or guardian accepts these Terms of Service on their behalf prior to use. Children under the age of 13 are not permitted to use the Service.

4.2 **Account.** As part of the registration process, you must provide us with accurate and complete information to allow us to create, verify, and maintain your account (“**Account**”). You are responsible for maintaining the confidentiality of your password and account details and are fully responsible for all activities that occur under your Account. You agree to immediately notify the Company of any unauthorized use of your Account or any other breach of security. By providing your mobile telephone number or email address, you agree that we may communicate with you via text messages or other electronic means, provided that we obtain your consent where legally required.

---

**5. Payments**

5.1 **Access Levels.** Once you have created an Account, you can choose one of the subscription programs offered: “Freemium” or “Premium Monthly.” “Freemium” is our free-of-charge program, which provides limited access to the Services. We reserve the right to deny or limit free use to anyone at any time at our discretion. “Premium Monthly” is a subscription-based program that offers full access to the Services for a monthly fee. You can become a subscriber by purchasing a subscription within the App.

5.2 **Subscriptions.** Should you decide to register for our subscription-based program, you will be asked to submit a payment method and select a subscription plan to access and use the Services. You can become a subscriber by purchasing a subscription within the App, where allowed by our App marketplace partners (such as the Apple App Store or Google Play Store).

5.3 **Maintaining a Paid Subscription.** Any of our paid subscriptions shall be paid in monthly, semi-annual, or annual installments and processed by the platform through which you originally acquired the subscription. You will only have access to a paid subscription while it is active and subsisting. Should you fail to pay your subscription within three (3) days after a due date, you will automatically lose access to your account. Renewal subscription fees will continue to be billed to the payment method you provided, automatically until canceled. You must cancel your subscription before it renews each billing period to avoid billing of the next subscription fee. Refunds cannot be claimed for any partial-month subscription period. You can modify or cancel your paid subscription only through the platform where you originally acquired it.

5.4 **Refunds.** Please note that if you purchase a subscription through the Apple App Store or our iPhone application, the sale is final, and we will not provide a refund. Your purchase will be subject to Apple’s applicable payment policy, which may not provide for refunds. If you purchase a subscription through our website (via Stripe, PayPal, or another payment processor), we will provide a refund only in cases of proven fraudulent activity (such as account or payment method compromise) and only if a refund request is issued within fourteen (14) days after payment. Please note that the 14-day refund policy for EU residents does not apply for the provided access to the digital product.

---

**6. Access and Use of the Service**

6.1 **Access; Restrictions.** You may access and use the Service only for your personal, non-commercial purposes. You shall not:

- (a) Sublicense, resell, rent, lease, transfer, assign, time-share, or otherwise commercially exploit or make the Service available to any third party;
- (b) Modify, copy, distribute, transmit, reproduce, or create derivative works of the Service or any content made available thereon;
- (c) Use the Service in any unlawful manner (including without limitation in violation of any data, privacy, or export control laws) or in any manner that interferes with or disrupts the integrity or performance of the Service or its components;
- (d) Modify, adapt, or hack the Service or otherwise attempt to gain unauthorized access to the Service or its related systems or networks;
- (e) Use bots, hacks, mods, or any other unauthorized software designed to modify the Service;
- (f) Circumvent, remove, alter, or thwart any technological measure or content protections of the Service;
- (g) Use any spider, crawler, scraper, or other automatic device, process, or software that intercepts, mines, scrapes, extracts, or otherwise accesses the Service to monitor, extract, copy, or collect information or data from or through the Service, or engage in any manual process to do the same;
- (h) Introduce any viruses, trojan horses, worms, bombs, or other materials that are malicious or technologically harmful into our systems;
- (i) Use the Service for illegal, harassing, unethical, or disruptive purposes; or
- (j) Access or use the Service in any way not expressly permitted by these Terms of Service.

You shall also comply with any codes of conduct, policies, or other notices the Company provides or publishes in connection with the Service. We may, from time to time, implement rate or message limits for the Service.

6.2 **Software.** Any software made available by the Company in connection with the Service (“**Software**”) contains proprietary and confidential information protected by applicable intellectual property and other laws. Subject to these Terms of Service, the Company grants you a non-transferable, non-sublicensable, and non-exclusive right and license to use the Software on your personal devices solely in connection with the Service, provided that you shall not (and shall not allow any third party to):

- Copy, modify, create a derivative work of, reverse engineer, reverse assemble, or otherwise attempt to discover any source code; or
- Sell, assign, sublicense, or otherwise transfer any right in any Software.

You agree not to access the Service by any means other than through the interface provided by the Company for accessing the Service.

---

**7. Your Content**

7.1 **Your Content.** You are solely responsible for all data, images, information, feedback, suggestions, text, content, and other materials that you upload, deliver, provide, or otherwise transmit or store (hereafter “**provide**”) in connection with or relating to your use of the Service (“**Your Content**”). By providing Your Content on or through the Service or permitting the Company to access Your Content through platforms or services you integrate with your Account, you hereby grant the Company (and our third-party partners and service providers) a worldwide, non-exclusive, perpetual, irrevocable, royalty-free, fully paid, sublicensable, and transferable license to use, modify, reproduce, distribute, display, publish, and perform Your Content in connection with providing the Service to you. You agree that the foregoing includes a right for us to make Your Content available to others with whom we have contractual relationships related to the provision of the Service, solely for the purpose of providing the Service, and to permit access to or disclose Your Content to third parties if we determine such access is necessary to comply with our legal obligations. Additionally, the Company may generate and use technical logs, data, and learnings about your use of the Service and Your Content in aggregate, anonymized form to operate, improve, analyze, and support the Service and other products and services of the Company and for other lawful business purposes. By providing Your Content through the Service, you represent and warrant that you have all rights, licenses, consents, and permissions necessary to grant the rights granted herein to Your Content.

7.2 **Prohibited Data.** Notwithstanding anything to the contrary, you agree that you will not at any time provide through the Service or otherwise to the Company any sensitive financial information, personal health information, or account passwords.

7.3 **Security Measures.** You understand that the operation of the Service may be unencrypted and involve:

- (a) Transmissions over various networks;
- (b) Changes to conform and adapt to technical requirements of connecting networks or devices; and
- (c) Transmission to the Company’s third-party vendors and hosting partners to provide the necessary hardware, software, networking, storage, and related technology required to operate and maintain the Service.

We employ a number of technical, organizational, and physical safeguards designed to protect Your Content. However, no security measures are failsafe, and we cannot guarantee the security of Your Content. Accordingly, you acknowledge that you bear sole responsibility for adequate security, protection, and backup of Your Content. The Company will have no liability to you for any unauthorized access or use of Your Content or any corruption, deletion, destruction, or loss of Your Content.

---

**8. Mobile Services**

8.1 **Mobile Services.** The Service includes certain services available via a mobile device, including:

- (i) The ability to upload content to the Service via a mobile device;
- (ii) The ability to browse the Service and the Site from a mobile device; and
- (iii) The ability to access certain features and content through the Mobile App (collectively, the “**Mobile Services**”).

You are solely responsible for providing the mobile device, wireless service plan, Internet connections, and other equipment and services needed to use the Mobile Services. Downloading, installing, or using certain Mobile Services may be prohibited or restricted by your carrier, and not all Mobile Services may work with all carriers or devices.

8.2 **Push Notifications.** As part of the Service, you may receive push notifications, alerts, or other types of messages sent directly to you in connection with your use of the Mobile App (“**Push Notifications**”). You acknowledge that when you use the Mobile App, your wireless service provider may charge you data rates and other fees, including in connection with Push Notifications. You have control over the Push Notifications settings and can opt in or out through the Service or your mobile device’s operating system (with the possible exception of infrequent, important service announcements and administrative messages).

8.3 **Mobile App License.** Subject to these Terms of Service, the Company grants you a limited, revocable, non-exclusive, non-transferable, non-sublicensable license to:

- (a) Install the Mobile App on one mobile device; and
- (b) Use the Mobile App for your personal use solely to access and use the Service.

For clarity, the foregoing is not intended to prohibit you from installing the Mobile App on another device on which you also agreed to these Terms of Service.

8.4 **Third-Party Distribution Channels.** The Company offers software that may be made available through the Apple App Store, the Google Play Store, or other distribution channels (“**Distribution Channels**”). If you obtain such software through a Distribution Channel, you may be subject to additional terms of the Distribution Channel. These Terms of Service are between you and us only, not with the Distribution Channel. To the extent you utilize any third-party products and services in connection with your use of the Service, you agree to comply with all applicable terms of any agreement for such third-party products and services.

8.5 **Apple-Enabled Software.** If the Mobile App is made available for your use in connection with an Apple-branded product (the “**Apple-Enabled Software**”), the following terms apply:

8.5.1 The Company and you acknowledge that these Terms of Service are concluded between the Company and you only, not with Apple Inc. (“**Apple**”), and that as between the Company and Apple, the Company, not Apple, is solely responsible for the Apple-Enabled Software and its content.

8.5.2 You may not use the Apple-Enabled Software in any manner that violates or is inconsistent with the “Usage Rules” set forth for Apple-Enabled Software in the Apple Media Services Terms and Conditions.

8.5.3 Your license to use the Apple-Enabled Software is limited to a non-transferable license to use it on an iOS product that you own or control, as permitted by the “Usage Rules” in the Apple Media Services Terms and Conditions, except that it may be accessed and used by other accounts associated with the purchaser via Apple’s Family Sharing or volume purchasing programs.

8.5.4 Apple has no obligation to provide any maintenance or support services regarding the Apple-Enabled Software.

8.5.5 Apple is not responsible for any product warranties, whether express or implied by law. In the event of any failure of the Apple-Enabled Software to conform to any applicable warranty, you may notify Apple, and Apple will refund the purchase price for the Apple-Enabled Software, if any, to you. To the maximum extent permitted by applicable law, Apple will have no other warranty obligation with respect to the Apple-Enabled Software.

8.5.6 The Company and you acknowledge that the Company, not Apple, is responsible for addressing any claims by you or any third party relating to the Apple-Enabled Software or your possession and/or use of it, including:

- (i) Product liability claims;
- (ii) Any claim that the Apple-Enabled Software fails to conform to any applicable legal or regulatory requirement; and
- (iii) Claims arising under consumer protection, privacy, or similar legislation.

8.5.7 In the event of any third-party claim that the Apple-Enabled Software or your possession and use of it infringes that third party’s intellectual property rights, the Company, not Apple, will be solely responsible for the investigation, defense, settlement, and discharge of any such claim.

8.5.8 You represent and warrant that:

- (i) You are not located in a country subject to a U.S. Government embargo or designated by the U.S. Government as a “terrorist supporting” country; and
- (ii) You are not listed on any U.S. Government list of prohibited or restricted parties.

8.5.9 If you have any questions, complaints, or claims with respect to the Apple-Enabled Software, they should be directed to us at the address set forth in Section 19.

8.5.10 You must comply with applicable third-party terms of agreement when using the Apple-Enabled Software, e.g., your wireless data service agreement.

8.5.11 The Company and you acknowledge and agree that Apple and Apple’s subsidiaries are third-party beneficiaries of these Terms of Service with respect to the Apple-Enabled Software, and that, upon your acceptance of these Terms of Service, Apple will have the right (and will be deemed to have accepted the right) to enforce these Terms of Service against you with respect to the Apple-Enabled Software.

8.6 **Google-Sourced Software.** The following applies to any Mobile App you download from the Google Play Store (“**Google-Sourced Software**”):

- (a) You acknowledge that these Terms of Service are between you and the Company only, not with Google;
- (b) Your use of Google-Sourced Software must comply with Google’s then-current Google Play Terms of Service;
- (c) Google is only a provider of Google Play where you obtained the Google-Sourced Software;
- (d) The Company, not Google, is solely responsible for the Company’s Google-Sourced Software;
- (e) Google has no obligation or liability to you with respect to Google-Sourced Software or these Terms of Service; and
- (f) You acknowledge and agree that Google is a third-party beneficiary to these Terms of Service as it relates to the Company’s Google-Sourced Software.

---

**9. Intellectual Property Rights**

9.1 **Company Rights.** The Service, including the “look and feel” of the Site and Mobile App, and all related proprietary content, information, and other materials, are protected under intellectual property laws. You agree that the Company and/or its licensors own all right, title, and interest in and to the Service and Software, including all intellectual property rights therein. Any rights not expressly granted herein are reserved.

9.2 **Company Trademarks.** The “Journai” name and logos are trademarks and service marks of the Company (collectively, the “**Company Trademarks**”). Other company, product, and service names and logos used and displayed via the Service may be trademarks or service marks of their respective owners. Nothing in these Terms of Service or the Service should be construed as granting any license or right to use any of the Company Trademarks displayed on the Service without our prior written permission. All goodwill generated from the use of the Company Trademarks will inure to our exclusive benefit.

9.3 **Feedback.** We welcome feedback, comments, and suggestions for improvements to the Service (“**Feedback**”). You acknowledge and expressly agree that any contribution of Feedback does not and will not give or grant you any right, title, or interest in the Service or any such Feedback. All Feedback becomes the sole and exclusive property of the Company, and the Company may use and disclose Feedback in any manner and for any purpose whatsoever without further notice or compensation to you. You hereby assign to the Company any and all right, title, and interest in and to any and all Feedback.

---

**10. Third-Party Services and Websites**

The Service may provide links or access to services, sites, technology, and resources provided by third parties (“**Third-Party Services**”). Your access and use of Third-Party Services may be subject to additional terms, privacy policies, or other agreements with such third parties. You may be required to authenticate or create separate accounts to use Third-Party Services. Some Third-Party Services will provide us with access to certain information you have provided to them, and we will use, store, and disclose such information in accordance with our Privacy Policy. The Company has no control over and is not responsible for such Third-Party Services, including their accuracy, availability, reliability, or completeness, or their privacy practices. You, not the Company, are responsible for any costs and charges associated with your use of any Third-Party Services. The Company enables these Third-Party Services merely as a convenience, and the inclusion of such services does not imply endorsement. Any dealings you have with third parties while using the Service are between you and the third party. The Company is not liable for any damage or loss caused by or in connection with use of or reliance on any Third-Party Services.

---

**11. Indemnification**

To the extent permitted under applicable law, you agree to defend, indemnify, and hold harmless the Company, its affiliates, and their respective officers, employees, directors, service providers, licensors, and agents (collectively, the “**Company Parties**”) from any and all losses, damages, expenses (including reasonable attorneys’ fees), rights, claims, actions of any kind, and injury (including death) arising out of or relating to:

- (a) Your use of the Service;
- (b) Your Content; or
- (c) Your violation of these Terms of Service.

The Company will provide notice to you of any such claim, suit, or proceeding. The Company reserves the right to assume the exclusive defense and control of any matter subject to indemnification under this section, and you agree to cooperate with any reasonable requests assisting the Company’s defense of such matter. You may not settle or compromise any claim against the Company Parties without the Company’s prior written consent.

---

**12. Disclaimer of Warranties**

12.1 **YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK. THE SERVICE IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS. THE COMPANY PARTIES EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.**

12.2 **YOU ACKNOWLEDGE THAT THE COMPANY PARTIES MAKE NO WARRANTY THAT:**

- **(A) THE SERVICE WILL MEET YOUR REQUIREMENTS;**
- **(B) THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE;**
- **(C) THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE SERVICE WILL BE ACCURATE OR RELIABLE; OR**
- **(D) THE QUALITY OF ANY PRODUCTS, SERVICES, INFORMATION, OR OTHER MATERIAL OBTAINED BY YOU THROUGH THE SERVICE WILL MEET YOUR EXPECTATIONS.**

---

**13. Limitation of Liability**

13.1 **UNDER NO CIRCUMSTANCES AND UNDER NO LEGAL THEORY (WHETHER IN CONTRACT, TORT, OR OTHERWISE) SHALL THE COMPANY BE LIABLE TO YOU OR ANY THIRD PARTY FOR:**

- **(A) ANY INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, LOST SALES OR BUSINESS, OR LOST DATA; OR**
- **(B) ANY DIRECT DAMAGES, COSTS, LOSSES, OR LIABILITIES IN EXCESS OF THE FEES ACTUALLY PAID BY YOU IN THE SIX (6) MONTHS PRECEDING THE EVENT GIVING RISE TO YOUR CLAIM OR, IF NO FEES APPLY, ONE HUNDRED U.S. DOLLARS ($100).**

13.2 **SOME JURISDICTIONS DO NOT ALLOW THE DISCLAIMER OR EXCLUSION OF CERTAIN WARRANTIES OR THE LIMITATION OR EXCLUSION OF LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES. SOME OF THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU OR BE ENFORCEABLE WITH RESPECT TO YOU.**

13.3 **IF YOU ARE DISSATISFIED WITH ANY PORTION OF THE SERVICE OR THESE TERMS OF SERVICE, YOUR SOLE AND EXCLUSIVE REMEDY IS TO DISCONTINUE USE OF THE SERVICE.**

---

**14. Dispute Resolution by Binding Arbitration**

**PLEASE READ THIS SECTION CAREFULLY AS IT AFFECTS YOUR RIGHTS.**

14.1 **Agreement to Arbitrate.** This Dispute Resolution by Binding Arbitration section is referred to as the “**Arbitration Agreement**.” You agree that any and all disputes or claims that have arisen or may arise between you and the Company, whether arising out of or relating to these Terms of Service, the Service, any advertising, or any aspect of the relationship or transactions between us, will be resolved exclusively through final and binding arbitration, rather than a court, except that you may assert individual claims in small claims court if your claims qualify. This Arbitration Agreement does not preclude you from bringing issues to federal, state, or local agencies.

14.2 **Prohibition of Class and Representative Actions and Non-Individualized Relief.** **YOU AND THE COMPANY AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY ON AN INDIVIDUAL BASIS AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE ACTION.**

14.3 **Pre-Arbitration Dispute Resolution.** The Company is interested in resolving disputes amicably and efficiently. Before initiating arbitration, you must first send us a written Notice of Dispute (“**Notice**”) to the address listed in Section 19 below. The Notice must describe the nature and basis of the claim or dispute and set forth the specific relief sought. If we do not resolve the claim within sixty (60) calendar days after the Notice is received, you or the Company may commence arbitration.

14.4 **Arbitration Procedures.** Arbitration will be conducted by a neutral arbitrator in accordance with the American Arbitration Association’s (“**AAA**”) rules and procedures, including the AAA’s Consumer Arbitration Rules, as modified by this Arbitration Agreement.

14.5 **Seat of Arbitration.** Unless the Company and you agree otherwise, any arbitration hearings will take place in the county of your residence. If your claim is for $10,000 or less, you may choose whether the arbitration will be conducted solely on the basis of documents, through a telephonic hearing, or by an in-person hearing.

14.6 **Costs of Arbitration.** Payment of all filing, administration, and arbitrator fees will be governed by the AAA Rules, unless otherwise provided in this Arbitration Agreement.

14.7 **Confidentiality.** All aspects of the arbitration proceeding, and any ruling, decision, or award by the arbitrator, will be strictly confidential.

14.8 **Severability.** If any term or provision of this Arbitration Agreement is invalid or unenforceable, it will be replaced with a valid and enforceable provision that comes closest to expressing the intention of the invalid or unenforceable term.

14.9 **Opt-Out.** You have the right to opt out of this Arbitration Agreement by sending written notice of your decision to opt out to the U.S. mailing address listed in Section 19 below within thirty (30) days of your registration with the Service or agreement to these Terms of Service.

---

**15. Termination**

You agree that the Company, in its sole discretion, may suspend or terminate your Account or use of the Service and remove and discard any content within the Service (including Your Content) for any reason, including for lack of use or if the Company believes you have violated these Terms of Service. The Company may also discontinue providing the Service with or without notice. You agree that any termination of your access to the Service may be effected without prior notice, and acknowledge that the Company may immediately deactivate or delete your Account and related information. The Company will not be liable to you or any third party for any termination of your access to the Service.

---

**16. General**

These Terms of Service constitute the entire agreement between you and the Company regarding your access and use of the Service and supersede any prior agreements. These Terms of Service will be governed by the laws of the State of **[Your State]** without regard to its conflict of law provisions. You may not assign these Terms of Service without the prior written consent of the Company, but the Company may assign or transfer these Terms of Service without restriction.

---

**17. Notice for California Users**

Under California Civil Code Section 1789.3, users of the Service from California are entitled to the following specific consumer rights notice:

- **Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs**:
  - Email: **dca@dca.ca.gov**
  - Address: Department of Consumer Affairs, Consumer Information Division, 1625 North Market Blvd., Suite N 112, Sacramento, CA 95834
  - Phone: (800) 952-5210 or (800) 326-2297 (TDD)
  - Sacramento-area consumers may call: (916) 445-1254 or (916) 928-1227 (TDD)

You may contact us at the mailing address set forth in Section 19 below.

---

**18. U.S. Government Restricted Rights**

The Service is made available to the U.S. government with “RESTRICTED RIGHTS.” Use, duplication, or disclosure by the U.S. government is subject to restrictions as set forth in applicable laws and regulations. Access or use of the Service by the U.S. government constitutes acknowledgment of our proprietary rights in the Service.

---

**19. Questions? Concerns? Suggestions?**

Please contact us at **support~myjournai.app** to report any violations of these Terms of Service or to pose any questions regarding these Terms of Service or the Service.

---
`;
    return <div className="p-4 max-w-screen-sm mx-auto">
      <BackNav/>
      <Message content={privacyPolicy} />
    </div>;
  }
});
