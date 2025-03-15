// Event data with IDs matching MongoDB ObjectIds
const events = [
  {
    id: "67b7102b9a01ff3f0a3c85e1",
    title: "HydroBlasters",
    description: "Get ready for an exciting water-based adventure event featuring water jets and aerodynamics. Participants create rockets using bottles, fill them with water, and launch them, demonstrating creativity, physics, and teamwork.",
    location: "Mechanical Dept, Jadavpur University",
    type: "Hardware Challenge",
    groupSize: "2-3",
    price: 2000.00,
    image: "/images/events/hydro.png",
    finalsDate: "19-03-2025",
    coordinators: [
      { name: "Kaulik Das", phone: " 9830669894" },
      { name: "Avipso Sinha", phone: "94332 43651" },
      { name: "Shayan Charan", phone: "91631 23389" }
    ]
  },
  {
    id: "67b7148d9a01ff3f0a3c85ec",
    title: "Data Mine",
    description: "A code-breaking and puzzle-solving event where participants decode encrypted messages, solve cryptic clues, and crack complex challenges. It tests logical thinking, cryptography knowledge, and problem-solving speed",
    location: "Mechanical Dept, Jadavpur University",
    type: "Simulation Challenge",
    groupSize: "2-4",
    image: "/images/events/datamine.png",
    prelimsDate: "17-03-2025 (online mode)",
    finalsDate: "18-03-2025",
    coordinators: [
      { name: "Tuhin Chakraborty", phone: "9038432263" },
      { name: "Rohit Dutta", phone: "9064890591" },
      { name: "Koustav Das", phone: "8348217647" }
    ]
  },
  {
    id: "67b714449a01ff3f0a3c85e6",
    title: "Model Matrix",
    description: "Gear up to flex your skills in CAD modeling and simulation. Focussed on complex core engineering parts and components, it challenges precision, creativity, and technical expertise in a dynamic and competitive setting.",
    location: "Mechanical Dept, Jadavpur University",
    type: "Simulation Challenge",
    groupSize: "1",
    price: 5000.00,
    image: "/images/events/model.png",
    prelimsDate: "17-03-2025 (online mode)",
    finalsDate: "18-03-2025",
    coordinators: [
      { name: "Debadrita Hazra", phone: "9883311422" },
      { name: "Sourav Paul", phone: "94330 31650" },
      { name: "Koustav Bhattacharjee", phone: "85849 77088" },
      { name: "Soumyojit Biswas", phone: "83890 06855" }
    ]
  },
  {
    id: "67b714799a01ff3f0a3c85ea",
    title: "Clash of Cases",
    description: "Use your skills to analyze real-world business scenarios and present innovative solutions to showcase your problem-solving and analytical thinking abilities",
    location: "Mechanical Dept, Jadavpur University",
    type: "General",
    groupSize: "1",
    image: "/images/events/clash.png",
    prelimsDate: "17-03-2025(online)",
    finalsDate: "18-03-2025",
    coordinators: [
      { name: "Srija Mondal", phone: "8851270470" },
      { name: "Koustav Bhattacharjee", phone: "8584977088" },
      { name: "Nilendu Dikshit", phone: "7797749574" }
    ]
  },
  {
    id: "67b7145e9a01ff3f0a3c85e8",
    title: "Torko Bitorko",
    description: "Be prepared to engage yourself in thought-provoking discussions on general knowledge, core engineering concepts, and current affairs to showcase analytical thinking, argumentation skills and intellectual agility",
    location: "Mechanical Dept, Jadavpur University",
    type: "General",
    groupSize: "1",
    image: "/images/events/debate.png",
    finalsDate: "19-03-2025",
    coordinators: [
      { name: "Mrinmay Tarafdar", phone: "9749386827" },
      { name: "Koustav Das", phone: "8348217647" }
    ]
  },
  {
    id: "67b7141b9a01ff3f0a3c85e4",
    title: "Prot-Egg-t",
    description: "A fun event where participants design protective contraptions to prevent an egg from breaking during a high drop. Teams test creativity and engineering skills by building structures to cushion the egg's impact.",
    location: "Mechanical Dept, Jadavpur University",
    type: "Hardware Challenge",
    groupSize: "2-4",
    price: 2000.00,
    image: "/images/events/egg.png",
    prelimsDate: "17-03-2025",
    finalsDate: "17-03-2025",
    coordinators: [
      { name: "Samriddha Chakraborty", phone: "9330284935" },
      { name: "Mainak Roy", phone: "7908373925" },
      { name: "Satanik Auddy", phone: "9038514040" }
    ]
  },
  {
    id: "67b7146e9a01ff3f0a3c85e9",
    title: "Beyond The Frame",
    description: "Grasp the oppurtunity to capture the world from a unique perspective. This event challenges creativity in storytelling, showcasing extraordinary moments that highlight life's beauty and intricacies.",
    location: "Mechanical Dept, Jadavpur University",
    type: "Fun Activities",
    groupSize: "1",
    price: 2000.00,
    image: "/images/events/frame.png",
    prelimsDate: "17-03-2025 & 18-03-2025",
    finalsDate: "19-03-2025",
    coordinators: [
      { name: "Arijit Mandal:", phone: "89107 10278" },
      { name: "Soham Sharma Sarkar", phone: "98369 37267" },
      { name: "Souranshu Roy Chaudhuri", phone: "81005 35494" },
      { name: "Deepayan Roy", phone: "70475 21166" }
    ]
  },
  {
    id: "67b710919a01ff3f0a3c85e2",
    title: "Robo League",
    description: "Buckle up to build and program robots to play soccer autonomously or via remote control. Teams compete by scoring goals in a fast-paced, strategy-driven match on a mini soccer field.",
    location: "Mechanical Dept, Jadavpur University",
    type: "Hardware Challenge",
    groupSize: "2-5",
    price: 6000.00,
    image: "/images/events/robo.png",
    prelimsDate: "18-03-2025",
    finalsDate: "18-03-2025",
    coordinators: [
      { name: "Arijit Mandal", phone: "" },
      { name: "Nabyendu Ghosh", phone: "" },
      { name: "Nilendu Dikshit", phone: "" },
      { name: "Dipayan Mandal", phone: "" }
    ]
  },
  {
    id: "67b714529a01ff3f0a3c85e7",
    title: "Gyan Yudh",
    description: "Test your knowledge in a variety of subjects in this quiz competition. It challenges intellect, speed, and awareness, offering a thrilling battle of wits for all knowledge enthusiasts.",
    location: "Lecture Hall, Jadavpur University",
    type: "General",
    groupSize: "1-3",
    price: 1000.00,
    image: "/images/events/qui.png",
    prelimsDate: "18-03-2025",
    finalsDate: "19-03-2025",
    coordinators: [
      { name: "Sayan Das", phone: "" },
      { name: "Samrat Roy Chowdhuri", phone: "99339 03605" },
      { name: "Sampad Chanda", phone: "91261 27847" }
    ]
  },
  {
    id: "67b710b69a01ff3f0a3c85e3",
    title: "Mazecraft",
    description: "Design and construct a line-following robot that navigates a predefined path.",
    location: "Mechanical Dept, Jadavpur University",
    type: "Hardware Challenge",
    groupSize: "3-6",
    price: 6000.00,
    image: "/images/events/maze.png",
    prelimsDate: "18-03-2025",
    finalsDate: "18-03-2025",
    coordinators: [
      { name: "Rohit Dutta", phone: "" },
      { name: "Satyam", phone: "" },
      { name: "Antan", phone: "" },
      { name: "Abhirup Guha Roy", phone: "" }
    ]
  }
];

// Function to get event details by ID
function getEventById(id) {
  return events.find(event => event.id === id) || null;
}

module.exports = { events, getEventById }; 