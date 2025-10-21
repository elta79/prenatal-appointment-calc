import { useState } from 'react';
import { Printer, Baby } from 'lucide-react';
import AppointmentCard from './components/AppointmentCard';
import { calculateAppointments } from './utils/dateCalculations';

function App() {
  const [dueDate, setDueDate] = useState('');
  const [appointments, setAppointments] = useState(null);
  const [showGestationalAge, setShowGestationalAge] = useState(true);

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
        <div className="mb-8 text-center print:mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Baby className="text-pink-600" size={40} />
            <h1 className="text-4xl font-bold text-gray-800">
              Prenatal Appointment Calculator
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Calculate your prenatal appointment schedule
          </p>
        </div>

        {/* Input Section */}
        <div className="p-6 mb-8 bg-white rounded-lg shadow-md no-print">
          <div className="max-w-md mx-auto">
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
            <div className="flex flex-col items-center justify-center gap-4 mt-6 sm:flex-row">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGestationalAge}
                  onChange={(e) => setShowGestationalAge(e.target.checked)}
                  className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                />
                <span className="text-sm text-gray-700">Show gestational age</span>
              </label>

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
        {appointments && (
          <div className="space-y-4">
            {/* Due Date */}
            <AppointmentCard
              title="Estimated Due Date"
              date={appointments.dueDate.date}
              color="pink"
              showWeeks={showGestationalAge}
              weeks={appointments.dueDate.weeks}
            />

            {/* 20 Week Ultrasound */}
            <AppointmentCard
              title="20 Week Ultrasound"
              date={appointments.ultrasound20Week.date}
              color="indigo"
              showWeeks={showGestationalAge}
              weeks={appointments.ultrasound20Week.weeks}
            />

            {/* Glucose Test */}
            <AppointmentCard
              title="Glucose Test"
              dates={appointments.glucoseTest.fridays}
              color="blue"
              showWeeks={showGestationalAge}
              weeks={appointments.glucoseTest.weeks}
              isFridaySelection={true}
            />

            {/* 32 Week Appointment */}
            <AppointmentCard
              title="32 Week Appointment"
              dates={appointments.week32.fridays}
              color="teal"
              showWeeks={showGestationalAge}
              weeks={appointments.week32.weeks}
              isFridaySelection={true}
            />

            {/* 36 Week Labs */}
            <AppointmentCard
              title="36 Week Labs"
              dates={appointments.week36Labs.fridays}
              color="orange"
              showWeeks={showGestationalAge}
              weeks={appointments.week36Labs.weeks}
              isFridaySelection={true}
            />

            {/* 37 Week Appointment */}
            <AppointmentCard
              title="37 Week Appointment"
              dates={appointments.week37.fridays}
              color="amber"
              showWeeks={showGestationalAge}
              weeks={appointments.week37.weeks}
              isFridaySelection={true}
            />

            {/* 41 Week Biophysical Profile */}
            <AppointmentCard
              title="41 Week Biophysical Profile"
              date={appointments.week41BiophysicalProfile.date}
              color="rose"
              showWeeks={showGestationalAge}
              weeks={appointments.week41BiophysicalProfile.weeks}
            />

            {/* Childbirth Education Class */}
            <AppointmentCard
              title="Childbirth Education Class"
              date={appointments.childbirthClass.date}
              description={appointments.childbirthClass.description}
              color="purple"
              showWeeks={false}
            />

            {/* Breastfeeding Class */}
            <AppointmentCard
              title="Breastfeeding Class"
              date={appointments.breastfeedingClass.date}
              description={appointments.breastfeedingClass.description}
              color="green"
              showWeeks={false}
            />
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
