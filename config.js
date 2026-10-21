/* ======================================================================
   CONFIG: everything you might want to edit
   Names, track list, album recommendations, and all the teaching text.
   Change the words here; you do not need to touch the other JS files.
   ====================================================================== */

/* --- Your name or group name (shown under the album title) --- */
var ARTIST='Learn Histology';

/* --- The six tracks (title, short description, science tag, time) --- */
var TRACKS=[
 {title:'Cell Introduction',sub:'Introduction!',tag:'Cell parts',dur:'2:30'},
 {title:'Cellular Organization',sub:'Cellular Organization!',tag:'Cells, tissues, organs, systems',dur:'2:30'},
 {title:'COVID-19',sub:'How COVID-19 invades a cell',tag:'Cell membrane and cytoplasm',dur:'3:00'},
 {title:'COVID-19 & The Lungs',sub:'What does COVID-19 do to the lungs?',tag:'Tissues under the microscope',dur:'2:30'},
 {title:'Protect the Lungs',sub:'Protect the lung cells in a game',tag:'Immune response and repair',dur:'2:30'},
 {title:'Final Quiz',sub:'Quiz!',tag:'Review',dur:'2:00'}
];

/* --- "You might also enjoy" albums on the first page ---
   image: path to a picture file, relative to index.html.
   Put the files in the images/recommended/ folder and use that path.
   If the file is missing, a labelled empty box is shown so you can see where it goes. */
