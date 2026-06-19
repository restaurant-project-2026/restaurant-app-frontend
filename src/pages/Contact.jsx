import { useState } from 'react';

// page de contact : infos du restaurant, horaires et formulaire de message
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  // met à jour le champ correspondant dans le formulaire à chaque frappe
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // simule l'envoi du formulaire (pas de vrai appel API ici, uniquement une démo visuelle)
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-900 py-12 text-center">
        <h1 className="font-serif text-4xl text-white mb-2">Contact</h1>
        <p className="text-stone-400">We are here for you</p>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-6 text-left">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-stone-100">
              <h2 className="font-serif text-xl text-stone-900 mb-4">Information</h2>
              <ul className="space-y-4 text-stone-600">
                <li className="flex gap-3">
                  <span className="text-amber-700" aria-hidden>
                    📍
                  </span>
                  <span>
                    14 HaYarkon Street
                    <br />
                    Tel Aviv, Israel
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-700" aria-hidden>
                    📞
                  </span>
                  <a href="tel:+97231234567" className="hover:text-amber-700 transition-colors">
                    +972 3 123 4567
                  </a>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-700" aria-hidden>
                    ✉️
                  </span>
                  <a
                    href="mailto:contact@jardingourmand.co.il"
                    className="hover:text-amber-700 transition-colors"
                  >
                    contact@jardingourmand.co.il
                  </a>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-stone-100">
              <h2 className="font-serif text-xl text-stone-900 mb-4">Opening Hours</h2>
              <table className="w-full text-sm text-stone-600">
                <tbody>
                  <tr className="border-b border-stone-100">
                    <td className="py-2 font-medium">Monday</td>
                    <td className="py-2 text-right text-stone-400">Closed</td>
                  </tr>
                  <tr className="border-b border-stone-100">
                    <td className="py-2 font-medium">Tue – Fri</td>
                    <td className="py-2 text-right">12:00 – 14:30 / 19:00 – 23:00</td>
                  </tr>
                  <tr className="border-b border-stone-100">
                    <td className="py-2 font-medium">Saturday</td>
                    <td className="py-2 text-right">12:00 – 15:00 / 19:00 – 00:00</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Sunday</td>
                    <td className="py-2 text-right">12:00 – 15:00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-stone-100 text-left"
            >
              <h2 className="font-serif text-xl text-stone-900 mb-4">Send us a message</h2>

              {sent && (
                <p className="mb-4 p-3 bg-green-50 text-green-800 rounded-lg text-sm border border-green-200">
                  Message sent! We will get back to you within 48 hours. (Local form, demo)
                </p>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-y"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-amber-700 text-white font-semibold hover:bg-amber-600 transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-12 rounded-2xl overflow-hidden shadow-lg border border-stone-200 h-80">
          <iframe
            title="Google Maps — Olympique de Marseille, Tel Aviv"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3381.0!2d34.7818!3d32.0853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4ca6193b7c1f%3A0xc1fb72a2c0963f90!2sTel%20Aviv-Yafo%2C%20Israel!5e0!3m2!1sen!2sil!4v1"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
