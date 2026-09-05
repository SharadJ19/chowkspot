import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBookingQueries } from '@/modules/bookings/hooks/useBookingQueries';
import { useSingleWorkerQuery } from '@/modules/workers/hooks/useWorkerQueries';
import { fetchClient } from '@/lib/fetchClient';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { StepIndicator } from '@/modules/auth/components/RegisterForm/components/StepIndicator/StepIndicator';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import type { UserAddress } from '@/types';
import { CreateBookingPageSkeleton } from './CreateBookingPageSkeleton';
import styles from './CreateBookingPage.module.css';

const TIME_SLOTS = [
  { label: 'Morning (09:00 - 12:00)', hour: 9 },
  { label: 'Afternoon (12:00 - 15:00)', hour: 13 },
  { label: 'Evening (15:00 - 18:00)', hour: 16 },
  { label: 'Night (18:00 - 21:00)', hour: 18 },
];

const BOOKING_STEPS = [
  { id: 1, title: 'Schedule' },
  { id: 2, title: 'Address' },
  { id: 3, title: 'Confirm' },
];

export const CreateBookingPage: React.FC = () => {
  const { id: workerId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { createBookingMutation } = useBookingQueries();
  const { data: worker, isLoading: workerLoading } = useSingleWorkerQuery(workerId);

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [dayChoice, setDayChoice] = useState<'today' | 'tomorrow' | 'custom'>('today');
  const [customDateVal, setCustomDateVal] = useState('');
  const [selectedSlotHour, setSelectedSlotHour] = useState<number>(9);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [customAddress, setCustomAddress] = useState('');
  const [addressLabel, setAddressLabel] = useState('Home');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: savedAddresses = [] } = useQuery({
    queryKey: ['user_addresses'],
    queryFn: async () => {
      const res = await fetchClient<UserAddress[]>('/users/addresses');
      return res.data || [];
    },
    enabled: isAuthenticated && user?.role !== 'ADMIN',
  });

  const calculatedDate = useMemo(() => {
    const target = new Date();
    if (dayChoice === 'tomorrow') {
      target.setDate(target.getDate() + 1);
    } else if (dayChoice === 'custom' && customDateVal) {
      const [year, month, day] = customDateVal.split('-').map(Number);
      if (year && month && day) {
        target.setFullYear(year, month - 1, day);
      }
    }
    target.setHours(selectedSlotHour, 0, 0, 0);
    return target;
  }, [dayChoice, customDateVal, selectedSlotHour]);

  const activeAddress = useMemo(() => {
    return selectedAddressId === 'new'
      ? customAddress.trim()
      : savedAddresses.find((a) => a.id === selectedAddressId)?.addressLine ||
          customAddress.trim();
  }, [selectedAddressId, customAddress, savedAddresses]);

  const handleNext = () => {
    setErrorMsg(null);
    if (step === 1) {
      if (dayChoice === 'custom' && !customDateVal) {
        setErrorMsg('Please select a valid service date.');
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!activeAddress || activeAddress.length < 5) {
        setErrorMsg('Please provide a valid service address (at least 5 characters).');
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!worker) return;
    setErrorMsg(null);

    try {
      await createBookingMutation.mutateAsync({
        workerId: worker.id,
        requestedDate: calculatedDate.toISOString(),
        address: activeAddress,
        addressLabel: selectedAddressId === 'new' ? addressLabel : undefined,
        city: worker.serviceCities[0] || user?.city,
        notes: notes.trim() || undefined,
      });

      toast.success(`Booking request sent to ${worker.user.name}!`, {
        description: 'Track responses under your "My Bookings" command center.',
      });
      navigate('/bookings');
    } catch (err) {
      setErrorMsg((err as Error).message || 'Failed to submit booking request.');
    }
  };

  if (workerLoading) {
    return <CreateBookingPageSkeleton />;
  }

  if (!worker) {
    return (
      <div className='container' style={{ padding: '4rem 0', textAlign: 'center' }}>
        Worker profile not found.
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <Link to={`/worker/${worker.id}`} className={styles.backLink}>
        <ArrowLeft size={16} /> Back to Worker Profile
      </Link>

      <div className={styles.twoColumnLayout}>
        {/* Left Form Wizard */}
        <form onSubmit={handleSubmit} className={styles.formCard}>
          <StepIndicator steps={BOOKING_STEPS} currentStep={step} />

          <div>
            <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800 }}>
              Request Service Appointment
            </h1>
            <p
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-muted)',
                marginTop: '2px',
              }}
            >
              {step === 1
                ? 'Choose your preferred date and time window'
                : step === 2
                  ? 'Specify your service delivery address'
                  : 'Review details and submit request'}
            </p>
          </div>

          {errorMsg && (
            <div
              style={{
                color: 'var(--color-error)',
                fontSize: 'var(--font-size-xs)',
                backgroundColor: 'var(--color-status-rejected-bg)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* STEP 1: DATE & TIME */}
          {step === 1 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-md)',
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 700,
                    display: 'block',
                    marginBottom: 6,
                  }}
                >
                  <Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />{' '}
                  Select Day
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {(['today', 'tomorrow', 'custom'] as const).map((d) => (
                    <Button
                      key={d}
                      type='button'
                      variant={dayChoice === d ? 'primary' : 'outline'}
                      size='sm'
                      style={{ flex: 1, textTransform: 'capitalize' }}
                      onClick={() => setDayChoice(d)}
                    >
                      {d}
                    </Button>
                  ))}
                </div>
                {dayChoice === 'custom' && (
                  <div style={{ marginTop: '8px' }}>
                    <Input
                      type='date'
                      min={new Date().toISOString().split('T')[0]}
                      value={customDateVal}
                      onChange={(e) => setCustomDateVal(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div>
                <label
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 700,
                    display: 'block',
                    marginBottom: 6,
                  }}
                >
                  <Clock size={13} style={{ display: 'inline', marginRight: 4 }} />{' '}
                  Preferred Arrival Window
                </label>
                <div
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}
                >
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot.hour}
                      type='button'
                      style={{
                        padding: '12px 14px',
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 600,
                        textAlign: 'left',
                        borderRadius: 'var(--radius-md)',
                        border:
                          selectedSlotHour === slot.hour
                            ? '2px solid var(--color-primary-600)'
                            : '1px solid var(--color-border)',
                        background:
                          selectedSlotHour === slot.hour
                            ? 'var(--color-primary-50)'
                            : 'var(--color-bg-surface)',
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedSlotHour(slot.hour)}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button type='button' variant='primary' fullWidth onClick={handleNext}>
                <span>Next: Service Address</span> <ArrowRight size={16} />
              </Button>
            </div>
          )}

          {/* STEP 2: ADDRESS */}
          {step === 2 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-md)',
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 700,
                    display: 'block',
                    marginBottom: 6,
                  }}
                >
                  <MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />{' '}
                  Select or Add Location
                </label>

                {savedAddresses.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      marginBottom: '10px',
                    }}
                  >
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        style={{
                          padding: '10px',
                          borderRadius: 'var(--radius-lg)',
                          border:
                            selectedAddressId === addr.id
                              ? '2px solid var(--color-primary-600)'
                              : '1px solid var(--color-border)',
                          background:
                            selectedAddressId === addr.id
                              ? 'var(--color-primary-50)'
                              : 'var(--color-bg-surface)',
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            color: 'var(--color-primary-800)',
                          }}
                        >
                          {addr.label}
                        </span>
                        <p
                          style={{
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-slate-800)',
                            marginTop: 2,
                          }}
                        >
                          {addr.addressLine}
                        </p>
                      </div>
                    ))}

                    <div
                      onClick={() => setSelectedAddressId('new')}
                      style={{
                        padding: '10px',
                        borderRadius: 'var(--radius-lg)',
                        border:
                          selectedAddressId === 'new'
                            ? '2px solid var(--color-primary-600)'
                            : '1px solid var(--color-border)',
                        background:
                          selectedAddressId === 'new'
                            ? 'var(--color-primary-50)'
                            : 'var(--color-bg-surface)',
                        cursor: 'pointer',
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 700,
                      }}
                    >
                      <Plus size={13} style={{ display: 'inline', marginRight: 4 }} />{' '}
                      Enter a new address
                    </div>
                  </div>
                )}

                {(selectedAddressId === 'new' || savedAddresses.length === 0) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: 'var(--font-size-xs)',
                      }}
                    >
                      <Tag size={13} /> Label:
                      {(['Home', 'Work', 'Site'] as const).map((l) => (
                        <button
                          key={l}
                          type='button'
                          style={{
                            padding: '2px 8px',
                            borderRadius: '99px',
                            border: '1px solid var(--color-border)',
                            background:
                              addressLabel === l ? 'var(--color-slate-900)' : '#fff',
                            color: addressLabel === l ? '#fff' : 'inherit',
                            fontSize: '0.68rem',
                            cursor: 'pointer',
                          }}
                          onClick={() => setAddressLabel(l)}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                    <Input
                      placeholder='Flat/House No., Building, Sector, Street'
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <Button type='button' variant='outline' onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> Back
                </Button>
                <Button
                  type='button'
                  variant='primary'
                  onClick={handleNext}
                  style={{ flex: 2 }}
                >
                  <span>Next: Review</span> <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: SUMMARY & CONFIRM */}
          {step === 3 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-md)',
              }}
            >
              <div
                style={{
                  background: 'var(--color-slate-50)',
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <p style={{ fontSize: 'var(--font-size-xs)', marginBottom: '8px' }}>
                  <strong>Appointment Date:</strong> {formatDate(calculatedDate, 'long')}
                </p>
                <p style={{ fontSize: 'var(--font-size-xs)', marginBottom: '8px' }}>
                  <strong>Arrival Time:</strong> {formatDate(calculatedDate, 'time')}
                </p>
                <p style={{ fontSize: 'var(--font-size-xs)' }}>
                  <strong>Service Address:</strong> {activeAddress}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700 }}>
                  Job Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder='Describe repair requirements...'
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <Button type='button' variant='outline' onClick={() => setStep(2)}>
                  <ArrowLeft size={16} /> Back
                </Button>
                <Button
                  type='submit'
                  variant='primary'
                  isLoading={createBookingMutation.isPending}
                  style={{ flex: 2 }}
                >
                  Confirm &amp; Send Request
                </Button>
              </div>
            </div>
          )}
        </form>

        {/* Right Sidebar Summary */}
        <aside className={styles.sidebarCard}>
          <div className={styles.workerProfileSnippet}>
            <Avatar name={worker.user.name} src={worker.user.avatarUrl} size='lg' />
            <div>
              <h3 className={styles.workerName}>{worker.user.name}</h3>
              <span className={styles.workerTrade}>{worker.category}</span>
            </div>
          </div>

          <div className={styles.summaryDetailsList}>
            <div className={styles.summaryRowItem}>
              <span>Pricing Model</span>
              <strong style={{ textTransform: 'uppercase' }}>{worker.rateType}</strong>
            </div>
            <div className={styles.summaryRowItem}>
              <span>Base Settlement Rate</span>
              <strong>{formatCurrency(worker.baseRate)}</strong>
            </div>
            <div className={styles.summaryTotalRow}>
              <span>Estimated Total</span>
              <span style={{ color: 'var(--color-primary-700)' }}>
                {formatCurrency(worker.baseRate)}
              </span>
            </div>
          </div>

          <div className={styles.secureGuarantee}>
            <ShieldCheck size={18} />
            <span>0% Commission • Direct P2P UPI Payment</span>
          </div>
        </aside>
      </div>
    </div>
  );
};
