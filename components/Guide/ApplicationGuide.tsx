
import React, { useEffect, useState } from 'react';
import { IconArrowLeft, IconBookOpen, IconCheckCircle, IconUserCheck, IconInfo, IconPhone } from '../Icons';
import { GuideSection } from '../../types';
import { getApplicationGuide } from '../../services/resortService';

interface ApplicationGuideProps {
  onBack: () => void;
}

const ApplicationGuide: React.FC<ApplicationGuideProps> = ({ onBack }) => {
  const [sections, setSections] = useState<GuideSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getApplicationGuide();
        setSections(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load guide data", err);
        setError("Failed to load guide information.");
        setSections([]); // Clear on error
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // UI Mapping based on Category
  const getTheme = (category: string) => {
    switch (category) {
      case 'CRITERIA':
        return {
          icon: <IconCheckCircle className="w-5 h-5" />,
          titleColor: 'text-blue-700',
          bg: 'bg-white',
          border: 'border-l-4 border-blue-500',
          bullet: 'bg-blue-400'
        };
      case 'RULES':
        return {
          icon: <IconBookOpen className="w-5 h-5" />,
          titleColor: 'text-purple-700',
          bg: 'bg-white',
          border: 'border-l-4 border-purple-500',
          bullet: 'bg-purple-400'
        };
      case 'RESTRICTION':
        return {
          icon: <IconInfo className="w-5 h-5" />,
          titleColor: 'text-orange-700',
          bg: 'bg-white',
          border: 'border-l-4 border-orange-500',
          bullet: 'bg-orange-400'
        };
      case 'CONTACT':
        return {
          icon: <IconPhone className="w-5 h-5" />,
          titleColor: 'text-slate-600',
          bg: 'bg-slate-100',
          border: 'border-l-4 border-slate-300',
          bullet: 'bg-slate-400'
        };
      default:
        return {
          icon: <IconInfo className="w-5 h-5" />,
          titleColor: 'text-teal-700',
          bg: 'bg-white',
          border: 'border-l-4 border-teal-500',
          bullet: 'bg-teal-400'
        };
    }
  };

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
      <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50 min-h-0">
        
        {loading ? (
            <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        ) : error ? (
            <div className="text-center py-10 text-slate-400 text-sm">
                {error}
                <br/>
                <button onClick={() => window.location.reload()} className="mt-2 text-teal-600 underline">Retry</button>
            </div>
        ) : sections.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
                No guide information available.
            </div>
        ) : (
            sections.map((section) => {
                const theme = getTheme(section.category);
                return (
                    <div key={section.id} className="space-y-3">
                        <div className={`flex items-center space-x-2 ${theme.titleColor}`}>
                            {theme.icon}
                            <h3 className="font-bold text-base">{section.title}</h3>
                        </div>
                        <div className={`p-4 rounded-xl shadow-sm ${theme.bg} ${theme.border}`}>
                            <p className="text-sm text-slate-700 mb-3 whitespace-pre-wrap leading-relaxed">
                                {section.content}
                            </p>
                            {section.details && section.details.length > 0 && (
                                <ul className="text-xs text-slate-600 space-y-2">
                                    {section.details.map((detail, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 mr-2 flex-shrink-0 ${theme.bullet}`}></span>
                                            <span>{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                );
            })
        )}
        
        {/* Footer Note */}
        {!loading && !error && (
            <div className="bg-slate-100 p-4 rounded-xl flex items-start space-x-3 mt-8">
                <IconInfo className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <p className="text-xs text-slate-500">
                    The above information is subject to change. For specific inquiries, please contact the Welfare Team.
                </p>
            </div>
        )}

      </div>
    </div>
  );
};

export default ApplicationGuide;
