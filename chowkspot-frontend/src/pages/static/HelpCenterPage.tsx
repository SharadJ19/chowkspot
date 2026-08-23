import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './StaticPages.module.css';

interface Faq {
  question: string;
  answer: string;
}

const FAQS: Faq[] = [
  {
    question: 'How do I pay a worker on ChowkSpot?',
    answer:
      'ChowkSpot is 100% zero-commission. When a job is marked as "Completed", customers can tap "Pay via UPI" to open their preferred mobile payment app (GPay, PhonePe, Paytm) or scan a live QR code directly with zero platform deductions.',
  },
  {
    question: 'How do I become a verified skilled worker?',
    answer:
      'Sign up choosing the "Skilled Worker" role, specify your trade category (e.g., Electrician, Plumber), select your service cities, set your base rate, and provide an optional UPI ID. You can toggle your availability on/off anytime from your Profile.',
  },
  {
    question: 'Can workers propose a different appointment time?',
    answer:
      'Yes. If a requested slot clashes with an existing appointment, workers can propose a counter-slot timestamp. The booking state machine updates in real time via WebSockets.',
  },
  {
    question: 'Who can leave reviews on worker profiles?',
    answer:
      'Only customers with a verified, completed service booking record can submit 1 to 5-star ratings and written feedback. This prevents fabricated or spam reviews.',
  },
];

export const HelpCenterPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`container ${styles.staticPageContainer}`}>
      <div className={styles.headerCard}>
        <div className={styles.badgePill}>
          <HelpCircle size={14} />
          <span>Support &amp; Knowledge Base</span>
        </div>
        <h1 className={styles.pageTitle}>Help Center</h1>
        <p className={styles.pageSubtitle}>
          Frequently asked questions, booking state guides, and regional support desk
          contacts.
        </p>
      </div>

      <div className={styles.contentCard}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div className={styles.bulletList}>
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className={styles.faqItem}>
                  <button
                    type='button'
                    className={styles.faqTrigger}
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {isOpen && <p className={styles.faqContent}>{faq.answer}</p>}
                </div>
              );
            })}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact Regional Support Hub</h2>
          <p className={styles.paragraph}>
            Need assistance with account moderation, booking disputes, or technical
            inquiries?
          </p>

          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <span className={styles.contactCardTitle}>Email Support</span>
              <span className={styles.contactCardText}>support@chowkspot.com</span>
            </div>
            <div className={styles.contactCard}>
              <span className={styles.contactCardTitle}>Direct Helpline</span>
              <span className={styles.contactCardText}>+91 75908 89608</span>
            </div>
            <div className={styles.contactCard}>
              <span className={styles.contactCardTitle}>Operations Desk</span>
              <span className={styles.contactCardText}>
                Plot 42, Sector 17-E, Chandigarh
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
