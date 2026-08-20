import { useEffect, useState } from 'react';
import { createCustomer, findCustomerAfterCreate } from '../api/customers';
import { createReservation } from '../api/reservations';
import { getTables } from '../api/tables';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';

// labels des 3 étapes du formulaire de réservation
const STEPS = ['Your Details', 'Date & Table', 'Confirmation'];

// valeurs initiales du formulaire, utilisées aussi pour le réinitialiser après soumission
const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  reservationDate: '',
  reservationTime: '',
  guestsCount: 2,
  tableId: '',
};

// page de réservation en 3 étapes : coordonnées → date/table → récapitulatif et envoi
export default function Reservation() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [tables, setTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // recharge les tables quand l'utilisateur passe à l'étape 2 ou change le nombre de convives
  useEffect(() => {
    if (step !== 1) return;

    const fetchTables = async () => {
      setLoadingTables(true);
      setError(null);
      try {
        const data = await getTables();
        // garde uniquement les tables dispo avec assez de places pour le nombre de convives
        const available = data.filter((t) => t.isAvailable && t.capacity >= form.guestsCount);
        setTables(available);
      } catch {
        setError('Unable to load available tables.');
      } finally {
        setLoadingTables(false);
      }
    };

    fetchTables();
  }, [step, form.guestsCount]);

  // met à jour le champ du formulaire à chaque frappe, convertit en nombre pour guestsCount et tableId
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'guestsCount' || name === 'tableId' ? Number(value) || value : value,
    }));
  };

  // vérifie que tous les champs obligatoires de l'étape courante sont remplis avant de continuer
  const validateStep = () => {
    if (step === 0) {
      if (!form.firstName.trim() || !form.lastName.trim()) {
        setError('First name and last name are required.');
        return false;
      }
      if (!form.email.trim() && !form.phone.trim()) {
        setError('Please provide at least an email or phone number.');
        return false;
      }
    }
    if (step === 1) {
      if (!form.reservationDate || !form.reservationTime) {
        setError('Please choose a date and time.');
        return false;
      }
      if (!form.tableId) {
        setError('Please select a table.');
        return false;
      }
    }
    setError(null);
    return true;
  };

  // passe à l'étape suivante uniquement si la validation réussit
  const nextStep = () => {
    console.log('form.tableId:', form.tableId); console.log('validateStep:', validateStep()); if (validateStep()) setStep((s) => Math.min(s + 1, 2));
  };

  // revient à l'étape précédente et efface le message d'erreur
  const prevStep = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  // soumet la réservation : crée d'abord le client, récupère son ID puis crée la réservation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setSubmitting(true);
    setError(null);

    try {
      await createCustomer({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
      });

      // l'API ne retourne pas l'ID après création donc on recherche le client par ses infos
      const customer = await findCustomerAfterCreate({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
      });

      if (!customer) {
        throw new Error('Customer not found after creation.');
      }

      // l'API attend le format HH:mm:ss, on ajoute ":00" si l'heure est au format HH:mm
      const timeFormatted =
        form.reservationTime.length === 5
          ? `${form.reservationTime}:00`
          : form.reservationTime;

      await createReservation({
        customerId: customer.id,
        tableId: Number(form.tableId),
        reservationDate: form.reservationDate,
        reservationTime: timeFormatted,
        guestsCount: Number(form.guestsCount),
        status: 'confirmed',
      });

      setSuccess(true);
    } catch (err) {
      const msg =
        err.response?.data?.title ||
        err.message ||
        'Reservation error. Please try again later.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // retrouve l'objet table sélectionné pour l'afficher dans le récapitulatif (étape 3)
  const selectedTable = tables.find((t) => t.id === Number(form.tableId));

  // écran de confirmation affiché après un envoi réussi
  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-stone-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-green-200">
          <div className="text-5xl mb-4" aria-hidden>
            ✓
          </div>
          <h2 className="font-serif text-2xl text-stone-900 mb-2">Reservation Confirmed!</h2>
          <p className="text-stone-600 mb-6">
            Thank you {form.firstName}, your table is booked for {form.reservationDate} at{' '}
            {form.reservationTime}.
          </p>
          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              setStep(0);
              setForm(initialForm);
            }}
            className="text-amber-700 font-medium hover:text-amber-600"
          >
            New Reservation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-900 py-12 text-center">
        <h1 className="font-serif text-4xl text-white mb-2">Book a Table</h1>
        <p className="text-stone-400">Complete the form in a few steps</p>
      </section>

      <div className="max-w-xl mx-auto px-4 py-10">
        {/* indicateur de progression : chaque étape est numérotée et colorée selon l'avancement */}
        <div className="flex justify-between mb-8">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={`flex-1 text-center text-xs sm:text-sm ${
                i <= step ? 'text-amber-700 font-medium' : 'text-stone-400'
              }`}
            >
              <span
                className={`inline-flex w-8 h-8 items-center justify-center rounded-full mb-1 text-sm ${
                  i <= step ? 'bg-amber-700 text-white' : 'bg-stone-200 text-stone-500'
                }`}
              >
                {i + 1}
              </span>
              <span className="hidden sm:block">{label}</span>
            </div>
          ))}
        </div>

        <form
          onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()}
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-stone-100"
        >
          {error && (
            <div className="mb-6">
              <ErrorMessage message={error} />
            </div>
          )}

          {/* étape 1 : saisie des coordonnées du client */}
          {step === 0 && (
            <div className="space-y-4 text-left">
              <h2 className="font-serif text-xl text-stone-900 mb-4">Your Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">First Name *</label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Last Name *</label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* étape 2 : choix de la date, l'heure, le nombre de convives et la table */}
          {step === 1 && (
            <div className="space-y-4 text-left">
              <h2 className="font-serif text-xl text-stone-900 mb-4">Date & Table</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Date *</label>
                  <input
                    type="date"
                    name="reservationDate"
                    value={form.reservationDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Time *</label>
                  <input
                    type="time"
                    name="reservationTime"
                    value={form.reservationTime}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Number of Guests *
                </label>
                <select
                  name="guestsCount"
                  value={form.guestsCount}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'guest' : 'guests'}
                    </option>
                  ))}
                </select>
              </div>

              {loadingTables && <LoadingSpinner label="Loading tables..." />}

              {!loadingTables && tables.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Available Table *
                  </label>
                  <div className="space-y-2">
                    {tables.map((table) => (
                      <label
                        key={table.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          Number(form.tableId) === table.id
                            ? 'border-amber-600 bg-amber-50'
                            : 'border-stone-200 hover:border-amber-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="tableId"
                          value={table.id}
                          checked={Number(form.tableId) === table.id}
                          onChange={handleChange}
                          className="text-amber-700"
                        />
                        <span>
                          Table No.{table.tableNumber} — {table.capacity} seats
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {!loadingTables && tables.length === 0 && (
                <p className="text-amber-800 bg-amber-50 p-3 rounded-lg text-sm">
                  No tables available for {form.guestsCount} guest(s). Please reduce the number of
                  guests or contact us.
                </p>
              )}
            </div>
          )}

          {/* étape 3 : récapitulatif avant confirmation finale */}
          {step === 2 && (
            <div className="text-left space-y-3">
              <h2 className="font-serif text-xl text-stone-900 mb-4">Summary</h2>
              <dl className="space-y-2 text-stone-700">
                <div className="flex justify-between border-b border-stone-100 py-2">
                  <dt className="text-stone-500">Guest</dt>
                  <dd className="font-medium">
                    {form.firstName} {form.lastName}
                  </dd>
                </div>
                <div className="flex justify-between border-b border-stone-100 py-2">
                  <dt className="text-stone-500">Contact</dt>
                  <dd>{form.email || form.phone}</dd>
                </div>
                <div className="flex justify-between border-b border-stone-100 py-2">
                  <dt className="text-stone-500">Date</dt>
                  <dd>{form.reservationDate}</dd>
                </div>
                <div className="flex justify-between border-b border-stone-100 py-2">
                  <dt className="text-stone-500">Time</dt>
                  <dd>{form.reservationTime}</dd>
                </div>
                <div className="flex justify-between border-b border-stone-100 py-2">
                  <dt className="text-stone-500">Guests</dt>
                  <dd>{form.guestsCount}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-stone-500">Table</dt>
                  <dd>
                    {selectedTable
                      ? `No.${selectedTable.tableNumber} (${selectedTable.capacity} seats)`
                      : '—'}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 py-3 rounded-lg border border-stone-300 text-stone-700 font-medium hover:bg-stone-50 transition-colors"
              >
                Back
              </button>
            )}
            {step < 2 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 py-3 rounded-lg bg-amber-700 text-white font-semibold hover:bg-amber-600 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 rounded-lg bg-amber-700 text-white font-semibold hover:bg-amber-600 transition-colors disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Confirm Reservation'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

