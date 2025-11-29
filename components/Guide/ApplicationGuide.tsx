import React from 'react';
import { IconArrowLeft, IconBookOpen, IconCalendar, IconCheckCircle, IconUserCheck, IconInfo } from '../Icons';

interface ApplicationGuideProps {
  onBack: () => void;
}

const ApplicationGuide: React.FC<ApplicationGuideProps> = ({ onBack }) => {
  return (
    <div className="h-full flex flex-col bg-white animate-fadeIn whitespace-normal">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-slate-100 flex-shrink-0 bg-white z-10">
        <button 
          onClick={onBack} 
          className="mr-3 p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
        >
          <IconArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-2">
            <IconBookOpen className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-800">Application Guide</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-8 bg-slate-50 min-h-0">
        
        {/* Intro */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-2">How to Book</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
                Our corporate resort program offers three types of booking methods depending on the resort facility and season. Please check the method for your desired destination.
            </p>
        </div>

        {/* Type 1: Lottery */}
        <div className="space-y-3">
            <div className="flex items-center space-x-2 text-purple-700">
                <IconCalendar className="w-5 h-5" />
                <h3 className="font-bold text-base">1. Lottery System</h3>
            </div>
            <div className="bg-white p-4 rounded-xl border-l-4 border-purple-500 shadow-sm">
                <p className="text-sm text-slate-700 mb-3">
                    Used for high-demand resorts and peak seasons. Applications are collected in advance, and winners are selected randomly.
                </p>
                <ul className="text-xs text-slate-600 space-y-2">
                    <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                        <span><strong>Application Period:</strong> 1st - 10th of the previous month.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                        <span><strong>Results:</strong> Announced on the 15th via email/SMS.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                        <span><strong>Cancellation:</strong> Must cancel 7 days prior to avoid penalty points.</span>
                    </li>
                </ul>
            </div>
        </div>

        {/* Type 2: First-Come */}
        <div className="space-y-3">
            <div className="flex items-center space-x-2 text-blue-700">
                <IconCheckCircle className="w-5 h-5" />
                <h3 className="font-bold text-base">2. First-Come First-Served</h3>
            </div>
            <div className="bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow-sm">
                <p className="text-sm text-slate-700 mb-3">
                    Standard booking method for most facilities. Reservations are confirmed immediately upon booking.
                </p>
                <ul className="text-xs text-slate-600 space-y-2">
                    <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                        <span><strong>Opening Time:</strong> 1st of each month at 09:00 AM.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                        <span><strong>Limit:</strong> Max 2 nights per booking.</span>
                    </li>
                </ul>
            </div>
        </div>

        {/* Type 3: Approval */}
        <div className="space-y-3">
            <div className="flex items-center space-x-2 text-orange-700">
                <IconUserCheck className="w-5 h-5" />
                <h3 className="font-bold text-base">3. Manager Approval</h3>
            </div>
            <div className="bg-white p-4 rounded-xl border-l-4 border-orange-500 shadow-sm">
                <p className="text-sm text-slate-700 mb-3">
                    Required for executive suites or special corporate training facilities.
                </p>
                <ul className="text-xs text-slate-600 space-y-2">
                    <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                        <span>Submit a request form with usage purpose.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                        <span>Approval from Department Head is required within 3 days.</span>
                    </li>
                </ul>
            </div>
        </div>

        {/* Footer Note */}
        <div className="bg-slate-100 p-4 rounded-xl flex items-start space-x-3">
            <IconInfo className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <p className="text-xs text-slate-500">
                For technical support or cancellation issues, please contact the Welfare Team at ext. 1234.
            </p>
        </div>

      </div>
    </div>
  );
};

export default ApplicationGuide;