import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Second Saturday",
  description:
    "Learn how Second Saturday collects, uses, and protects your personal information.",
  robots: "index, follow",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-serif mb-2">Privacy Policy</h1>
      <p className="text-base-content/60 mb-8">
        Effective Date: April 8, 2026
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-serif mb-3">1. Introduction</h2>
        <p>
          Second Saturday (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
          operates the Second Saturday platform, a group newsletter service that
          helps friends stay connected through monthly updates. This Privacy
          Policy explains how we collect, use, and protect your personal
          information when you use our website and services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-serif mb-3">
          2. Information We Collect
        </h2>
        <h3 className="text-lg font-semibold mb-2">Account Information</h3>
        <p>
          When you create an account, we collect your name and email address
          through our authentication provider, Clerk.
        </p>
        <h3 className="text-lg font-semibold mt-4 mb-2">User Content</h3>
        <p>
          We collect the text contributions you submit to your group newsletters.
        </p>
        <h3 className="text-lg font-semibold mt-4 mb-2">
          Group Membership Data
        </h3>
        <p>
          We store information about which groups you belong to and your role
          within those groups.
        </p>
        <h3 className="text-lg font-semibold mt-4 mb-2">
          Usage and Analytics Data
        </h3>
        <p>
          We automatically collect certain information about how you use our
          service, including page views, feature usage, and technical data such
          as browser type and device information. This data is collected through
          Vercel Analytics and PostHog.
        </p>
        <h3 className="text-lg font-semibold mt-4 mb-2">Error Data</h3>
        <p>
          We use Sentry to collect error reports and performance data to help us
          identify and fix issues with our service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-serif mb-3">
          3. How We Use Your Information
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Providing the service:</strong> Managing your account, group
            memberships, and newsletter contributions.
          </li>
          <li>
            <strong>Delivering newsletters:</strong> Compiling and sending group
            newsletters to members via our email delivery provider, Resend.
          </li>
          <li>
            <strong>Improving our product:</strong> Analyzing usage patterns to
            make Second Saturday better.
          </li>
          <li>
            <strong>Error monitoring:</strong> Identifying and resolving
            technical issues to maintain service reliability.
          </li>
          <li>
            <strong>Communication:</strong> Sending you service-related
            notifications.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-serif mb-3">4. Third-Party Services</h2>
        <p className="mb-3">
          We use the following third-party services to operate Second Saturday:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Clerk</strong> &mdash; Authentication and user account
            management
          </li>
          <li>
            <strong>Convex</strong> &mdash; Database and backend infrastructure
          </li>
          <li>
            <strong>Resend</strong> &mdash; Email delivery for newsletters
          </li>
          <li>
            <strong>Vercel Analytics</strong> &mdash; Website analytics
          </li>
          <li>
            <strong>PostHog</strong> &mdash; Product analytics
          </li>
          <li>
            <strong>Sentry</strong> &mdash; Error tracking and performance
            monitoring
          </li>
        </ul>
        <p className="mt-3">
          Each of these services has its own privacy policy governing how they
          handle your data. We may add additional analytics services in the
          future and will update this policy accordingly.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-serif mb-3">5. Cookies</h2>
        <p>
          We use cookies for authentication session management (provided by
          Clerk) and analytics purposes. These cookies are essential for the
          service to function properly. We do not use advertising or tracking
          cookies beyond what is necessary for analytics.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-serif mb-3">6. Data Retention</h2>
        <p>
          We retain your personal information for as long as your account is
          active. If you request deletion of your account, we will delete your
          personal data within 30 days, except where we are required to retain it
          by law.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-serif mb-3">7. Your Rights</h2>
        <p className="mb-3">You have the right to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Access</strong> the personal information we hold about you
          </li>
          <li>
            <strong>Correct</strong> any inaccurate personal information
          </li>
          <li>
            <strong>Delete</strong> your personal information and account
          </li>
          <li>
            <strong>Export</strong> your data in a portable format
          </li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, please contact us at{" "}
          <a
            href="mailto:hello@secondsaturday.app"
            className="link link-primary"
          >
            hello@secondsaturday.app
          </a>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-serif mb-3">
          8. Children&apos;s Privacy
        </h2>
        <p>
          Second Saturday is not directed at children under 13 years of age. We
          do not knowingly collect personal information from children under 13.
          If we learn that we have collected personal information from a child
          under 13, we will delete that information promptly.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-serif mb-3">
          9. Changes to This Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you
          of any material changes by posting the updated policy on our website
          and updating the effective date. Your continued use of the service
          after changes are posted constitutes acceptance of the updated policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-serif mb-3">10. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at{" "}
          <a
            href="mailto:hello@secondsaturday.app"
            className="link link-primary"
          >
            hello@secondsaturday.app
          </a>
          .
        </p>
      </section>
    </>
  );
}