var RECOMMENDATIONS=[
 {title:'Midnights',artist:'Taylor Swift',year:'2022',image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM2Wn-CqX8W64GyogthDbI_UaFY_kqrOWOUZBhpzDPLQ&s'},
 {title:'Lover',artist:'Taylor Swift',year:'2019',image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzTDe1bvuKEUBkipaH6fxFhkZ7EdylswkSRenK1Y-Hjw&s=10'},
 {title:'folklore',artist:'Taylor Swift',year:'2020',image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHxA7FokIMuj7dzpgFwDbWkPnMrCxH6F8CFgkincK7eg&s=10'},
 {title:'1989 (Taylor\u2019s Version)',artist:'Taylor Swift',year:'2023',image:'https://upload.wikimedia.org/wikipedia/en/d/d5/Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original'},
 {title:'The Secret of Us',artist:'Gracie Abrams',year:'2024',image:'https://i.pinimg.com/564x/c5/da/20/c5da2065c5c2089159b815891c426ce4.jpg'},
 {title:'Good Riddance',artist:'Gracie Abrams',year:'2023',image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVIl40Yg48_qjMqxDDeCv9Bn8sy-fLZ1lAYJ33UdFQEA&s=10'}
];

/* ======================================================================
   Track 1 text: parts of the cell
   ====================================================================== */
/* name, job (what it does), tw (the COVID-19 twist) */
var CELL_PARTS={
  membrane:{name:'Cell membrane',job:'The cell’s protection, so that only good stuff gets let in and it can keeps bad stuff out.',tw:'The membrane has docking spots called ACE2. The COVID-19 virus has a spike that fits into these.'},
  cytoplasm:{name:'Cytoplasm',job:'The jelly-like fluid that fills the cell. Every other part floats in it, and many other things happen here, like chemical reactions.',tw:'After entering, COVID-19 turns the cytoplasm into its workshop to build copies of itself.'},
  nucleus:{name:'Nucleus',job:'This is the control center of the cell.It stores the cell’s instructions (DNA).',tw:'The virus controls the cell so it follows the virus’s instructions instead of its own.'},
  mito:{name:'Mitochondria',job:'The powerhouse of the cell (the meme). They turn food into energy the cell can use.',tw:'Making virus copies uses lots of energy, so infected cells get worn out and stop doing their normal job.'}
 };

/* ======================================================================
   Track 2 text: zoom levels
   ====================================================================== */
/* k = button name, tx = explanation, tw = COVID-19 twist */
var ZOOM_LEVELS=[
  {k:'Cell',tx:'A cell is the smallest living building block. It has a membrane, cytoplasm, and a nucleus.',tw:'COVID-19 infects one cell at a time.'},
  {k:'Tissue',tx:'A tissue is a group of similar cells that work together to do a similar function. For example, lung lining cells make a thin, smooth sheet so oxygen can slip through.',tw:'When lots of cells are infected, the whole tissue gets swollen and damaged.'},
  {k:'Organ',tx:'An organ is made of different tissues working together. For example, the lungs have lining tissues, blood vessels, muscles and more.',tw:'Damaged tissue means the lungs swap oxygen and carbon dioxide poorly (so sad, no air).'},
  {k:'Organ system',tx:'An organ system is a team of organs with a common goal. For example, the respiratory system brings oxygen in and sends carbon dioxide out.',tw:'That is why COVID-19 can cause a cough and trouble breathing, because of the system it attacks.'}
 ];

/* ======================================================================
   Track 3 text: the four steps of the takeover
   ====================================================================== */
/* h = heading, t = explanation */
var TAKEOVER_STEPS=[
 {h:'1. Dock',t:'The virus spike locks onto an ACE2 receptor on the cell membrane.'},
 {h:'2. Enter',t:'The cell is tricked into letting the virus enter.'},
 {h:'3. Copy',t:'In the cytoplasm, the virus’s genetic material take over the cell’s machinery. Tap "make copies" and watch the energy meter change to visualize this.'},
 {h:'4. Burst',t:'The cell is overloaded and damaged. New viruses can now spread to the neighboring cells.'}
];

/* ======================================================================
   Track 4 text: the four lung clues
   ====================================================================== */
/* [title, what changed, symptom link, hint shown before it is found] */
var TISSUE_CLUES={
  fluid:['Fluid in the air sacs','Air sacs should be full of air so oxygen can diffuse into your blood. Here, fluid is filling them up instead.','This helps explain why you feel short of breath with COVID-19','Something that should not be inside an air sac'],
  lining:['Damaged lining cells','Infected cells die and leave gaps in the wall. The smooth lining is damaged.','This explains why your chest feels irritated and you cough with COVID-19','A wall with gaps in it'],
  immune:['Immune cells rushing in','White blood cells crowd in to fight the virus, which makes the tissue swell. This is called inflammation.','This explains why you get a fever and feel tired with COVID-19','Purple cells crowding together'],
  wall:['Swollen walls','Walls that swell get thick, so oxygen has farther to travel to reach the blood.','This helps explain why breathing feels harder with COVID-19','A wall that got too thick']
 };

/* ======================================================================
   Track 6 text: quiz questions
   ====================================================================== */
/* q = question. a = answers: the FIRST answer is the correct one (they are shuffled on screen). e = explanation. */
var QUIZ=[
  {q:'Which part of the cell makes energy (ATP)?',a:['Mitochondria','Nucleus','Cell membrane','Cytoplasm'],e:'Mitochondria turn food into energy. Making virus copies uses up that energy.'},
  {q:'Which part has the ACE2 docking spots that the virus spike grabs?',a:['Cell membrane','Nucleus','Mitochondria','Cytoplasm'],e:'The membrane is the cell’s skin, and ACE2 sits on it like a lock.'},
  {q:'Where does the virus build copies of itself?',a:['In the cytoplasm','Only in the nucleus','In the air','Inside a red blood cell'],e:'The cytoplasm becomes the virus’s workshop.'},
  {q:'A group of similar cells that work together is called a…',a:['Tissue','Organelle','Organ system','Nucleus'],e:'Lung lining cells team up to form lung lining tissue.'},
  {q:'The lungs are made of several tissues working together. That makes them…',a:['An organ','A single cell','An organelle','A membrane'],e:'Organs are made of different tissues. Organs team up in organ systems.'},
  {q:'Why does fluid in the air sacs make breathing hard?',a:['Oxygen cannot easily get through to the blood','The lungs get too much oxygen','The nucleus stops working','The cells grow extra mitochondria'],e:'Air sacs need to be empty so oxygen can slip into the blood.'}
 ];
