import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Second Saturday",
  description:
    "Terms and conditions for using the Second Saturday group newsletter platform.",
  robots: "index, follow",
};

export default function TermsOfServicePage() {
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-serif mb-2">
        Terms of Service
      </h1>
      <p className="text-base-content/60 mb-8">
        Effective Date: April 8, 2026
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-serif mb-3">1. Acceptance of Terms</h2>
        <p>
          By accessing or using Second Saturday (&quot;the Service&quot;), you
          agree to be bound by these Terms of Service. If you do not agree to
          these terms, please do not use the Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-serif mb-3">
          2. Description of Service
        </h2>
        <p>
          Second Saturday is a group newsletter platform that enables friend
          groups to stay connected through monthly updates. Members contribute
          personal updates which are compiled and delivered as a group newsletter.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-serif mb-3">3. User Accounts</h2>
        <p>
          To use Second Saturday, you must create an account and provide accurate
          information. You are responsible for maintaining the security of your
          account and for all activity that occurs under your account. You must
          notify us immediately of any unauthorized use.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-serif mb-3">4. User Content</h2>
        <p>
          You retain ownership of the content you contribute to group
          newsletters. By submitting content, you grant Second Saturday a
          non-exclusive, worldwide license to use, display, and distribute your
          content solely for the purpose of operating the Service and delivering
          newsletters to your group members.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-serif mb-3">5. Acceptable Use</h2>
        <p className="mb-3">You agree not to use the Service to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Send spam, unsolicited messages, or bulk communications</li>
          <li>
            Harass, threaten, or intimidate other users
          </li>
          <li>
            Post content that is illegal, defamatory, or violates the rights of
            others
          </li>
          <li>
            Attempt to gain unauthorized access to the Service or other
            users&apos; accounts
          </li>
          <li>
            Use the Service for any commercial purpose without our prior written
            consent
          </li>
          <li>
            Interfere with or disrupt the integrity or performance of the Service
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-serif mb-3">
          6. Intellectual Property
        </h2>
        <p>
          The Second Saturday name, logo, and all related branding, software, and
          platform features are the property of Second Saturday. You may not use
          our intellectual property without prior written permission.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-serif mb-3">7. Disclaimers</h2>
        <p>
          The Service is provided &quot;as is&quot; and &quot;as available&quot;
          without warranties of any kind, either express or implied, including
          but not limited to implied warranties of merchantability, fitness for a
          particular purpose, and non-infringement. We do not warrant that the
          Service will be uninterrupted, secure, or error-free.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-serif mb-3">
          8. Limitation of Liability
        </h2>
        <p>
          To the fullest extent permitted by law, Second Saturday shall not be
          liable for any indirect, incidental, special, consequential, or
          punitive damages, or any loss of profits or revenues, whether incurred
          directly or indirectly, or any loss of data, use, goodwill, or other
          intangible losses resulting from your use of the Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-serif mb-3">9. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your account and access to
          the Service at our sole discretion, without notice, for conduct that we
          believe violates these Terms or is harmful to other users, us, or third
          parties. You may also delete your account at any time by contacting us.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-serif mb-3">
          10. Changes to These Terms
        </h2>
        <p>
          We may modify these Terms at any time. We will notify you of material
          changes by posting the updated terms on our website and updating the
          effective date. Your continued use of the Service after changes are
          posted constitutes acceptance of the updated terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-serif mb-3">11. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of the United States, without regard to conflict of law
          principles.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-serif mb-3">12. Contact Us</h2>
        <p>
          If you have any questions about these Terms of Service, please contact
          us at{" "}
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
