import { useState, useEffect, useRef } from 'react';
import { Printer, Baby } from 'lucide-react';
import AppointmentCard from './components/AppointmentCard';
import { calculateAppointments, formatDate, getGestationalAge } from './utils/dateCalculations';

function App() {
  const [dueDate, setDueDate] = useState('');
  const [appointments, setAppointments] = useState(null);
  // Patient name lives only in component state: never stored, never in the URL
  const [patientName, setPatientName] = useState('');
  const nameRef = useRef('');
  nameRef.current = patientName;

  // Set the page title just before printing so "Save as PDF" defaults to
  // "Prenatal Schedule - <Name>.pdf" (Chrome/Edge). Restored right after.
  // Uses print events so it also works with Cmd/Ctrl+P, not just the button.
  useEffect(() => {
    let originalTitle = document.title;
    const onBeforePrint = () => {
      originalTitle = document.title;
      const safeName = nameRef.current.replace(/[\\/:*?"<>|]/g, '').trim();
      if (safeName) document.title = `Prenatal Schedule - ${safeName}`;
    };
    const onAfterPrint = () => {
      document.title = originalTitle;
    };
    window.addEventListener('beforeprint', onBeforePrint);
    window.addEventListener('afterprint', onAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', onBeforePrint);
      window.removeEventListener('afterprint', onAfterPrint);
    };
  }, []);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDueDate(selectedDate);

    if (selectedDate) {
      const calculated = calculateAppointments(selectedDate);
      setAppointments(calculated);
    } else {
      setAppointments(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center print:mb-2">
          <div className="flex items-center justify-center gap-3 mb-4 print:mb-1 print:gap-2">
            <Baby className="text-pink-600" size={40} />
            <h1 className="text-4xl font-bold text-gray-800">
              Prenatal Appointment Calculator
            </h1>
          </div>
          <p className="text-lg text-gray-600 no-print">
            Calculate your prenatal appointment schedule
          </p>
        </div>

        {/* Input Section */}
        <div className="p-6 mb-8 bg-white rounded-lg shadow-md no-print">
          <div className="max-w-md mx-auto">
            <label htmlFor="patientName" className="block mb-2 text-sm font-medium text-gray-700">
              Patient Name (optional)
            </label>
            <input
              type="text"
              id="patientName"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              autoComplete="off"
              className="w-full px-4 py-3 mb-4 text-lg border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            <label htmlFor="dueDate" className="block mb-2 text-sm font-medium text-gray-700">
              Enter Your Estimated Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={handleDateChange}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {appointments && (
            <div className="flex items-center justify-center mt-6">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-2 text-white transition-colors bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700"
              >
                <Printer size={20} />
                Print Schedule
              </button>
            </div>
          )}
        </div>

        {/* Appointments Display */}
        {appointments && patientName.trim() && (
          <p className="mb-4 text-xl font-semibold text-center text-gray-800 patient-name">
            Patient: {patientName.trim()}
          </p>
        )}

        {appointments && (
          <div className="space-y-4">
            {/* Due Date */}
            <AppointmentCard
              title="Estimated Due Date - 40 weeks"
              date={appointments.dueDate}
              color="pink"
            />

            {/* First Trimester Ultrasound */}
            <AppointmentCard
              title="First Trimester Ultrasound - before 13 weeks"
              description={`Schedule before ${formatDate(appointments.firstTrimester.week13)}`}
              color="indigo"
            >
              <p className="text-gray-700">
                <span className="font-semibold">Recommended 8–10 weeks:</span>{' '}
                {formatDate(appointments.firstTrimester.week8)} – {formatDate(appointments.firstTrimester.week10)}
              </p>
            </AppointmentCard>

            <AppointmentCard
              title="Initial Labs"
              dueDate={appointments.dueDate}
              dates={appointments.firstTrimester.initialLabs}
              color="blue"
              isFridaySelection={true}
            />

            <AppointmentCard
              title="First In-Office Visit"
              dueDate={appointments.dueDate}
              dates={appointments.firstTrimester.firstOfficeVisit}
              color="teal"
              isFridaySelection={true}
            />

            {/* Second Trimester Appointments */}
            {appointments.secondTrimester.map((appt, index) => {
              if (appt.isUltrasound) {
                return (
                  <AppointmentCard
                    key={`second-${index}`}
                    title={`${appt.week} Week Ultrasound`}
                    date={appt.date}
                    color="purple"
                  />
                );
              }
              return (
                <AppointmentCard
                  key={`second-${index}`}
                  title={`${appt.week} Week Appointment`}
                  dueDate={appointments.dueDate}
                  dates={appt.dates}
                  color="orange"
                  isFridaySelection={true}
                />
              );
            })}

            {/* Glucose Test */}
            <AppointmentCard
              title="Glucose Test - 26-28 weeks"
              color="amber"
            >
              <ul className="space-y-1">
                <li className="text-gray-700">
                  <span className="font-semibold">Rh negative:</span>{' '}
                  {formatDate(appointments.glucoseTest.rhNegative)}
                  <span className="ml-1 text-sm text-gray-500 ga-label">
                    ({getGestationalAge(appointments.dueDate, appointments.glucoseTest.rhNegative)})
                  </span>
                </li>
                <li className="text-gray-700">
                  <span className="font-semibold">Rh positive:</span>{' '}
                  {formatDate(appointments.glucoseTest.rhPositive)}
                  <span className="ml-1 text-sm text-gray-500 ga-label">
                    ({getGestationalAge(appointments.dueDate, appointments.glucoseTest.rhPositive)})
                  </span>
                </li>
              </ul>
            </AppointmentCard>

            {/* Third Trimester Appointments */}
            {appointments.thirdTrimester.map((appt, index) => (
              <div key={`third-${index}`}>
                {appt.dates && (
                  <AppointmentCard
                    title={`${appt.week} Week Appointment`}
                    dueDate={appointments.dueDate}
                    dates={appt.dates}
                    color="green"
                    isFridaySelection={true}
                  />
                )}
                {appt.telehealth && (
                  <AppointmentCard
                    title={`${appt.week} Week Telehealth`}
                    dueDate={appointments.dueDate}
                    dates={appt.telehealth}
                    color="indigo"
                    isFridaySelection={true}
                  />
                )}
                {appt.labs && (
                  <AppointmentCard
                    title={`${appt.week} Week Labs`}
                    dueDate={appointments.dueDate}
                    dates={appt.labs}
                    color="blue"
                    isFridaySelection={true}
                  />
                )}
              </div>
            ))}

            {/* Weekly Appointments 37-41 weeks */}
            {appointments.weeklyAppts.map((appt, index) => (
              <div key={`weekly-${index}`}>
                {appt.telehealth && (
                  <AppointmentCard
                    title={`${appt.week} Week Telehealth - ONLY multip w/o risk`}
                    dueDate={appointments.dueDate}
                    dates={appt.telehealth}
                    color="indigo"
                    isFridaySelection={true}
                  />
                )}
                {appt.dates && !appt.telehealth && !appt.isWeek40 && !appt.isWeek41 && (
                  <AppointmentCard
                    title={`${appt.week} Week Appointment`}
                    dueDate={appointments.dueDate}
                    dates={appt.dates}
                    color="teal"
                    isFridaySelection={true}
                  />
                )}
                {appt.isWeek40 && (
                  <AppointmentCard
                    title="40 Week Appointment"
                    dueDate={appointments.dueDate}
                    dates={appt.dates}
                    color="orange"
                    isFridaySelection={true}
                  />
                )}
                {appt.isWeek41 && (
                  <>
                    <AppointmentCard
                      title="41 Week Biophysical Profile"
                      date={appt.week41Date}
                      color="rose"
                    />
                    <AppointmentCard
                      title="41 Week Appointment"
                      dueDate={appointments.dueDate}
                      dates={appt.dates}
                      color="amber"
                      isFridaySelection={true}
                    />
                  </>
                )}
              </div>
            ))}

            {/* Classes */}
            <AppointmentCard
              title="Childbirth Education Class"
              dueDate={appointments.dueDate}
              date={appointments.classes.childbirth}
              description="First Saturday of the month before due date"
              color="purple"
            />

            <AppointmentCard
              title="Breastfeeding Class"
              dueDate={appointments.dueDate}
              date={appointments.classes.breastfeeding}
              description="Third Thursday of the month before due date"
              color="green"
            />

            {/* Birth Rehearsal */}
            <AppointmentCard
              title="Birth Rehearsal"
              dueDate={appointments.dueDate}
              date={appointments.birthRehearsal.week36Date}
              description="Scheduled with the Doula around 36 weeks"
              color="rose"
            />

            {/* Postpartum Section */}
            <div className="p-6 mt-8 bg-white border-2 border-pink-200 rounded-lg shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-gray-800">Postpartum Care</h3>
              <p className="mb-3 text-gray-700">
                After birth, our staff will contact you to schedule:
              </p>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li>24–72 hour postpartum visit</li>
                <li>
                  2-week postpartum visit: in-office Monday/Wednesday for first-time moms;
                  Friday telehealth if you've had a baby before
                </li>
                <li>6–8 week postpartum visit: in-office Monday/Wednesday</li>
              </ul>
            </div>
          </div>
        )}

        {!appointments && (
          <div className="py-12 text-center no-print">
            <p className="text-lg text-gray-500">
              Enter your due date above to calculate your appointment schedule
            </p>
          </div>
        )}

        {/* Footer for print */}
        {appointments && (
          <div className="hidden pt-4 mt-8 border-t border-gray-300 print:block">
            <p className="text-sm text-center text-gray-600">
              Generated by Prenatal Appointment Calculator
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
