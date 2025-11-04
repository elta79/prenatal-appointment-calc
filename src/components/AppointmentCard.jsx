import React from 'react';
import { Calendar } from 'lucide-react';
import { formatDate } from '../utils/dateCalculations';

const colorClasses = {
  pink: 'bg-pink-50 border-pink-200',
  indigo: 'bg-indigo-50 border-indigo-200',
  blue: 'bg-blue-50 border-blue-200',
  teal: 'bg-teal-50 border-teal-200',
  orange: 'bg-orange-50 border-orange-200',
  amber: 'bg-amber-50 border-amber-200',
  purple: 'bg-purple-50 border-purple-200',
  green: 'bg-green-50 border-green-200',
  rose: 'bg-rose-50 border-rose-200'
};

const iconColorClasses = {
  pink: 'text-pink-600',
  indigo: 'text-indigo-600',
  blue: 'text-blue-600',
  teal: 'text-teal-600',
  orange: 'text-orange-600',
  amber: 'text-amber-600',
  purple: 'text-purple-600',
  green: 'text-green-600',
  rose: 'text-rose-600'
};

const AppointmentCard = ({
  title,
  date,
  dates,
  description,
  color = 'blue',
  showWeeks = false,
  weeks,
  isFridaySelection = false
}) => {
  return (
    <div className={`${colorClasses[color]} border-2 rounded-lg p-6 shadow-sm print-break`}>
      <div className="flex items-start gap-3">
        <Calendar className={`${iconColorClasses[color]} mt-1 flex-shrink-0`} size={24} />
        <div className="flex-1">
          <h3 className="mb-2 text-lg font-semibold text-gray-800">{title}</h3>

          {showWeeks && weeks && (
            <p className="mb-2 text-sm text-gray-600">
              ({weeks} weeks gestation)
            </p>
          )}

          {description && (
            <p className="mb-2 text-sm italic text-gray-600">{description}</p>
          )}

          {date && (
            <p className="font-medium text-gray-700">{formatDate(date)}</p>
          )}

          {dates && dates.length > 0 && (
            <div className="mt-2">
              {isFridaySelection && (
                <p className="mb-2 text-sm font-semibold text-gray-700">
                  Available dates, choose one:
                </p>
              )}
              <ul className="space-y-1">
                {dates.map((d, index) => (
                  <li key={index} className="text-gray-700">
                    {isFridaySelection && '• '}{formatDate(d)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
