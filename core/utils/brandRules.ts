
import { Brand, ApplicationType, BookingRule } from '../../types';

// Helper to generate a unified BookingRule object based on Brand and ApplicationType
// In a real scenario, this data would come directly from the server.
export const generateBookingRule = (brand: string, appType: ApplicationType): BookingRule => {
  
  // 1. Set Name based on Brand (Requested: "[Brand] Application Period")
  const name = `[${brand}] Application Period`;

  // 2. Determine Base Properties based on Application Type
  let baseDesc = "";
  let badgePrefix = "";
  let theme = { bg: '', text: '', border: '', icon_color: '' };

  switch (appType) {
      case ApplicationType.LOTTERY:
          // name = "Lottery System"; // Removed generic name
          baseDesc = "Applications are accepted 1 month prior. Selection is made by random draw.";
          badgePrefix = "Lottery";
          theme = { 
              bg: "bg-purple-50", 
              text: "text-purple-700", 
              border: "border-purple-200",
              icon_color: "text-purple-600"
          };
          break;
      case ApplicationType.FIRST_COME:
          // name = "First-Come First-Served"; // Removed generic name
          baseDesc = "Direct booking is available. Reservations are confirmed immediately upon booking.";
          badgePrefix = "FC";
          theme = { 
              bg: "bg-blue-50", 
              text: "text-blue-700", 
              border: "border-blue-200",
              icon_color: "text-blue-600" 
          };
          break;
      case ApplicationType.APPROVE:
          // name = "Manager Approval"; // Removed generic name
          baseDesc = "Submit a request form. Approval from the department head is required.";
          badgePrefix = "Approve";
          theme = { 
              bg: "bg-orange-50", 
              text: "text-orange-700", 
              border: "border-orange-200",
              icon_color: "text-orange-600" 
          };
          break;
      default:
          // name = "General Booking"; // Removed generic name
          baseDesc = "Please contact HR for details.";
          badgePrefix = "General";
          theme = { 
              bg: "bg-slate-50", 
              text: "text-slate-700", 
              border: "border-slate-200",
              icon_color: "text-slate-500" 
          };
  }

  // 3. Determine Brand Specific Details
  // Using generic comparison since brand is now string
  let brandDetail = "";
  let brandBadgeSuffix = "";

  // Normalize brand string check
  const brandKey = brand.toUpperCase();

  if (brandKey === Brand.SONO) {
      brandDetail = "Lottery applications open from the 1st to 10th of the previous month. Unsold rooms open for booking from the 15th.";
      brandBadgeSuffix = "1st-10th";
  } else if (brandKey === Brand.HANWHA) {
      brandDetail = "Regular lottery runs until the 10th. Open booking starts on the 20th of the previous month at 9:00 AM.";
      brandBadgeSuffix = "1st-10th";
  } else if (brandKey === Brand.KENSINGTON) {
      brandDetail = "Reservations open 6 weeks in advance on Tuesdays at 09:00 AM.";
      brandBadgeSuffix = "6 wks prior";
  } else if (brandKey === Brand.Lotte.toUpperCase()) {
      brandDetail = "Lottery applications accepted 2 months in advance. General booking opens on the 1st of the previous month.";
      brandBadgeSuffix = "2 mon prior";
  } else if (brandKey === Brand.Kumho.toUpperCase()) {
      brandDetail = "Booking opens on the 1st day of the previous month at 10:00 AM.";
      brandBadgeSuffix = "1st of prev";
  } else {
      brandDetail = "Please check the specific booking policy on the official website.";
      brandBadgeSuffix = "Check Policy";
  }

  // 4. Construct Final Object
  return {
      name: name,
      description: `${baseDesc}\n\n[Brand Policy: ${brand}]\n${brandDetail}`,
      badge_text: `${badgePrefix}: ${brandBadgeSuffix}`,
      ui_theme: theme
  };
};
