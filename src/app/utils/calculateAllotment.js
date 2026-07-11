const getCategoryKey = (app) => {
  const map = {
    'EWS': 'EWS', 'Ezhava': 'EZ', 'Muslim': 'M', 'OBH': 'BH',
    'Other Backward Hindu': 'BH',
    'Latin Catholic': 'LC', 'Latin Catholic and Anglo Indian': 'LC',
    'Dheevara': 'DV', 'Viswakarma': 'VK',
    'Kusavan': 'KN', 'OBC Christian': 'BX', 'Kudumbi': 'KU',
    'SC': 'SC', 'ST': 'ST', 'Physically Disabled': 'PD', 'Transgender': 'TG',
    'Sports': 'SPORTS', 'DTE Staff': 'STAFF', 'Central govt. employee': 'CENTRAL',
  };
  const categoryValue = app.category || app.reservationCategory;
  return map[categoryValue];
};

const mapDepartmentNameToKey = (name) => {
  const map = {
    "Electrical and Electronics Engineering": "ee",
    "Mechanical Engineering": "mech",
    "Civil Engineering": "ce",
    "Computer Science and Engineering": "cse",
    "Electronics and Communication Engineering": "ece",
  };
  return map[name] || null;
};

const extractChoices = (app) => {
  if (app.priorityChoices && typeof app.priorityChoices === 'object') {
    return Object.values(app.priorityChoices)
      .filter(Boolean)
      .map(mapDepartmentNameToKey)
      .filter(Boolean);
  }
  return [];
};  

const MAX_DISTANCE = 70;
const getMinMarkForCategory = (app) => {
  const reservedCategories = [
    "SC", "ST", "EZ", "M", "BH", "LC", "DV", "VK", "KN", "BX", "KU", "EWS",
    "PD", "TG", "SPORTS", "STAFF", "CENTRAL"
  ];
  const categoryKey = getCategoryKey(app);
  return reservedCategories.includes(categoryKey) ? 40 : 45;
};

const MIN_EXPERIENCE = 1; // Minimum experience requirement in years

const isValidRank = (letRank) => {
  const num = Number(letRank);
  return !isNaN(num) && Number.isFinite(num) && num >= 1;
};

// Helper function to get education priority
const getEducationPriority = (education) => {
  const priorityMap = {
    'Diploma': 2,
    'BSc': 3,
    'BVoc': 4,
    'BE': 1,
    'BTech': 1,
    'Other': 5 // Fallback for any other education types
  };
  return priorityMap[education] || 5; // Default to lowest priority if not found
};

const sortByEducationThenRankThenMarks = (applications) => {
  return applications.sort((a, b) => {
    // First sort by education priority
    const eduPriorityA = getEducationPriority(a.education);
    const eduPriorityB = getEducationPriority(b.education);
    
    if (eduPriorityA !== eduPriorityB) {
      return eduPriorityA - eduPriorityB; // Lower number = higher priority
    }
    
    // If education priority is same, sort by rank
    const rankA = parseFloat(a.letRank);
    const rankB = parseFloat(b.letRank);
    
    if (rankA !== rankB) {
      return rankA - rankB;
    }
    
    // If rank is also same, sort by marks (assuming higher marks = better)
    return parseFloat(b.mark) - parseFloat(a.mark);
  });
};

// Helper function to check if application is eligible for allotment
const isEligibleForAllotment = (app) => {
  const validMark = parseFloat(app.mark) >= getMinMarkForCategory(app);
  const validDistance = parseFloat(app.distance) <= MAX_DISTANCE;
  const validRank = isValidRank(app.letRank);
  const validExperience = parseFloat(app.experience) >= MIN_EXPERIENCE;
  return validDistance && validRank && validMark && validExperience;
};

// Helper function to check basic eligibility (without experience)
const isBasicEligible = (app) => {
  const validMark = parseFloat(app.mark) >= getMinMarkForCategory(app);
  const validDistance = parseFloat(app.distance) <= MAX_DISTANCE;
  const validRank = isValidRank(app.letRank);
  return validDistance && validRank && validMark;
};

