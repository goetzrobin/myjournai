import { createFileRoute } from '@tanstack/react-router';
import { BackNav } from './-back-nav';
import { Message } from '~myjournai/chat-client';
import { useEffect } from 'react';

export const Route = createFileRoute('/_public/privacy-policy')({
  component: () => {
    useEffect(() => {
      localStorage.setItem('isStartScreenShown', 'false');
    }, []);
    const privacyPolicy = `
**Privacy Policy**

_Last Updated: September 16, 2024_

---

At Journai, we are committed to protecting the privacy and security of our users' personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use the Journai app. By using the app, you agree to the terms of this Privacy Policy.

---

**1. Information We Collect**

**1.1 Personal Information**

We collect personal information that you provide when you register for and use the app, including but not limited to:

- **Name**
- **Email address**
- **Academic information** (e.g., major, year of study)
- **Career interests and goals**

**1.2 Usage Data**

We collect information about how you interact with the app, including:

- **Frequency and duration of sessions**
- **Types of interactions** (e.g., responses to guided conversations)
- **Features used**

**1.3 Device Information**

We collect information about the device you use to access the app, such as:

- **IP address**
- **Browser type**
- **Operating system**
- **Device identifiers**

**1.4 Additional Permissions**

- **Location Data**: Journai may request permission to access your location data to provide location-based services and recommendations.
- **Calendar and Contacts**: Journai may request permission to access your calendar and contacts to help you manage appointments and networking opportunities. This data will be used solely for enhancing the user experience within the app.
- **Notifications**: Journai will request permission to send push notifications to keep you informed about updates, reminders, and relevant information.

---

**2. How We Use Your Information**

**2.1 Personalization**

We use the information collected to personalize your experience with the app, providing tailored advice, resources, and content based on your individual needs and preferences.

**2.2 Service Improvement**

We analyze usage data to improve the functionality, content, and user interface of the app.

**2.3 Communication**

We use your contact information to send you updates, notifications, and relevant information about the app. You can opt out of these communications at any time.

**2.4 AI Training**

Collected data may be used to improve and train our AI models, ensuring better accuracy and relevance of the guidance provided.

---

**3. Data Sharing and Disclosure**

**3.1 Third-Party Service Providers**

We may share your information with third-party service providers who assist us in operating the app, conducting our business, or providing services to you. These third parties are obligated to keep your information confidential and secure.

**3.2 Legal Requirements**

We may disclose your information if required by law, in response to legal requests, or to protect our rights, property, or safety, or those of others.

**3.3 Commercial Purposes**

Journai does not share user data with third parties for commercial purposes. Data is used solely to enhance the user experience and improve the app’s functionality.

---

**4. Data Security**

**4.1 Encryption**

We use encryption to protect personal information transmitted online.

**4.2 Access Controls**

We restrict access to your personal information to authorized personnel who need the information to perform their job duties.

**4.3 Data Anonymization**

Wherever possible, we anonymize data to protect user identities and ensure privacy.

---

**5. Your Rights**

**5.1 Access and Correction**

You have the right to access and update your personal information within the app. If you need assistance, please contact our support team.

**5.2 Data Deletion**

You can request the deletion of your personal information by contacting our support team at [support~myjournai.app](mailto:support~myjournai.app).

**5.3 Opt-Out**

You can opt out of receiving communications from us by following the unsubscribe instructions in our emails or by contacting our support team.

---

**6. Changes to This Privacy Policy**

We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any significant changes by posting the new Privacy Policy on the app and updating the "Last Updated" date. Your continued use of the app after such changes will constitute your acknowledgment of the modified policy.

---

**7. Contact Us**

If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:

**Journai Support Team**

Email: [robin@thejournai.com](mailto:robin@thejournai.com)

---
`;
    return <div className="p-4 max-w-screen-sm mx-auto">
      <BackNav/>
      <Message content={privacyPolicy} />
    </div>;
  }})