const transformEducationData = (applications) => {
  const normalizeEducation = (educationValue) => {
    if (!educationValue || typeof educationValue !== 'string') {
      return educationValue; // Return as-is if null, undefined, or not a string
    }
    
    const education = educationValue.toLowerCase().trim();
    
    // Define education mappings with keywords
    const educationMap = {
      'Diploma': ['diploma'],
      'BSc': ['bsc', 'b.sc', 'bachelor of science', 'b sc'],
      'BVoc': ['bvoc', 'b.voc', 'bachelor of vocation', 'b voc'],
      'BE': ['be', 'b.e', 'bachelor of engineering', 'b e'],
      'BTech': ['btech', 'b.tech', 'bachelor of technology', 'b tech'],
    };
    
    // Check for each education type
    for (const [standardForm, keywords] of Object.entries(educationMap)) {
      for (const keyword of keywords) {
        if (education.includes(keyword)) {
          return standardForm;
        }
      }
    }
    
    // Return original value if no match found
    return educationValue;
  };
  
  // Transform all applications
  return applications.map(app => ({
    ...app,
    education: normalizeEducation(app.highestEducation)
  }));
};

export const calculateAllotment = (applications, departments) => {
  const transformedApplications = transformEducationData(applications);
  
  // Filter eligible applications (including experience requirement)
  const eligibleApplications = transformedApplications.filter(isEligibleForAllotment);
  const sortedEligibleApplications = sortByEducationThenRankThenMarks(eligibleApplications);

  const SEBC_CATEGORIES = ["EZ", "M", "BH", "LC", "DV", "VK", "KN", "BX", "KU"];
  const SPECIAL_CATEGORIES = ["TG", "PD", "SPORTS", "STAFF", "CENTRAL"];

  // Initialize departments with seat distribution
  const updatedDepartments = departments.map((dept) => {
    const totalSeats = dept.totalSeats;

    const seatDistribution = {
      SM: Math.round(totalSeats * 0.5), // 50% = 15
      EWS: Math.round(totalSeats * 0.1), // 10% = 3
      SC: Math.round(totalSeats * 0.08), // 8% = 2
      ST: Math.round(totalSeats * 0.02), // 2% = 1
      EZ: Math.round(totalSeats * 0.09), // 9% = 3
      M: Math.round(totalSeats * 0.08), // 8% = 2
      BH: Math.round(totalSeats * 0.03), // 3% = 1
      LC: Math.round(totalSeats * 0.03), // 3% = 1
      DV: Math.round(totalSeats * 0.02), // 2% = 1
      VK: Math.round(totalSeats * 0.02), // 2% = 1
      KN: Math.round(totalSeats * 0.01), // 1% = 0
      BX: Math.round(totalSeats * 0.01), // 1% = 0
      KU: Math.round(totalSeats * 0.01), // 1% = 0
      
      // Supernumerary seats
      PD: 2,
      TG: 1,
      SPORTS: 1,
      STAFF: 1,
      CENTRAL: 1
    };

    return {
      ...dept,
      allottedStudents: [],
      filledSeats: 0,
      smSeatsFilled: 0,
      smSeatLimit: seatDistribution.SM,
      seatDistribution,
      categorySeatsFilled: Object.fromEntries(
        [
          'SM', 'EWS', 'SC', 'ST', 
          ...SEBC_CATEGORIES, 
          ...SPECIAL_CATEGORIES
        ].map(cat => [cat, 0])
      ),
    };
  });

  const allotments = new Map();

  // Process candidates in order of merit
  for (const app of sortedEligibleApplications) {
    const choices = extractChoices(app);
    const categoryKey = getCategoryKey(app);
    let allotted = false;

    for (const choice of choices) {
      const deptIndex = updatedDepartments.findIndex((d) => mapDepartmentNameToKey(d.name) === choice);
      if (deptIndex === -1) continue;

      const dept = updatedDepartments[deptIndex];

      // 1. Try to allot under State Merit (SM) first for this choice
      if (dept.smSeatsFilled < dept.seatDistribution.SM) {
        dept.smSeatsFilled++;
        dept.filledSeats++;
        dept.categorySeatsFilled.SM++;
        dept.allottedStudents.push(app.id);
        allotments.set(app.id, {
          ...app,
          allottedDepartment: dept.name,
          allottedCategory: "SM"
        });
        allotted = true;
        break; // Allotted to this choice, stop evaluating further choices
      }

      // 2. If SM is not available, try to allot under their Reservation Category for this choice
      if (categoryKey && categoryKey !== "General" && dept.seatDistribution[categoryKey] > 0 &&
          dept.categorySeatsFilled[categoryKey] < dept.seatDistribution[categoryKey]) {
        
        dept.categorySeatsFilled[categoryKey]++;
        dept.filledSeats++;
        if (SPECIAL_CATEGORIES.includes(categoryKey)) {
          dept.totalSeats++;
        }
        dept.allottedStudents.push(app.id);
        allotments.set(app.id, {
          ...app,
          allottedDepartment: dept.name,
          allottedCategory: categoryKey
        });
        allotted = true;
        break; // Allotted to this choice, stop evaluating further choices
      }

      // 3. Fallback SC/ST/EZ rules for this choice
      if (!allotted && (categoryKey === "ST" || categoryKey === "SC")) {
        // Try ST
        if (categoryKey === "ST" && 
            dept.seatDistribution["ST"] > 0 &&
            dept.categorySeatsFilled["ST"] < dept.seatDistribution["ST"]) {
          dept.categorySeatsFilled["ST"]++;
          dept.filledSeats++;
          dept.allottedStudents.push(app.id);
          allotments.set(app.id, { 
            ...app, 
            allottedDepartment: dept.name,
            allottedCategory: "ST"
          });
          allotted = true;
          break;
        }
        // Try SC next
        else if (dept.seatDistribution["SC"] > 0 &&
                dept.categorySeatsFilled["SC"] < dept.seatDistribution["SC"]) {
          dept.categorySeatsFilled["SC"]++;
          dept.filledSeats++;
          dept.allottedStudents.push(app.id);
          allotments.set(app.id, { 
            ...app, 
            allottedDepartment: dept.name,
            allottedCategory: "SC"
          });
          allotted = true;
          break;
        }
        // Try EZ next
        else if (dept.seatDistribution["EZ"] > 0 &&
                dept.categorySeatsFilled["EZ"] < dept.seatDistribution["EZ"]) {
          dept.categorySeatsFilled["EZ"]++;
          dept.filledSeats++;
          dept.allottedStudents.push(app.id);
          allotments.set(app.id, { 
            ...app, 
            allottedDepartment: dept.name,
            allottedCategory: "EZ"
          });
          allotted = true;
          break;
        }
      }
    }
  }

  // Create final applications array with proper status assignment
  const finalApplications = transformedApplications.map(app => {
    const allottedApp = allotments.get(app.id);
    
    if (allottedApp) {
      return {
        ...app,
        allotmentStatus: "allotted",
        allottedDepartment: allottedApp.allottedDepartment,
        allottedCategory: allottedApp.allottedCategory
      };
    }
    
    // Check if application is eligible for waiting list if exam not attended
    if ((!isValidRank(app.letRank) || app.letRank === "NA" || Number(app.letRank) === 0) && 
        parseFloat(app.distance) <= MAX_DISTANCE &&
        parseFloat(app.mark) >= getMinMarkForCategory(app)) {
      return {
        ...app,
        letRank: 99999,
        allotmentStatus: "not_eligible",
        allottedDepartment: app.priorityChoices?.["1"] || "Computer Science and Engineering",
        allottedCategory: "exam_not_attended"
      };
    }

    if (!isBasicEligible(app)) {
      return {
        ...app,
        allotmentStatus: "not_eligible",
        allottedDepartment: null,
        allottedCategory: null
      };
    }

    // Check if application has insufficient experience
    const exp = parseFloat(app.experience);
    if (isNaN(exp) || exp < MIN_EXPERIENCE) {
      return {
        ...app,
        allotmentStatus: "waiting_list",
        allottedDepartment: "Waiting List",
        allottedCategory: "experience_requirement"
      };
    }
    
    // For eligible but unallotted applications - assign to waiting list
    return {
      ...app,
      allotmentStatus: "waiting_list",
      allottedDepartment: "Waiting List",
      allottedCategory: "not_allotted"
    };
  });

  const statusCounts = {
    allotted: finalApplications.filter(app => app.allotmentStatus === "allotted").length,
    waiting_list: finalApplications.filter(app => app.allotmentStatus === "waiting_list").length,
    not_eligible: finalApplications.filter(app => app.allotmentStatus === "not_eligible").length,
    insufficient_experience: finalApplications.filter(app => app.allottedCategory === "experience_requirement").length,
    sm_allotted: finalApplications.filter(app => app.allottedCategory === "SM").length,
    reservation_allotted: finalApplications.filter(app => app.allotmentStatus === "allotted" && app.allottedCategory !== "SM").length
  };

  return {
    updatedApplications: finalApplications,
    updatedDepartments: updatedDepartments,
    noExamApplications: finalApplications.filter(app => app.allottedCategory === "exam_not_attended"),
    summary: statusCounts
  };
};